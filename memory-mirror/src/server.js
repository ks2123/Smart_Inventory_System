const env = require('./config/env');
const app = require('./app');

const server = app.listen(env.PORT, () =>
  console.log(`Memory Mirror API listening on :${env.PORT} (${env.NODE_ENV})`)
);

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
