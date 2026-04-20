const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/authMiddleware');

// GET progreso del usuario
router.get('/me', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`*, lessons(title, xp_reward)`)
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST completar lección
router.post('/complete', authenticate, async (req, res) => {
  const { lesson_id, score } = req.body;
  const xpReward = score >= 80 ? 15 : score >= 60 ? 10 : 5;

  const { data: progress, error: progError } = await supabaseAdmin
    .from('user_progress')
    .upsert({
      user_id: req.user.id,
      lesson_id,
      completed: true,
      score,
      completed_at: new Date()
    }, { onConflict: 'user_id,lesson_id' })
    .select()
    .single();

  if (progError) return res.status(400).json({ error: progError.message });

  // Sumar XP al perfil
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('xp, streak, last_study_date')
    .eq('id', req.user.id)
    .single();

  const today = new Date().toISOString().split('T')[0];
  const lastDate = profile?.last_study_date;
  const isConsecutive = lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = isConsecutive ? (profile.streak || 0) + 1 : 1;

  await supabaseAdmin
    .from('profiles')
    .update({
      xp: (profile?.xp || 0) + xpReward,
      streak: newStreak,
      last_study_date: today
    })
    .eq('id', req.user.id);

  res.json({ progress, xp_earned: xpReward, new_streak: newStreak });
});

// GET leaderboard (top 20)
router.get('/leaderboard', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, xp, streak')
    .order('xp', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;