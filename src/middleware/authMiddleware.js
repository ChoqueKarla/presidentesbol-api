// src/middleware/authMiddleware.js
const { supabaseAdmin } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Token inválido' });

    req.user = data.user;
    next();
  } catch (err) {
    console.error("ERROR AUTHENTICATE:", err);
    res.status(500).json({ error: 'Error interno de autenticación' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', req.user.id)
      .single();

    if (error || !data) return res.status(403).json({ error: 'Error verificando admin' });
    if (!data.is_admin) return res.status(403).json({ error: 'Acceso denegado' });

    next();
  } catch (err) {
    console.error("ERROR ISADMIN:", err);
    res.status(500).json({ error: 'Error interno de verificación de admin' });
  }
};

module.exports = { authenticate, isAdmin };