/**
 * Fail fast with a clear message if required env vars are missing.
 * On Render, set variables in the service Environment tab (repo .env is not deployed).
 */
const required = ['MONGO_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  console.error(
    `[ENV] Missing required variable(s): ${missing.join(', ')}. Add them in Render → Environment (or backend/.env locally).`
  );
  process.exit(1);
}

module.exports = { validateEnv };
