import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, getDb } from './database.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseBucket = process.env.SUPABASE_BUCKET_NAME || 'portfolio-media';

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Supabase Storage client initialized.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyber_security_key_for_dileep_portfolio';

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure Uploads Directory Exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve Uploads Folder Statically
app.use('/uploads', express.static(uploadsDir));

// Initialize Database
initDb().then(() => {
  console.log('Database initialized successfully.');
}).catch((err) => {
  console.error('Database initialization failed:', err);
});

const db = getDb();

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- MULTER FILE UPLOAD SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (PNG, JPG, JPEG, GIF, WEBP, SVG) and PDFs are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});


// ==========================================
// 🔑 AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!admin) return res.status(400).json({ error: 'Invalid username or password' });

    const passwordIsValid = bcrypt.compareSync(password, admin.password_hash);
    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});


// ==========================================
// 🌐 PUBLIC ENDPOINTS (No Authentication Required)
// ==========================================

app.get('/api/public/profile', (req, res) => {
  db.get("SELECT * FROM profiles ORDER BY id LIMIT 1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.get('/api/public/projects', (req, res) => {
  db.all("SELECT * FROM projects WHERE published = 1 ORDER BY featured DESC, display_order ASC, created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse technologies and gallery images from JSON strings
    const projects = rows.map(r => ({
      ...r,
      technologies: r.technologies ? JSON.parse(r.technologies) : [],
      gallery_images: r.gallery_images ? JSON.parse(r.gallery_images) : []
    }));
    res.json(projects);
  });
});

app.get('/api/public/experiences', (req, res) => {
  db.all("SELECT * FROM experiences WHERE published = 1 ORDER BY display_order ASC, start_date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const experiences = rows.map(r => ({
      ...r,
      bullet_points: r.bullet_points ? JSON.parse(r.bullet_points) : [],
      technologies: r.technologies ? JSON.parse(r.technologies) : []
    }));
    res.json(experiences);
  });
});

app.get('/api/public/skills', (req, res) => {
  db.all("SELECT * FROM skills WHERE published = 1 ORDER BY category ASC, display_order ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/public/certificates', (req, res) => {
  db.all("SELECT * FROM certificates WHERE published = 1 ORDER BY display_order ASC, issue_date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/public/achievements', (req, res) => {
  db.all("SELECT * FROM achievements WHERE published = 1 ORDER BY display_order ASC, date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/public/education', (req, res) => {
  db.all("SELECT * FROM education WHERE published = 1 ORDER BY display_order ASC, start_year DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/public/social-links', (req, res) => {
  db.all("SELECT * FROM social_links WHERE published = 1 ORDER BY display_order ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/public/settings', (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  db.run("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
    [name, email, subject, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});


// ==========================================
// 🛡️ ADMIN ENDPOINTS (Authentication Required)
// ==========================================

// --- PROFILE ---
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get("SELECT * FROM profiles ORDER BY id LIMIT 1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const { name, title, intro, about, location, email, phone, profile_image, resume_url } = req.body;
  
  db.run(`UPDATE profiles SET name = ?, title = ?, intro = ?, about = ?, location = ?, email = ?, phone = ?, profile_image = ?, resume_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM profiles ORDER BY id LIMIT 1)`,
    [name, title, intro, about, location, email, phone, profile_image, resume_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// --- PROJECTS ---
app.get('/api/projects', authenticateToken, (req, res) => {
  db.all("SELECT * FROM projects ORDER BY display_order ASC, created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const projects = rows.map(r => ({
      ...r,
      technologies: r.technologies ? JSON.parse(r.technologies) : [],
      gallery_images: r.gallery_images ? JSON.parse(r.gallery_images) : []
    }));
    res.json(projects);
  });
});

app.get('/api/projects/:id', authenticateToken, (req, res) => {
  db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Project not found' });
    
    const project = {
      ...row,
      technologies: row.technologies ? JSON.parse(row.technologies) : [],
      gallery_images: row.gallery_images ? JSON.parse(row.gallery_images) : []
    };
    res.json(project);
  });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { title, short_description, full_description, category, technologies, image, gallery_images, github_url, live_demo_url, video_url, featured, status, start_date, end_date, display_order, published, problem, solution, role, outcome } = req.body;

  db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, gallery_images, github_url, live_demo_url, video_url, featured, status, start_date, end_date, display_order, published, problem, solution, role, outcome) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title, short_description, full_description, category, 
      JSON.stringify(technologies || []), image, JSON.stringify(gallery_images || []), 
      github_url, live_demo_url, video_url, 
      featured ? 1 : 0, status || 'Published', start_date, end_date, 
      display_order || 0, published ? 1 : 0, problem, solution, role, outcome
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const { title, short_description, full_description, category, technologies, image, gallery_images, github_url, live_demo_url, video_url, featured, status, start_date, end_date, display_order, published, problem, solution, role, outcome } = req.body;

  db.run(`UPDATE projects SET title = ?, short_description = ?, full_description = ?, category = ?, technologies = ?, image = ?, gallery_images = ?, github_url = ?, live_demo_url = ?, video_url = ?, featured = ?, status = ?, start_date = ?, end_date = ?, display_order = ?, published = ?, problem = ?, solution = ?, role = ?, outcome = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      title, short_description, full_description, category, 
      JSON.stringify(technologies || []), image, JSON.stringify(gallery_images || []), 
      github_url, live_demo_url, video_url, 
      featured ? 1 : 0, status, start_date, end_date, 
      display_order || 0, published ? 1 : 0, problem, solution, role, outcome,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- EXPERIENCES ---
app.get('/api/experiences', authenticateToken, (req, res) => {
  db.all("SELECT * FROM experiences ORDER BY display_order ASC, start_date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const experiences = rows.map(r => ({
      ...r,
      bullet_points: r.bullet_points ? JSON.parse(r.bullet_points) : [],
      technologies: r.technologies ? JSON.parse(r.technologies) : []
    }));
    res.json(experiences);
  });
});

app.get('/api/experiences/:id', authenticateToken, (req, res) => {
  db.get("SELECT * FROM experiences WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Experience not found' });
    
    const exp = {
      ...row,
      bullet_points: row.bullet_points ? JSON.parse(row.bullet_points) : [],
      technologies: row.technologies ? JSON.parse(row.technologies) : []
    };
    res.json(exp);
  });
});

app.post('/api/experiences', authenticateToken, (req, res) => {
  const { company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, logo_url, display_order, published } = req.body;

  db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, logo_url, display_order, published) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      company, role, type, location, start_date, end_date, 
      currently_working ? 1 : 0, description, 
      JSON.stringify(bullet_points || []), JSON.stringify(technologies || []), 
      logo_url, display_order || 0, published ? 1 : 0
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/experiences/:id', authenticateToken, (req, res) => {
  const { company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, logo_url, display_order, published } = req.body;

  db.run(`UPDATE experiences SET company = ?, role = ?, type = ?, location = ?, start_date = ?, end_date = ?, currently_working = ?, description = ?, bullet_points = ?, technologies = ?, logo_url = ?, display_order = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      company, role, type, location, start_date, end_date, 
      currently_working ? 1 : 0, description, 
      JSON.stringify(bullet_points || []), JSON.stringify(technologies || []), 
      logo_url, display_order || 0, published ? 1 : 0,
      req.params.id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/experiences/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM experiences WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- SKILLS ---
app.get('/api/skills', authenticateToken, (req, res) => {
  db.all("SELECT * FROM skills ORDER BY display_order ASC, category ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/skills', authenticateToken, (req, res) => {
  const { name, category, icon, proficiency, display_order, published } = req.body;

  db.run(`INSERT INTO skills (name, category, icon, proficiency, display_order, published) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, icon, proficiency, display_order || 0, published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/skills/:id', authenticateToken, (req, res) => {
  const { name, category, icon, proficiency, display_order, published } = req.body;

  db.run(`UPDATE skills SET name = ?, category = ?, icon = ?, proficiency = ?, display_order = ?, published = ? WHERE id = ?`,
    [name, category, icon, proficiency, display_order || 0, published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/skills/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM skills WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- CERTIFICATES ---
app.get('/api/certificates', authenticateToken, (req, res) => {
  db.all("SELECT * FROM certificates ORDER BY display_order ASC, issue_date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/certificates', authenticateToken, (req, res) => {
  const { name, organization, issue_date, credential_id, verification_url, file_url, description, display_order, published } = req.body;

  db.run(`INSERT INTO certificates (name, organization, issue_date, credential_id, verification_url, file_url, description, display_order, published) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, organization, issue_date, credential_id, verification_url, file_url, description, display_order || 0, published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/certificates/:id', authenticateToken, (req, res) => {
  const { name, organization, issue_date, credential_id, verification_url, file_url, description, display_order, published } = req.body;

  db.run(`UPDATE certificates SET name = ?, organization = ?, issue_date = ?, credential_id = ?, verification_url = ?, file_url = ?, description = ?, display_order = ?, published = ? WHERE id = ?`,
    [name, organization, issue_date, credential_id, verification_url, file_url, description, display_order || 0, published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/certificates/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM certificates WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- ACHIEVEMENTS ---
app.get('/api/achievements', authenticateToken, (req, res) => {
  db.all("SELECT * FROM achievements ORDER BY display_order ASC, date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/achievements', authenticateToken, (req, res) => {
  const { title, organization, date, description, image_url, certificate_url, display_order, published } = req.body;

  db.run(`INSERT INTO achievements (title, organization, date, description, image_url, certificate_url, display_order, published) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, organization, date, description, image_url, certificate_url, display_order || 0, published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/achievements/:id', authenticateToken, (req, res) => {
  const { title, organization, date, description, image_url, certificate_url, display_order, published } = req.body;

  db.run(`UPDATE achievements SET title = ?, organization = ?, date = ?, description = ?, image_url = ?, certificate_url = ?, display_order = ?, published = ? WHERE id = ?`,
    [title, organization, date, description, image_url, certificate_url, display_order || 0, published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/achievements/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM achievements WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- EDUCATION ---
app.get('/api/education', authenticateToken, (req, res) => {
  db.all("SELECT * FROM education ORDER BY display_order ASC, start_year DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/education', authenticateToken, (req, res) => {
  const { institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order, published } = req.body;

  db.run(`INSERT INTO education (institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order, published) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order || 0, published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/education/:id', authenticateToken, (req, res) => {
  const { institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order, published } = req.body;

  db.run(`UPDATE education SET institution = ?, degree = ?, department = ?, start_year = ?, end_year = ?, gpa = ?, description = ?, logo_url = ?, display_order = ?, published = ? WHERE id = ?`,
    [institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order || 0, published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/education/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM education WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- SOCIAL LINKS ---
app.get('/api/social-links', authenticateToken, (req, res) => {
  db.all("SELECT * FROM social_links ORDER BY display_order ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/social-links', authenticateToken, (req, res) => {
  const { platform, url, icon, display_order, published } = req.body;

  db.run(`INSERT INTO social_links (platform, url, icon, display_order, published) VALUES (?, ?, ?, ?, ?)`,
    [platform, url, icon, display_order || 0, published ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.put('/api/social-links/:id', authenticateToken, (req, res) => {
  const { platform, url, icon, display_order, published } = req.body;

  db.run(`UPDATE social_links SET platform = ?, url = ?, icon = ?, display_order = ?, published = ? WHERE id = ?`,
    [platform, url, icon, display_order || 0, published ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete('/api/social-links/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM social_links WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- CONTACT MESSAGES ---
app.get('/api/contact-messages', authenticateToken, (req, res) => {
  db.all("SELECT * FROM contact_messages ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/contact-messages/:id', authenticateToken, (req, res) => {
  const { status } = req.body; // 'read', 'unread', 'archived'

  db.run("UPDATE contact_messages SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/contact-messages/:id', authenticateToken, (req, res) => {
  db.run("DELETE FROM contact_messages WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});


// --- MEDIA / LIBRARY ---
app.get('/api/media', authenticateToken, (req, res) => {
  db.all("SELECT * FROM media ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/media', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    if (supabase) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

      const { data, error } = await supabase.storage
        .from(supabaseBucket)
        .upload(uniqueFilename, fileBuffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(supabaseBucket)
        .getPublicUrl(uniqueFilename);

      fs.unlinkSync(req.file.path);

      db.run("INSERT INTO media (filename, url, file_type, file_size) VALUES (?, ?, ?, ?)",
        [req.file.originalname, publicUrl, req.file.mimetype, req.file.size],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, id: this.lastID, url: publicUrl });
        }
      );
    } else {
      const fileUrl = `/uploads/${req.file.filename}`;
      db.run("INSERT INTO media (filename, url, file_type, file_size) VALUES (?, ?, ?, ?)",
        [req.file.originalname, fileUrl, req.file.mimetype, req.file.size],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, id: this.lastID, url: fileUrl });
        }
      );
    }
  } catch (err) {
    console.error('File upload error:', err);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ error: 'File upload failed: ' + err.message });
  }
});

app.delete('/api/media/:id', authenticateToken, (req, res) => {
  db.get("SELECT * FROM media WHERE id = ?", [req.params.id], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'File not found' });

    try {
      const isSupabaseUrl = row.url.includes('supabase.co/storage');
      if (isSupabaseUrl && supabase) {
        const parts = row.url.split('/');
        const filename = parts[parts.length - 1];
        const { error } = await supabase.storage
          .from(supabaseBucket)
          .remove([filename]);
        if (error) console.error('Error deleting from Supabase storage:', error);
      } else {
        const filepath = path.join(__dirname, 'uploads', path.basename(row.url));
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }

      db.run("DELETE FROM media WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    } catch (deleteErr) {
      console.error('File delete error:', deleteErr);
      res.status(500).json({ error: 'File deletion failed: ' + deleteErr.message });
    }
  });
});


// --- SETTINGS & GLOBAL INFO ---
app.get('/api/settings', authenticateToken, (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });
    res.json(settings);
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const updates = req.body; // e.g. { portfolio_title: '...', seo_description: '...' }
  
  db.serialize(() => {
    let hasError = false;
    Object.keys(updates).forEach(key => {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, updates[key]], (err) => {
        if (err) hasError = true;
      });
    });
    
    // Wait briefly for serialization to complete
    setTimeout(() => {
      if (hasError) return res.status(500).json({ error: 'Failed to update settings' });
      res.json({ success: true });
    }, 100);
  });
});

app.put('/api/settings/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  // Get current admin
  db.get("SELECT * FROM admins WHERE username = ?", [req.user.username], (err, admin) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!admin) return res.status(404).json({ error: 'Admin user not found' });

    const passwordIsValid = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    const hashedNew = bcrypt.hashSync(newPassword, 10);
    db.run("UPDATE admins SET password_hash = ? WHERE id = ?", [hashedNew, admin.id], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update password' });
      res.json({ success: true });
    });
  });
});


// Start Server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running in background at http://localhost:${PORT}`);
  });
}

export default app;
