const crypto = require('crypto');
const env = require('../config/env');
const supabase = require('../config/supabase');
const { HttpError } = require('../utils/errors');

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// Don't trust the client-declared mimetype alone: verify magic bytes.
function assertImageSignature(file) {
  const b = file.buffer;
  const ok =
    (file.mimetype === 'image/jpeg' && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) ||
    (file.mimetype === 'image/png' && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) ||
    (file.mimetype === 'image/webp' &&
      b.subarray(0, 4).toString() === 'RIFF' &&
      b.subarray(8, 12).toString() === 'WEBP');
  if (!ok) throw new HttpError(415, 'File content does not match a valid JPEG/PNG/WebP image');
}

async function uploadAssetImage(uid, file) {
  assertImageSignature(file);
  const path = `${uid}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${EXT[file.mimetype]}`;
  const { error } = await supabase.storage.from(env.SUPABASE_BUCKET).upload(path, file.buffer, {
    contentType: file.mimetype,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    console.error('[storage]', error);
    throw new HttpError(502, 'Image upload failed');
  }
  const { data } = supabase.storage.from(env.SUPABASE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function deleteAssetImage(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(env.SUPABASE_BUCKET).remove([path]);
  if (error) console.error('[storage] cleanup failed for', path, error.message);
}

module.exports = { uploadAssetImage, deleteAssetImage };
