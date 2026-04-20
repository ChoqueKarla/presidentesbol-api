// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const presidentsRouter = require('./src/routes/presidents');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'PresidentesBol API' }));

app.use('/api/presidents', presidentsRouter);

app.listen(PORT, () => console.log(`PresidentesBol API corriendo en puerto ${PORT}`));