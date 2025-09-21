// app.js
const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();

// ==================== CONFIGURAZIONE SUPABASE ====================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERRORE: SUPABASE_URL o SUPABASE_KEY mancanti.");
  process.exit(1); // esce se non trova le variabili
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== CONFIGURAZIONE EXPRESS ====================
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ==================== API ====================

// Test
app.get("/api", (req, res) => {
  res.send("✅ Backend attivo!");
});

// Risorse
app.get("/api/risorse", async (req, res) => {
  const { data, error } = await supabase.from("risorse").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/api/risorse", async (req, res) => {
  const { titolo, descrizione, categoria, grado, tipo, contenuto, tag } = req.body;
  const { data, error } = await supabase
    .from("risorse")
    .insert([{ titolo, descrizione, categoria, grado, tipo, contenuto, tag }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Minicorsi
app.get("/api/minicorsi", async (req, res) => {
  const { data, error } = await supabase.from("minicorsi").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/api/minicorsi", async (req, res) => {
  const { titolo, descrizione, categoria, risorse } = req.body;
  const { data, error } = await supabase
    .from("minicorsi")
    .insert([{ titolo, descrizione, categoria, risorse }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// ==================== FRONTEND ====================

// Servire i file statici dal frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rotta di fallback → index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ==================== AVVIO SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server avviato su http://localhost:${PORT}`));

