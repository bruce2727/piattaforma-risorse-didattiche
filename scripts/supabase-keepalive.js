// scripts/supabase-keepalive.js
// Pinga Supabase facendo una richiesta REST minimale su una tabella.
// Usa la SERVICE_ROLE_KEY (server-side) per evitare problemi di RLS.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Scegli una tabella "leggera" e sempre presente (es: profiles, settings, ecc.)
const PING_TABLE = process.env.SUPABASE_PING_TABLE || "profiles";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing env vars: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const endpoint = `${SUPABASE_URL}/rest/v1/${PING_TABLE}?select=*&limit=1`;

(async () => {
  const started = Date.now();

  const res = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  const ms = Date.now() - started;

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error(`Ping failed (${res.status}) in ${ms}ms`);
    console.error(txt.slice(0, 500));
    process.exit(1);
  }

  console.log(`Supabase ping OK (${res.status}) in ${ms}ms -> ${PING_TABLE}`);
  process.exit(0);
})();
