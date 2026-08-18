import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Admins Table
      db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 2. Profiles Table
      db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        intro TEXT,
        about TEXT,
        location TEXT,
        email TEXT,
        phone TEXT,
        profile_image TEXT,
        resume_url TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 3. Experiences Table
      db.run(`CREATE TABLE IF NOT EXISTS experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        type TEXT,
        location TEXT,
        start_date TEXT,
        end_date TEXT,
        currently_working INTEGER DEFAULT 0,
        description TEXT,
        bullet_points TEXT, -- Stored as JSON array
        technologies TEXT,  -- Stored as JSON array
        logo_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 4. Projects Table
      db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        short_description TEXT,
        full_description TEXT,
        category TEXT,
        technologies TEXT, -- Stored as JSON array
        image TEXT,
        gallery_images TEXT, -- Stored as JSON array
        github_url TEXT,
        live_demo_url TEXT,
        video_url TEXT,
        featured INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Published', -- 'Draft', 'Published', 'Unpublished'
        start_date TEXT,
        end_date TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        problem TEXT,
        solution TEXT,
        role TEXT,
        outcome TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 5. Skills Table
      db.run(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT, -- Lucide icon name
        proficiency TEXT, -- 'Beginner', 'Intermediate', 'Advanced'
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 6. Certificates Table
      db.run(`CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        organization TEXT NOT NULL,
        issue_date TEXT,
        credential_id TEXT,
        verification_url TEXT,
        file_url TEXT,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 7. Achievements Table
      db.run(`CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        date TEXT,
        description TEXT,
        image_url TEXT,
        certificate_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 8. Education Table
      db.run(`CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        institution TEXT NOT NULL,
        degree TEXT NOT NULL,
        department TEXT,
        start_year TEXT,
        end_year TEXT,
        gpa TEXT,
        description TEXT,
        logo_url TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 9. Social Links Table
      db.run(`CREATE TABLE IF NOT EXISTS social_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT,
        display_order INTEGER DEFAULT 0,
        published INTEGER DEFAULT 1
      )`);

      // 10. Contact Messages Table
      db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'unread', -- 'unread', 'read', 'archived'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 11. Media Library Table
      db.run(`CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 12. Settings Table
      db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT
      )`);

      // Seed tables if empty
      seedData().then(resolve).catch(reject);
    });
  });
};

const seedData = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Seed Admin
      db.get("SELECT COUNT(*) as count FROM admins", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const passHash = bcrypt.hashSync('password123', 10);
          db.run("INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)",
            ['admin', 'dileeppvt03@gmail.com', passHash]
          );
        }
      });

      // 2. Seed Profile
      db.get("SELECT COUNT(*) as count FROM profiles", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          db.run(`INSERT INTO profiles (name, title, intro, about, location, email, phone, profile_image, resume_url) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'Dileep V',
              'IoT & Embedded Systems Engineer',
              'Pioneering high-precision IoT engineering and specialized embedded systems built to unify the digital and physical worlds.',
              'I am an Embedded Systems and IoT Engineer focused on creating smart hardware systems, custom micro-controller automation firmware, and full-stack device integrations.',
              'Erode, Tamil Nadu, India',
              'dileeppvt03@gmail.com',
              '+91 9159059497',
              '/robot.png',
              ''
            ]
          );
        }
      });

      // 3. Seed Experiences
      db.get("SELECT COUNT(*) as count FROM experiences", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const exp1_bullets = JSON.stringify([
            "Conduct hands-on training sessions in Embedded Systems, IoT, Arduino, and ESP32 development.",
            "Teach microcontroller programming, GPIO control, sensor interfacing, actuator control, and basic electronics.",
            "Guide students through circuit assembly, hardware integration, firmware development, and troubleshooting.",
            "Mentor students in developing practical Embedded and IoT projects."
          ]);
          const exp1_techs = JSON.stringify(["ESP32", "Arduino", "Embedded C", "Microcontrollers", "GPIO"]);
          db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, display_order) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['6ixmindslabs', 'Embedded & IoT Trainer', 'Trainer', 'Erode, India', 'Feb 2026', 'Present', 1, 'Embedded and IoT trainer focusing on hardware and firmware classes.', exp1_bullets, exp1_techs, 1]
          );

          const exp2_bullets = JSON.stringify([
            "Conducted Value Added Courses for students through structured technical and practical training sessions.",
            "Delivered hands-on sessions covering electronics, embedded systems, IoT, and project-oriented concepts.",
            "Guided students through practical demonstrations, circuit implementation, programming, and troubleshooting.",
            "Mentored students in developing hands-on technical projects."
          ]);
          const exp2_techs = JSON.stringify(["Electronics", "Embedded Systems", "IoT Prototyping"]);
          db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, display_order) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['6ixmindslabs', 'Trainer – Value Added Courses', 'Trainer', 'Erode, India', 'Nov 2025', 'Jan 2026', 0, 'Value added courses trainer.', exp2_bullets, exp2_techs, 2]
          );

          const exp3_bullets = JSON.stringify([
            "Gained practical exposure to Embedded Systems and IoT development through hands-on training.",
            "Learned PIC microcontroller architecture, programming, GPIO control, and peripheral interfacing.",
            "Worked with sensors, actuators, relays, and peripheral devices.",
            "Developed and tested PIC-based hardware automation and control applications.",
            "Performed hardware-software integration, testing, and basic troubleshooting."
          ]);
          const exp3_techs = JSON.stringify(["PIC Microcontroller", "Embedded C", "Sensors & Actuators", "Relays"]);
          db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, display_order) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Hailstone Technology', 'Embedded & IoT Intern', 'Intern', 'Coimbatore, India', '22/06/2026', '18/07/2026', 0, 'Embedded & IoT internship focusing on PIC systems.', exp3_bullets, exp3_techs, 3]
          );

          const exp4_bullets = JSON.stringify([
            "Worked on AVR ATmega microcontroller programming using Embedded C.",
            "Developed and test GPIO-based embedded applications.",
            "Interfaced sensors and peripheral devices with microcontrollers.",
            "Performed hardware-software integration and basic embedded debugging.",
            "Assisted in troubleshooting embedded hardware and firmware issues."
          ]);
          const exp4_techs = JSON.stringify(["AVR ATmega", "Embedded C", "GPIO Programming", "Hardware Debugging"]);
          db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, display_order) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['Embuzz Technologies Private Limited', 'Embedded Trainee', 'Trainee', 'Erode, India', 'Feb 2025', 'Nov 2025', 0, 'Embedded systems trainee targeting AVR platforms.', exp4_bullets, exp4_techs, 4]
          );
        }
      });

      // 4. Seed Projects
      db.get("SELECT COUNT(*) as count FROM projects", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          // Project 1
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, github_url, live_demo_url, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'CodeForge Studio',
              'Developer productivity and project management desktop application.',
              'Developer productivity and project management desktop application built to provide developers with a unified workspace for project tracking, task management, code snippets, notes, credentials, files, and productivity analytics.',
              'Software',
              JSON.stringify(['Java 21', 'JavaFX', 'SQLite', 'JDBC', 'MVC', 'Maven', 'BCrypt', 'AES-128', 'iText PDF']),
              '/projects/codeforge_studio.png', // We'll put a default or generated visual later
              '',
              '',
              1,
              1,
              'Developers face workflow fragmentation shifting between multiple project trackers, notebooks, code vaults, and note-taking apps, causing productivity loss.',
              'Created CodeForge Studio, a unified desktop workspace aggregating project dashboards, Kanban task boards, credential storage with AES-128, a snippet manager, and analytics.',
              'End-to-end full-stack desktop application architecture, MVC pattern design, JDBC data layer, and secure cryptographic storage implementation.',
              'Fully functional local workspace desktop application with secure PDF reporting and interactive UI.'
            ]
          );

          // Project 2
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, github_url, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'EMG Fatigue Detection System',
              'ESP32-based EMG monitoring system designed for real-time muscle signal acquisition and fatigue analysis.',
              'ESP32-based EMG monitoring system designed for real-time muscle signal acquisition and fatigue analysis.',
              'Embedded',
              JSON.stringify(['ESP32', 'Embedded C', 'Signal Processing', 'Sensors']),
              '/projects/emg_muscle_detection_v2_1775817717934.png',
              'https://github.com/dileepwork/muscle',
              0,
              2,
              'Muscle fatigue is difficult to quantify in real-time, leading to injuries in patients and athletes.',
              'Built a system capturing EMG signals to analyze muscle activity and detect fatigue levels dynamically.',
              'Signal acquisition, calibration, and firmware development for real-time analysis.',
              'Working prototype useful for physiotherapy and sports training applications.'
            ]
          );

          // Project 3
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, github_url, live_demo_url, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'IoT Agriculture Robot',
              'IoT-based agriculture robot integrating soil moisture sensing and environmental monitoring.',
              'IoT-based agriculture robot integrating soil moisture sensing and environmental monitoring for precision farming applications.',
              'IoT',
              JSON.stringify(['Arduino', 'IoT', 'Sensors', 'Embedded Systems']),
              '/projects/iot_agriculture_robot_mockup_1775811545492.png',
              '',
              'https://www.linkedin.com/posts/dileep-v-482035361_built-a-bluetooth-controlled-agriculture-ugcPost-7448966822013599744-0VxM?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGb9-6oB_Nx8qsZe2wKFsjgB362d5YE3RuM',
              0,
              3,
              'Manual soil monitoring is inefficient and inconsistent, affecting crop health and yield.',
              'Developed an autonomous robot that measures soil moisture and environmental conditions for precision agriculture using automated sensing logic.',
              'Sensor calibration, logic development, embedded programming, and hardware assembly.',
              'Functional prototype for automated soil analysis; demonstrates precision agriculture concept.'
            ]
          );

          // Project 4
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, github_url, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'College Bus Tracking System',
              'GPS-enabled vehicle tracking system providing real-time bus location and transport management.',
              'GPS-enabled embedded vehicle tracking system providing real-time bus location monitoring and transport management features.',
              'IoT',
              JSON.stringify(['ESP32', 'GPS', 'IoT', 'Firebase', 'Node.js']),
              '/projects/bus_tracking_v2_1775817751690.png',
              'https://github.com/dileepwork/project_bus.git',
              0,
              4,
              'Uncertainty in bus arrival times leads to student delays and inefficient commute planning.',
              'Multi-user system with live GPS tracking, route management, and ETA notifications for students and drivers.',
              'Multi-app ecosystem architecture, tracking logic, and backend integration.',
              'Improved commute transparency and centralized control for transport management.'
            ]
          );

          // Project 5
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, github_url, live_demo_url, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'StudyFlow AI',
              'AI-powered academic planning assistant that analyzes syllabus content and generates schedules.',
              'AI-powered academic planning assistant that analyzes syllabus content and generates personalized study schedules.',
              'AI',
              JSON.stringify(['Python', 'AI', 'Automation', 'Education Technology']),
              '/projects/studyflow_ai_v2_1775817736464.png',
              'https://github.com/dileepwork/studyflow_ai2.0.git',
              'https://studyflow-ai-lac.vercel.app/',
              0,
              5,
              'Students struggle to convert large, unstructured syllabus content into actionable study plans.',
              'AI-powered assistant that analyzes syllabuses and generates optimized, personalized study schedules.',
              'System architecture, syllabus analysis algorithm, and adaptive plan generation logic.',
              'Automated planning system that improves study efficiency and consistency.'
            ]
          );

          // Project 6
          db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, featured, display_order, problem, solution, role, outcome) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              'Automatic Water Level Indicator and Controller',
              'PIC microcontroller-based automatic water level monitoring and pump control system.',
              'PIC microcontroller-based automatic water level monitoring and pump control system for overhead tank applications.',
              'Embedded',
              JSON.stringify(['PIC Microcontroller', 'Embedded C', 'Water Level Sensors', 'Relay', 'Embedded Systems']),
              '/projects/water_level_controller.png',
              0,
              6,
              'Overhead tank overflows cause water and electrical power wastage, requiring continuous manual oversight.',
              'Designed a microcontroller automatic pump shutoff system using multiple level float sensors and digital logic.',
              'Firmware logic, relay control switching circuits, electrical breadboarding, and PCB testing.',
              'Stable automatic water tank pumping control loop requiring zero manual monitoring.'
            ]
          );
        }
      });

      // 5. Seed Skills
      db.get("SELECT COUNT(*) as count FROM skills", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const defaultSkills = [
            // Programming
            { name: 'Embedded C', category: 'Programming', proficiency: 'Advanced', order: 1 },
            { name: 'C', category: 'Programming', proficiency: 'Advanced', order: 2 },
            { name: 'Python', category: 'Programming', proficiency: 'Intermediate', order: 3 },
            { name: 'Java', category: 'Programming', proficiency: 'Intermediate', order: 4 },
            // Embedded Systems
            { name: 'ESP32', category: 'Embedded Systems', proficiency: 'Advanced', order: 1 },
            { name: 'Arduino', category: 'Embedded Systems', proficiency: 'Advanced', order: 2 },
            { name: 'PIC', category: 'Embedded Systems', proficiency: 'Advanced', order: 3 },
            { name: 'AVR ATmega', category: 'Embedded Systems', proficiency: 'Intermediate', order: 4 },
            { name: 'Microcontrollers', category: 'Embedded Systems', proficiency: 'Advanced', order: 5 },
            { name: 'GPIO', category: 'Embedded Systems', proficiency: 'Advanced', order: 6 },
            { name: 'Embedded Firmware', category: 'Embedded Systems', proficiency: 'Advanced', order: 7 },
            // IoT
            { name: 'IoT', category: 'IoT', proficiency: 'Advanced', order: 1 },
            { name: 'MQTT', category: 'IoT', proficiency: 'Advanced', order: 2 },
            { name: 'Sensor Interfacing', category: 'IoT', proficiency: 'Advanced', order: 3 },
            { name: 'IoT Automation', category: 'IoT', proficiency: 'Advanced', order: 4 },
            { name: 'Device Communication', category: 'IoT', proficiency: 'Advanced', order: 5 },
            // AI / Software
            { name: 'Machine Learning', category: 'AI / Software', proficiency: 'Beginner', order: 1 },
            { name: 'Computer Vision', category: 'AI / Software', proficiency: 'Intermediate', order: 2 },
            { name: 'JavaFX', category: 'AI / Software', proficiency: 'Advanced', order: 3 },
            { name: 'Node.js', category: 'AI / Software', proficiency: 'Intermediate', order: 4 },
            { name: 'React', category: 'AI / Software', proficiency: 'Intermediate', order: 5 }
          ];

          defaultSkills.forEach((s) => {
            db.run("INSERT INTO skills (name, category, proficiency, display_order) VALUES (?, ?, ?, ?)",
              [s.name, s.category, s.proficiency, s.order]
            );
          });
        }
      });

      // 6. Seed Social Links
      db.get("SELECT COUNT(*) as count FROM social_links", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          db.run("INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)",
            ['LinkedIn', 'https://www.linkedin.com/in/dileep-v-482035361', 'linkedin', 1]
          );
          db.run("INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)",
            ['GitHub', 'https://github.com/dileepwork', 'github', 2]
          );
          db.run("INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)",
            ['Email', 'mailto:dileeppvt03@gmail.com', 'mail', 3]
          );
        }
      });

      // 7. Seed Settings
      db.get("SELECT COUNT(*) as count FROM settings", [], (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['portfolio_title', 'Dileep V | IoT & Embedded Systems Engineer']);
          db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['seo_description', 'Cybernetic portfolio of Dileep V, specialized in Embedded Systems, PIC/ESP32, and high-precision IoT solutions.']);
          db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['maintenance_mode', 'false']);
          db.run("INSERT INTO settings (key, value) VALUES (?, ?)", ['public_status', 'public']);
        }
      });

      resolve();
    });
  });
};

export const getDb = () => db;
