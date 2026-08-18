import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at:', dbPath);
});

const projects = [
  {
    title: "CodeForge Studio",
    short_description: "Developer productivity and project management desktop application.",
    full_description: "Developer productivity and project management desktop application built to provide developers with a unified workspace for project tracking, task management, code snippets, notes, credentials, files, and productivity analytics.",
    category: "Software",
    technologies: ['Java 21', 'JavaFX', 'SQLite', 'JDBC', 'MVC', 'Maven', 'BCrypt', 'AES-128', 'iText PDF'],
    image: "/projects/codeforge_studio.png",
    github_url: "",
    live_demo_url: "",
    featured: 1,
    display_order: 1,
    problem: "Developers face workflow fragmentation shifting between multiple project trackers, notebooks, code vaults, and note-taking apps, causing productivity loss.",
    solution: "Created CodeForge Studio, a unified desktop workspace aggregating project dashboards, Kanban task boards, credential storage with AES-128, a snippet manager, and analytics.",
    role: "End-to-end full-stack desktop application architecture, MVC pattern design, JDBC data layer, and secure cryptographic storage implementation.",
    outcome: "Fully functional local workspace desktop application with secure PDF reporting and interactive UI."
  },
  {
    title: "IoT Agriculture Robot",
    short_description: "IoT-based agriculture robot integrating soil moisture sensing and environmental monitoring.",
    full_description: "IoT-based agriculture robot integrating soil moisture sensing and environmental monitoring for precision farming applications.",
    category: "IoT",
    technologies: ["Arduino", "IoT", "Sensors", "Agriculture"],
    image: "/projects/iot_agriculture_robot_mockup_1775811545492.png",
    github_url: "",
    live_demo_url: "https://www.linkedin.com/posts/dileep-v-482035361_built-a-bluetooth-controlled-agriculture-ugcPost-7448966822013599744-0VxM?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGb9-6oB_Nx8qsZe2wKFsjgB362d5YE3RuM",
    featured: 1,
    display_order: 2,
    problem: "Manual soil monitoring is inefficient and inconsistent, affecting crop health and yield.",
    solution: "Developed an autonomous robot that measures soil moisture and environmental conditions for precision agriculture using automated sensing logic.",
    role: "Sensor calibration, logic development, embedded programming, and hardware assembly.",
    outcome: "Functional prototype for automated soil analysis; demonstrates precision agriculture concept."
  },
  {
    title: "EMG Fatigue Detection",
    short_description: "ESP32 EMG monitor designed for muscle signal acquisition and real-time fatigue analysis.",
    full_description: "Built a system capturing EMG signals to analyze muscle activity and detect fatigue levels dynamically.",
    category: "Embedded",
    technologies: ["EMG", "ESP32", "Signal Processing", "Medical Tech"],
    image: "/projects/emg_muscle_detection_v2_1775817717934.png",
    github_url: "https://github.com/dileepwork/muscle",
    live_demo_url: "",
    featured: 1,
    display_order: 3,
    problem: "Muscle fatigue is difficult to quantify in real-time, leading to injuries in patients and athletes.",
    solution: "Built a system capturing EMG signals to analyze muscle activity and detect fatigue levels dynamically.",
    role: "Signal acquisition, calibration, and firmware development for real-time analysis.",
    outcome: "Working prototype useful for physiotherapy and sports training applications."
  },
  {
    title: "StudyFlow AI",
    short_description: "AI academic planning assistant that analyzes syllabus content and generates schedules.",
    full_description: "AI-powered assistant that analyzes syllabuses and generates optimized, personalized study schedules.",
    category: "AI / Software",
    technologies: ["Python", "AI", "Education", "Automation"],
    image: "/projects/studyflow_ai_v2_1775817736464.png",
    github_url: "https://github.com/dileepwork/studyflow_ai2.0.git",
    live_demo_url: "https://studyflow-ai-lac.vercel.app/",
    featured: 1,
    display_order: 4,
    problem: "Students struggle to convert large, unstructured syllabus content into actionable study plans.",
    solution: "AI-powered assistant that analyzes syllabuses and generates optimized, personalized study schedules.",
    role: "System architecture, syllabus analysis algorithm, and adaptive plan generation logic.",
    outcome: "Automated planning system that improves study efficiency and consistency."
  },
  {
    title: "College Bus Tracking",
    short_description: "GPS vehicle tracking system providing real-time bus location updates.",
    full_description: "Multi-user system with live GPS tracking, route management, and ETA notifications for students and drivers.",
    category: "IoT",
    technologies: ["Node.js", "Firebase", "GPS", "Fleet Management"],
    image: "/projects/bus_tracking_v2_1775817751690.png",
    github_url: "https://github.com/dileepwork/project_bus.git",
    live_demo_url: "",
    featured: 1,
    display_order: 5,
    problem: "Uncertainty in bus arrival times leads to delays and inefficient commute planning.",
    solution: "Multi-user system with live GPS tracking, route management, and ETA notifications for students and drivers.",
    role: "Multi-app ecosystem architecture, tracking logic, and backend integration.",
    outcome: "Improved commute transparency and centralized control for transport management."
  },
  {
    title: "Arjun AI - WhatsApp CRM",
    short_description: "AI WhatsApp assistant that automates business customer communications.",
    full_description: "AI WhatsApp assistant that automates communication, categorizes leads, and handles follow-ups.",
    category: "AI / Software",
    technologies: ["WhatsApp API", "NLP", "Python", "CRM"],
    image: "/projects/whatsapp_crm_v2_1775817766944.png",
    github_url: "https://github.com/dileepwork/Customer-Segmentation-AI",
    live_demo_url: "",
    featured: 1,
    display_order: 6,
    problem: "Small businesses struggle to manage customer interactions across WhatsApp efficiently.",
    solution: "AI WhatsApp assistant that automates communication, categorizes leads, and handles follow-ups.",
    role: "Conversation flow design, CRM logic, and WhatsApp API integration.",
    outcome: "Reduced manual effort and improved customer response times melalui automation."
  },
  {
    title: "FusionFlow AI",
    short_description: "Intelligent employee attendance system with biometric tracking.",
    full_description: "Intelligent employee management system with biometric tracking and role-based access.",
    category: "AI / Software",
    technologies: ["React", "Node.js", "HR Management", "Auth"],
    image: "/projects/attendance_management_v2_1775817782969.png",
    github_url: "",
    live_demo_url: "",
    featured: 1,
    display_order: 7,
    problem: "Organizations face manual attendance errors and lack of real-time workforce visibility.",
    solution: "Intelligent employee management system with biometric tracking and role-based access.",
    role: "Database structure design, authentication system, and reporting features.",
    outcome: "Streamlined attendance tracking and improved organizational visibility."
  },
  {
    title: "RoadGuard AI",
    short_description: "Mobile app using AI to detect and tag road potholes.",
    full_description: "Mobile app using AI to detect potholes via image capture and report road conditions with GPS tagging.",
    category: "AI / Software",
    technologies: ["Computer Vision", "Firebase", "Civic Tech", "Mobile"],
    image: "/projects/roadguard_ai_v2_1775817799400.png",
    github_url: "https://github.com/Dhinesh71/Roadguard_ai.git",
    live_demo_url: "",
    featured: 1,
    display_order: 8,
    problem: "Potholes cause accidents and vehicle damage; reporting systems are slow and manual.",
    solution: "Mobile app using AI to detect potholes via image capture and report road conditions with GPS tagging.",
    role: "AI detection pipeline, image processing integration, and gamified reporting logic.",
    outcome: "Enables faster road repair identification through crowdsourced data collection."
  },
  {
    title: "VisionGuard AI",
    short_description: "AI accident detection using live surveillance cameras feeds.",
    full_description: "AI system analyzing CCTV footage to identify accidents and alert emergency services instantly.",
    category: "AI / Software",
    technologies: ["Computer Vision", "Python", "Smart City", "Security"],
    image: "/projects/visionguard_ai_accident_mockup_1775811563972.png",
    github_url: "https://github.com/dhineshdevhub/VisionGuard-AI.git",
    live_demo_url: "",
    featured: 1,
    display_order: 9,
    problem: "Delayed accident detection leads to fatalities due to slow emergency response.",
    solution: "AI system analyzing CCTV footage to identify accidents and alert emergency services instantly.",
    role: "End-to-end architecture, video processing pipeline, and alert triggering logic.",
    outcome: "Reduces response time in accidents; demonstrates smart-city safety solutions."
  },
  {
    title: "Automatic Water Level Indicator and Controller",
    short_description: "PIC microcontroller-based overhead tank water monitoring pump shutoff controller.",
    full_description: "PIC microcontroller-based automatic water level monitoring and pump control system for overhead tank applications.",
    category: "Embedded Systems",
    technologies: ['PIC Microcontroller', 'Embedded C', 'Water Level Sensors', 'Relay', 'Embedded Systems'],
    image: "/projects/water_level_controller.png",
    github_url: "",
    live_demo_url: "",
    featured: 0,
    display_order: 10,
    problem: "Overhead tank overflows cause water and electrical power wastage, requiring continuous manual oversight.",
    solution: "Designed a microcontroller automatic pump shutoff system using multiple level float sensors and digital logic.",
    role: "Firmware logic, relay control switching circuits, electrical breadboarding, and PCB testing.",
    outcome: "Stable automatic water tank pumping control loop requiring zero manual monitoring."
  }
];

db.serialize(() => {
  console.log('Syncing project database entries...');

  projects.forEach((proj) => {
    db.get("SELECT id FROM projects WHERE title = ?", [proj.title], (err, row) => {
      if (err) {
        console.error('Error querying project:', proj.title, err.message);
        return;
      }

      const techJson = JSON.stringify(proj.technologies);
      const galleryJson = JSON.stringify([]);

      if (row) {
        // Project exists: update columns to ensure featured/published/problem/solution fields are populated
        db.run(
          `UPDATE projects SET 
            short_description = ?, 
            full_description = ?, 
            category = ?, 
            technologies = ?, 
            image = ?, 
            github_url = ?, 
            live_demo_url = ?, 
            featured = ?, 
            display_order = ?, 
            published = 1, 
            problem = ?, 
            solution = ?, 
            role = ?, 
            outcome = ?
          WHERE id = ?`,
          [
            proj.short_description,
            proj.full_description,
            proj.category,
            techJson,
            proj.image,
            proj.github_url,
            proj.live_demo_url,
            proj.featured,
            proj.display_order,
            proj.problem,
            proj.solution,
            proj.role,
            proj.outcome,
            row.id
          ]
        );
      } else {
        // Project does not exist: insert new record
        db.run(
          `INSERT INTO projects (
            title, short_description, full_description, category, technologies, image, gallery_images, 
            github_url, live_demo_url, featured, display_order, published, problem, solution, role, outcome
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
          [
            proj.title,
            proj.short_description,
            proj.full_description,
            proj.category,
            techJson,
            proj.image,
            galleryJson,
            proj.github_url,
            proj.live_demo_url,
            proj.featured,
            proj.display_order,
            proj.problem,
            proj.solution,
            proj.role,
            proj.outcome
          ]
        );
      }
    });
  });

  // Seed Certificates if empty
  db.get("SELECT COUNT(*) as count FROM certificates", [], (err, row) => {
    if (err) return console.error(err);
    if (row.count === 0) {
      console.log('Seeding sample certificates...');
      db.run(`INSERT INTO certificates (name, organization, issue_date, credential_id, verification_url, description, display_order, published) 
              VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        ['Embedded Systems & PIC Specialist', 'Hailstone Technology', 'July 2026', 'CERT-PIC-9821', 'https://www.hailstonetechnology.com', 'Hands-on validation of PIC architecture programming, peripheral interfacing, GPIO control, and sensor modules mapping.', 1]
      );
      db.run(`INSERT INTO certificates (name, organization, issue_date, credential_id, verification_url, description, display_order, published) 
              VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        ['IoT Applications Developer', 'Embuzz Technologies', 'Nov 2025', 'CERT-AVR-4412', 'http://embuzztechnologies.com', 'AVR microcontroller training, firmware compilation in Embedded C, sensor calibration, and relay automation controls.', 2]
      );
    }
  });

  // Seed Achievements if empty
  db.get("SELECT COUNT(*) as count FROM achievements", [], (err, row) => {
    if (err) return console.error(err);
    if (row.count === 0) {
      console.log('Seeding sample achievements...');
      db.run(`INSERT INTO achievements (title, organization, date, description, display_order, published) 
              VALUES (?, ?, ?, ?, ?, 1)`,
        ['1st Place Winner - IoT Innovation Hackathon', 'Smart India Hackathon (Local Chapter)', 'May 2025', 'Presented the Smart IoT Agri Robot executing autonomous soil monitoring and real-time data communication loop, winning the top prize among 40 college teams.', 1]
      );
      db.run(`INSERT INTO achievements (title, organization, date, description, display_order, published) 
              VALUES (?, ?, ?, ?, ?, 1)`,
        ['Best Hardware Engineering Prototype Award', 'Engineering Synergy Symposium', 'August 2026', 'Honored for building the real-time EMG muscle fatigue acquisition and Esp32 signal monitoring station.', 2]
      );
    }
  });
});

// Close database connection after queue finishes
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    else console.log('Database connection closed. Migration and Seeding successful.');
  });
}, 5000);
