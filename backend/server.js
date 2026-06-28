require('dotenv').config();

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const path         = require('path');

const connectDB    = require('./config/db');
const seedAdmin    = require('./utils/seedAdmin');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// ── CRUD factory wiring ─────────────────────────────────────────────────────
const crudFactory  = require('./controllers/crudFactory');
const crudRoutes   = require('./routes/crudRoutes');

const Social        = require('./models/Social');
const Education     = require('./models/Education');
const Skill         = require('./models/Skill');
const Project       = require('./models/Project');
const Experience    = require('./models/Experience');
const Achievement   = require('./models/Achievement');
const Certification = require('./models/Certification');
const Interest      = require('./models/Interest');

// ── App ─────────────────────────────────────────────────────────────────────
const app = express();

// ── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images from /uploads
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
// BUG FIX: Added 'null' origin (file:// protocol) and common live-server ports.
// credentials: true is required so the browser sends the JWT cookie.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5500',
  'http://localhost:5501',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
  'http://192.168.55.103:5500',
  'http://192.168.56.1:5500',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow:
    //   1. Requests with no origin (curl, Postman, mobile apps)
    //   2. null origin (file:// direct open) — treated as allowed in dev
    //   3. Origins in the whitelist
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    console.warn(`CORS blocked: ${origin}`);
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  credentials: true, // CRITICAL: must be true to send/receive cookies
}));

// ── Body parsers ─────────────────────────────────────────────────────────────
// BUG FIX: cookieParser MUST come before any route that reads req.cookies.
// Previously this was already correct, keeping the same order.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Static file serving for uploads ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/profile',   require('./routes/profile'));
app.use('/api/config',    require('./routes/config'));
app.use('/api/upload',    require('./routes/upload'));

// Auto-wired CRUD routes
app.use('/api/socials',        crudRoutes(crudFactory(Social,        ['icon','url','order'])));
app.use('/api/education',      crudRoutes(crudFactory(Education,     ['degree','institution','year','description','order'])));
app.use('/api/skills',         crudRoutes(crudFactory(Skill,         ['name','level','category','order'])));
app.use('/api/projects',       crudRoutes(crudFactory(Project,       ['title','description','tech','imageUrl','github','demo','order'])));
app.use('/api/experience',     crudRoutes(crudFactory(Experience,    ['role','company','duration','description','order'])));
app.use('/api/achievements',   crudRoutes(crudFactory(Achievement,   ['title','description','year','order'])));
app.use('/api/certifications', crudRoutes(crudFactory(Certification, ['name','issuer','year','imageUrl','order'])));
app.use('/api/interests',      crudRoutes(crudFactory(Interest,      ['name','icon','order'])));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Portfolio API is running.', env: process.env.NODE_ENV });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
  });
});
