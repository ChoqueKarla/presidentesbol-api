// src/routes/presidents.js
const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase'); // solo usar Service Role Key

// GET todos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('presidents').select('*').order('order_number');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('presidents').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Presidente no encontrado' });
  }
});

// POST crear presidente (público)
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('presidents').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT actualizar presidente (público)
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('presidents').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE presidente (público)
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('presidents').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Presidente eliminado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;