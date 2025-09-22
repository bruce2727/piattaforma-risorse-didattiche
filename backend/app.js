const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Configurazione Supabase (usa variabili da .env in produzione)
const supabaseUrl = process.env.SUPABASE_URL || "https://fjnsmhqsbepyofulaeql.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "TUO_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- API ---
app.get('/api/risorse', async (req, res) => {
  const { data, error } = await supabase.from('risorse').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/risorse', async (req, res) => {
  const { titolo, descrizione, categoria, grado, tipo, contenuto, tag } = req.body;
  const { data, error } = await supabase
    .from('risorse')
    .insert([{ titolo, descrizione, categoria, grado, tipo, contenuto, tag }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/risorse/:id', async (req, res) => {
  const { id } = req.params;
  const { titolo, descrizione, categoria, grado, tipo, contenuto, tag } = req.body;
  const { data, error } = await supabase
    .from('risorse')
    .update({ titolo, descrizione, categoria, grado, tipo, contenuto, tag })
    .eq('id', id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/risorse/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('risorse').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// --- API Minicorsi ---
app.get('/api/minicorsi', async (req, res) => {
  const { data, error } = await supabase.from('minicorsi').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/minicorsi', async (req, res) => {
  const { titolo, descrizione, categoria, risorse } = req.body;
  const { data, error } = await supabase
    .from('minicorsi')
    .insert([{ titolo, descrizione, categoria, risorse }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/minicorsi/:id', async (req, res) => {
  const { id } = req.params;
  const { titolo, descrizione, categoria, risorse } = req.body;
  const { data, error } = await supabase
    .from('minicorsi')
    .update({ titolo, descrizione, categoria, risorse })
    .eq('id', id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/minicorsi/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('minicorsi').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// --- Serve il frontend ---
app.use(express.static(path.join(__dirname, '../frontend')));

// Se la rotta non è API, restituisce index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Avvio server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server attivo su porta ${PORT}`));
