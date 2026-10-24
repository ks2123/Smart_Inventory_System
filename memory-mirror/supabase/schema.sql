-- =====================================================================
-- Project Memory Mirror - Supabase schema
-- Run once in: Supabase Dashboard -> SQL Editor
-- =====================================================================
create extension if not exists pgcrypto;

-- ---------- Enums -----------------------------------------------------
create type asset_status as enum ('active', 'under_maintenance', 'faulty', 'retired');
create type log_type     as enum ('inspection', 'repair', 'calibration', 'cleaning', 'part_replacement', 'other');

-- ---------- Assets ----------------------------------------------------
create table public.assets (
  id            uuid primary key default gen_random_uuid(),
  uid           text not null unique
                  check (uid ~ '^[0-9A-F]{8,20}$'),            -- RFID tag UID, upper-case hex
  item_name     text not null check (char_length(item_name) between 1 and 200),
  category      text not null,
  department    text not null,                                 -- department / lab name
  purchase_date date,
  cost          numeric(12,2) check (cost >= 0),
  status        asset_status not null default 'active',
  image_url     text,                                          -- public URL of the item photo
  image_path    text,                                          -- storage object path (for replace/delete)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index assets_department_idx on public.assets (department);
create index assets_category_idx   on public.assets (category);
create index assets_status_idx     on public.assets (status);

-- ---------- Maintenance logs (append-only audit trail) -----------------
create table public.maintenance_logs (
  id             uuid primary key default gen_random_uuid(),
  asset_uid      text not null references public.assets(uid) on update cascade on delete cascade,
  assistant_name text not null,
  log_date       date not null default current_date,
  log_type       log_type not null default 'inspection',
  description    text not null check (char_length(description) >= 3),
  parts_replaced text[] not null default '{}',
  created_at     timestamptz not null default now()
);

create index maintenance_logs_uid_date_idx on public.maintenance_logs (asset_uid, log_date desc, created_at desc);

-- ---------- Scan history (who scanned what, when) ---------------------
create table public.scan_events (
  id         bigint generated always as identity primary key,
  uid        text not null,
  device_id  text,
  found      boolean not null,
  scanned_at timestamptz not null default now()
);
create index scan_events_uid_idx on public.scan_events (uid, scanned_at desc);

-- ---------- Triggers --------------------------------------------------
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger assets_set_updated_at before update on public.assets
  for each row execute function public.set_updated_at();

-- Logs are an audit trail: edits are forbidden (inserts only; deletes only via asset cascade)
create or replace function public.forbid_log_update() returns trigger language plpgsql as $$
begin raise exception 'maintenance_logs rows are immutable'; end $$;

create trigger maintenance_logs_no_update before update on public.maintenance_logs
  for each row execute function public.forbid_log_update();

-- ---------- Atomic "add log (+ optional status change)" ---------------
create or replace function public.add_maintenance_log(
  p_uid            text,
  p_assistant_name text,
  p_description    text,
  p_log_date       date          default current_date,
  p_parts_replaced text[]        default '{}',
  p_log_type       log_type      default 'inspection',
  p_status_after   asset_status  default null
) returns public.maintenance_logs
language plpgsql as $$
declare v_log public.maintenance_logs;
begin
  perform 1 from public.assets where uid = p_uid for update;
  if not found then
    raise exception 'ASSET_NOT_FOUND' using errcode = 'P0002';
  end if;

  insert into public.maintenance_logs (asset_uid, assistant_name, log_date, log_type, description, parts_replaced)
  values (p_uid, p_assistant_name, p_log_date, p_log_type, p_description, coalesce(p_parts_replaced, '{}'))
  returning * into v_log;

  if p_status_after is not null then
    update public.assets set status = p_status_after where uid = p_uid;
  end if;
  return v_log;
end $$;

revoke execute on function public.add_maintenance_log(text,text,text,date,text[],log_type,asset_status)
  from public, anon, authenticated;
grant  execute on function public.add_maintenance_log(text,text,text,date,text[],log_type,asset_status)
  to service_role;

-- ---------- Row Level Security ----------------------------------------
-- The Express backend uses the service_role key (bypasses RLS) for ALL writes.
-- Policies below only let a logged-in dashboard read directly via supabase-js if you want to.
alter table public.assets           enable row level security;
alter table public.maintenance_logs enable row level security;
alter table public.scan_events      enable row level security;

create policy "staff can read assets" on public.assets
  for select to authenticated using (true);
create policy "staff can read logs" on public.maintenance_logs
  for select to authenticated using (true);
create policy "staff can read scans" on public.scan_events
  for select to authenticated using (true);
-- No INSERT/UPDATE/DELETE policies => anon & authenticated users can never write directly.

-- ---------- Storage bucket for item photos ----------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('asset-images', 'asset-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Anyone can VIEW photos (public URLs work in <img> tags and on the OLED companion UI).
create policy "public read asset images" on storage.objects
  for select using (bucket_id = 'asset-images');
-- Uploads/deletes happen only through the backend (service_role), so no write policies.
