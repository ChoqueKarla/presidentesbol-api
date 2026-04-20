// src/routes/presidents.js
const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// GET todos
router.get('/', async (req, res) => {
  try {
    console.log("Recibí request GET /api/presidents");
    const { data, error } = await supabase.from('presidents').select('*').order('order_number');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("ERROR GET PRESIDENTES:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('presidents').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("ERROR GET PRESIDENT BY ID:", err);
    res.status(404).json({ error: 'Presidente no encontrado' });
  }
});

// POST crear presidente (admin)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    console.log("BODY RECIBIDO POST:", req.body);
    const { data, error } = await supabaseAdmin.from('presidents').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("ERROR POST PRESIDENT:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT actualizar presidente (admin)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    console.log("BODY RECIBIDO PUT:", req.body);
    const { data, error } = await supabaseAdmin.from('presidents').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("ERROR PUT PRESIDENT:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE presidente (admin)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('presidents').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Presidente eliminado correctamente' });
  } catch (err) {
    console.error("ERROR DELETE PRESIDENT:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;