import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import pg from "pg";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT =
  Number(process.env.API_PORT) ||
  (process.env.RENDER ? Number(process.env.PORT) : 0) ||
  4173;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");
const DIST_DIR = path.join(__dirname, "dist");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ["Keerthan", "@", "7956"].join("");
const REQUIRED_FIELDS = ["name", "phone", "email", "devotees", "seva", "festivalDay"];
const DATABASE_URL = process.env.DATABASE_URL || "";

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: /sslmode=require|neon\.tech|supabase/.test(DATABASE_URL)
        ? { rejectUnauthorized: false }
        : undefined,
      max: 5,
      idleTimeoutMillis: 30_000,
    })
  : null;

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS registrations (
    id text PRIMARY KEY,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    devotees text NOT NULL,
    seva text NOT NULL,
    festival_day text NOT NULL,
    sankalpa text NOT NULL DEFAULT '',
    created_at text NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now()
  )
`;

const FIELD_LIST = [
  "id",
  "name",
  "phone",
  "email",
  "devotees",
  "seva",
  "festival_day",
  "sankalpa",
  "created_at",
];

function rowToRegistration(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    devotees: row.devotees,
    seva: row.seva,
    festivalDay: row.festival_day,
    sankalpa: row.sankalpa,
    createdAt: row.created_at,
  };
}

function readFileRegistrations() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFileRegistrations(registrations) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(registrations, null, 2));
  fs.renameSync(tempFile, DATA_FILE);
}

function createFileId(registrations) {
  let id = "";
  do {
    id = `SDD-${Date.now().toString().slice(-6)}`;
  } while (registrations.some((registration) => registration.id === id));
  return id;
}

async function initDatabase() {
  if (!pool) return;
  await pool.query(CREATE_TABLE_SQL);
}

async function listRegistrations() {
  if (!pool) return readFileRegistrations();
  const result = await pool.query(
    `SELECT ${FIELD_LIST.join(", ")} FROM registrations ORDER BY received_at DESC`,
  );
  return result.rows.map(rowToRegistration);
}

async function insertRegistration(registration) {
  if (!pool) {
    const existing = readFileRegistrations();
    const toSave = { ...registration, id: createFileId(existing) };
    writeFileRegistrations([toSave, ...existing]);
    return toSave;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = `SDD-${Date.now().toString().slice(-6)}${attempt > 0 ? `-${attempt}` : ""}`;
    try {
      const result = await pool.query(
        `INSERT INTO registrations (${FIELD_LIST.join(", ")})
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING ${FIELD_LIST.join(", ")}`,
        [
          id,
          registration.name,
          registration.phone,
          registration.email,
          registration.devotees,
          registration.seva,
          registration.festivalDay,
          registration.sankalpa,
          registration.createdAt,
        ],
      );
      return rowToRegistration(result.rows[0]);
    } catch (error) {
      if (error.code !== "23505") throw error;
    }
  }
  throw new Error("Could not generate a unique registration id");
}

async function clearRegistrations() {
  if (!pool) {
    writeFileRegistrations([]);
    return;
  }
  await pool.query("DELETE FROM registrations");
}

function sanitize(body) {
  const missing = REQUIRED_FIELDS.filter((field) => !String(body[field] ?? "").trim());
  if (missing.length > 0) {
    const error = new Error(`Missing fields: ${missing.join(", ")}`);
    error.status = 422;
    throw error;
  }
  return {
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    email: String(body.email).trim(),
    devotees: String(body.devotees).trim(),
    seva: String(body.seva).trim(),
    festivalDay: String(body.festivalDay).trim(),
    sankalpa: String(body.sankalpa ?? "").trim(),
    createdAt: String(body.createdAt ?? new Date().toLocaleString()).trim(),
  };
}

function handle(error, res) {
  console.error(error);
  res.status(error.status || 503).json({ error: error.message || "Storage unavailable" });
}

const app = express();
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", async (_req, res) => {
  try {
    if (pool) await pool.query("SELECT 1");
    res.json({ ok: true, storage: pool ? "database" : "file" });
  } catch (error) {
    handle(error, res);
  }
});

app.get("/api/registrations", async (_req, res) => {
  try {
    res.json({ registrations: await listRegistrations() });
  } catch (error) {
    handle(error, res);
  }
});

app.post("/api/registrations", async (req, res) => {
  try {
    const registration = sanitize(req.body ?? {});
    res.status(201).json({ registration: await insertRegistration(registration) });
  } catch (error) {
    handle(error, res);
  }
});

app.delete("/api/registrations", async (req, res) => {
  if (req.get("x-admin-password") !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await clearRegistrations();
    res.json({ registrations: [] });
  } catch (error) {
    handle(error, res);
  }
});

app.use(express.static(DIST_DIR));
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"), (error) => {
    if (error) res.status(404).send("Not found");
  });
});

try {
  await initDatabase();
} catch (error) {
  console.error("Database init failed:", error);
}

app.listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT} using ${pool ? "database" : "file"} storage`,
  );
});
