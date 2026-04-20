const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/authMiddleware');

// GET todos los módulos con lecciones
router.get('/modules', async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select(`*, lessons(*, presidents(name, image_url))`)
    .eq('is_active', true)
    .order('order_number');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET preguntas de una lección
router.get('/:id/questions', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;