// RC522 UIDs are 4, 7 or 10 bytes -> 8, 14 or 20 hex chars.
// Accepts "04:A3:2F:1B", "04-a3-2f-1b", "04A32F1B" ... and returns "04A32F1B".
function normalizeUid(raw) {
  if (typeof raw !== 'string') return null;
  const uid = raw.replace(/[\s:\-]/g, '').toUpperCase();
  return /^[0-9A-F]{8,20}$/.test(uid) ? uid : null;
}

module.exports = { normalizeUid };
