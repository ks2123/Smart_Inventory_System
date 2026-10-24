class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Translate Postgres / PostgREST error codes into HTTP errors.
function dbError(error) {
  const map = {
    '23505': [409, 'An asset with this UID already exists'],
    P0002: [404, 'Asset not found'],
    '23514': [400, 'A value violates a database constraint'],
    '22P02': [400, 'A value has an invalid format'],
    '22007': [400, 'A date has an invalid format'],
  };
  const hit = map[error.code];
  if (hit) return new HttpError(hit[0], hit[1]);
  console.error('[db]', error);
  return new HttpError(500, 'Database error');
}

module.exports = { HttpError, asyncHandler, dbError };
