import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection Pool to Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for secure Supabase cloud connections
  }
});

// SQLite compatibility converter for SQL queries
function convertSql(sql) {
  let paramCount = 1;
  let pgSql = sql.replace(/\?/g, () => `$${paramCount++}`);
  
  // Replace SQLite specific autoincrement and datetimes
  pgSql = pgSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
  pgSql = pgSql.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
  pgSql = pgSql.replace(/DATETIME DEFAULT/gi, 'TIMESTAMP DEFAULT');
  
  return pgSql;
}

// Emulate SQLite's db object structure
const dbWrapper = {
  serialize(callback) {
    if (callback) callback();
  },

  run(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    let pgSql = convertSql(sql);
    const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
    if (isInsert) {
      pgSql += ' RETURNING id';
    }

    pool.query(pgSql, actualParams || [], (err, res) => {
      if (err) {
        if (actualCallback) actualCallback(err);
        return;
      }
      
      const context = {
        lastID: isInsert && res.rows && res.rows[0] ? res.rows[0].id : null
      };

      if (actualCallback) actualCallback.call(context, null);
    });
  },

  all(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    const pgSql = convertSql(sql);
    pool.query(pgSql, actualParams || [], (err, res) => {
      if (err) {
        if (actualCallback) actualCallback(err);
        return;
      }
      if (actualCallback) actualCallback(null, res.rows);
    });
  },

  get(sql, params, callback) {
    let actualParams = params;
    let actualCallback = callback;
    if (typeof params === 'function') {
      actualCallback = params;
      actualParams = [];
    }

    const pgSql = convertSql(sql);
    pool.query(pgSql, actualParams || [], (err, res) => {
      if (err) {
        if (actualCallback) actualCallback(err);
        return;
      }
      if (actualCallback) actualCallback(null, res.rows ? res.rows[0] : null);
    });
  },

  close(callback) {
    pool.end().then(() => {
      if (callback) callback(null);
    }).catch(err => {
      if (callback) callback(err);
    });
  }
};

export const initDb = () => {
  return new Promise((resolve, reject) => {
    dbWrapper.serialize(() => {
      // 1. Admins Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 2. Profiles Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        intro TEXT,
        about TEXT,
        location VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        profile_image TEXT,
        resume_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 3. Experiences Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        type VARCHAR(255),
        location VARCHAR(255),
        start_date VARCHAR(255),
        end_date VARCHAR(255),
        currently_working INTEGER DEFAULT 0,
        description TEXT,
        bullet_points TEXT, 
        technologies TEXT,  
        logo_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 4. Projects Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        full_description TEXT,
        category VARCHAR(255),
        technologies TEXT, 
        image TEXT,
        gallery_images TEXT, 
        github_url TEXT,
        live_demo_url TEXT,
        video_url TEXT,
        featured INTEGER DEFAULT 0,
        status VARCHAR(255) DEFAULT 'Published',
        start_date VARCHAR(255),
        end_date VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        problem TEXT,
        solution TEXT,
        role TEXT,
        outcome TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 5. Skills Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        icon VARCHAR(255), 
        proficiency VARCHAR(255), 
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 6. Certificates Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        issue_date VARCHAR(255),
        credential_id VARCHAR(255),
        verification_url TEXT,
        file_url TEXT,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 7. Achievements Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        date VARCHAR(255),
        description TEXT,
        image_url TEXT,
        certificate_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 8. Education Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        start_year VARCHAR(255),
        end_year VARCHAR(255),
        gpa VARCHAR(255),
        description TEXT,
        logo_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 9. Social Links Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        icon VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1
      )`);

      // 10. Contact Messages Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(255) DEFAULT 'unread', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 11. Media Library Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        file_type VARCHAR(255),
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // 12. Settings Table
      dbWrapper.run(`CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT
      )`);

      // Seed default admin and config tables
      setTimeout(() => {
        seedData().then(resolve).catch(reject);
      }, 1500);
    });
  });
};

const seedData = async () => {
  return new Promise((resolve, reject) => {
    dbWrapper.get("SELECT COUNT(*) as count FROM admins", [], (err, row) => {
      if (err) return reject(err);
      if (parseInt(row.count) === 0) {
        const passHash = bcrypt.hashSync('password123', 10);
        dbWrapper.run("INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)",
          ['admin', 'dileeppvt03@gmail.com', passHash],
          (seedErr) => {
            if (seedErr) reject(seedErr);
            else resolve();
          }
        );
      } else {
        resolve();
      }
    });
  });
};

export const getDb = () => dbWrapper;
