// Import dipendenze
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Configurazione Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configurazione Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- API DI TEST ---
app.get('/', (req, res) => {
  res.send('✅ Backend attivo e collegato a Supabase!');
});

// --- RISORSE ---

// Leggi tutte le risorse
app.get('/api/risorse', async (req, res) => {
  const { data, error } = await supabase.from('risorse').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Aggiungi una risorsa
app.post('/api/risorse', async (req, res) => {
  const { titolo, descrizione, categoria, grado, tipo, contenuto, tag } = req.body;
  const { data, error } = await supabase
    .from('risorse')
    .insert([{ titolo, descrizione, categoria, grado, tipo, contenuto, tag }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Modifica una risorsa
app.put('/api/risorse/:id', async (req, res) => {
  const { id } = req.params;
  const { titolo, descrizione, categoria, grado, tipo, contenuto, tag } = req.body;
  const { data, error } = await supabase
    .from('risorse')
    .update({ titolo, descrizione, categoria, grado, tipo, contenuto, tag })
    .eq('id', id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Elimina una risorsa
app.delete('/api/risorse/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('risorse').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// --- MINICORSI ---

// Leggi tutti i minicorsi
app.get('/api/minicorsi', async (req, res) => {
  const { data, error } = await supabase.from('minicorsi').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Aggiungi un minicorso
app.post('/api/minicorsi', async (req, res) => {
  const { titolo, descrizione, categoria, risorse, tag } = req.body;
  const { data, error } = await supabase
    .from('minicorsi')
    .insert([{ titolo, descrizione, categoria, risorse, tag }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Modifica un minicorso
app.put('/api/minicorsi/:id', async (req, res) => {
  const { id } = req.params;
  const { titolo, descrizione, categoria, risorse, tag } = req.body;
  const { data, error } = await supabase
    .from('minicorsi')
    .update({ titolo, descrizione, categoria, risorse, tag })
    .eq('id', id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Elimina un minicorso
app.delete('/api/minicorsi/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('minicorsi').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server avviato su porta ${PORT}`));
