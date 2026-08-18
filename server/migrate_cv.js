import { initDb, getDb } from './database.js';

await initDb();
const db = getDb();
console.log('Connected to Supabase PostgreSQL database for CV sync.');

const profile = {
  name: "DILEEP V",
  title: "EMBEDDED AND IOT DEVELOPER",
  intro: "Embedded Systems and IoT engineering student with hands-on experience in Embedded C, AVR ATmega microcontrollers, ESP32, Arduino platforms, sensor interfacing, and hardware-software integration.",
  about: "Embedded Systems and IoT engineering student with hands-on experience in Embedded C, AVR ATmega microcontrollers, ESP32, Arduino platforms, sensor interfacing, and hardware-software integration. Experienced in developing IoT-based automation and monitoring systems with practical exposure to GPIO programming, firmware development, relay control, and embedded debugging. Strong interest in embedded firmware, electronics design, and real-time hardware applications.",
  location: "Erode, Tamilnadu, India",
  email: "dileeppvt03@gmail.com",
  phone: "91590 59497",
  profile_image: "/robot.png",
  resume_url: ""
};

const socialLinks = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/dileep-v-482035361", icon: "linkedin", display_order: 1 },
  { platform: "GitHub", url: "https://github.com/dileepwork", icon: "github", display_order: 2 },
  { platform: "Portfolio", url: "https://dileep-portfolio-2g6p.vercel.app/", icon: "globe", display_order: 3 }
];

const education = [
  {
    institution: "M.P. Nachimuthu M. Jaganathan Engineering College",
    degree: "B.E. Electronics and Communication Engineering",
    department: "ECE",
    start_year: "2023",
    end_year: "Present",
    gpa: "7.64 CGPA",
    description: "Specializing in embedded controllers, wireless hardware transceivers, and electronics architectures.",
    logo_url: "",
    display_order: 1
  },
  {
    institution: "The Sengunthar Hr.Sec School",
    degree: "Higher Secondary Certificate",
    department: "State Board",
    start_year: "2022",
    end_year: "2023",
    gpa: "77.8%",
    description: "Completed secondary school studies targeting physical sciences and mathematics.",
    logo_url: "",
    display_order: 2
  },
  {
    institution: "The Sengunthar Hr.Sec School",
    degree: "Secondary School Leaving Certificate",
    department: "State Board",
    start_year: "2020",
    end_year: "2021",
    gpa: "72%",
    description: "Completed primary secondary school modules.",
    logo_url: "",
    display_order: 3
  }
];

const experiences = [
  {
    company: "6IXMINDSLABS",
    role: "Embedded & IoT Trainer",
    type: "Trainer",
    location: "Erode, India",
    start_date: "Jul '26",
    end_date: "Aug '26",
    currently_working: 0,
    description: "Delivering Value Added Courses (VACs) and mentoring students in hands-on electronics hardware.",
    bullet_points: [
      "Conducted Value Added Courses (VACs) for students through structured technical and practical training sessions.",
      "Delivered hands-on sessions covering electronics, embedded systems, IoT, and project-oriented concepts.",
      "Guided students through practical demonstrations, circuit implementation, programming, and troubleshooting.",
      "Mentored students in developing and implementing hands-on technical projects.",
      "Evaluated student understanding through practical activities and assisted them in resolving technical issues."
    ],
    technologies: ["Electronics", "Embedded Systems", "IoT", "Circuit Design", "Troubleshooting"],
    logo_url: "",
    display_order: 1
  },
  {
    company: "HAILSTONE TECHNOLOGY",
    role: "Embedded & IoT Intern",
    type: "Intern",
    location: "Coimbatore, India",
    start_date: "Jun '26",
    end_date: "Jul '26",
    currently_working: 0,
    description: "Hands-on internship targeting PIC microcontrollers and automation loop devices.",
    bullet_points: [
      "Gained practical exposure to Embedded Systems and IoT development through hands-on training.",
      "Learned PIC microcontroller architecture, programming, GPIO control, and peripheral interfacing.",
      "Worked with sensors, actuators, relays, and other peripheral devices in embedded applications.",
      "Developed and tested PIC-based hardware automation and control applications.",
      "Performed hardware-software integration, testing, and basic troubleshooting of embedded systems.",
      "Applied Embedded C and electronics concepts to practical embedded and IoT applications."
    ],
    technologies: ["PIC Microcontroller", "Embedded C", "GPIO Control", "Interfacing", "Relays"],
    logo_url: "",
    display_order: 2
  },
  {
    company: "6IXMINDSLABS",
    role: "Embedded & IoT Trainer",
    type: "Trainer",
    location: "Erode, India",
    start_date: "Sep '25",
    end_date: "May '26",
    currently_working: 0,
    description: "Conducting training modules and teaching microcontrollers assembly logic.",
    bullet_points: [
      "Conduct hands-on training sessions in Embedded Systems, IoT, Arduino, and ESP32 development.",
      "Teach microcontroller programming, GPIO control, sensor interfacing, actuator control, and basic electronics.",
      "Guide students in circuit assembly, hardware integration, firmware development, and troubleshooting.",
      "Mentor students in developing practical Embedded and IoT projects from circuit design to implementation.",
      "Provide practical training on sensors, relays, motors, communication modules, and IoT-based automation.",
      "Assist students in debugging hardware and software issues and improving project reliability."
    ],
    technologies: ["Arduino", "ESP32", "Microcontrollers", "Interfacing", "Circuit Assembly"],
    logo_url: "",
    display_order: 3
  },
  {
    company: "EMBUZZ TECHNOLOGIES PRIVATE LIMITED",
    role: "Embedded Trainee",
    type: "Trainee",
    location: "Erode, India",
    start_date: "Feb '25",
    end_date: "Aug '25",
    currently_working: 0,
    description: "Embedded AVR ATmega programming and testing modules.",
    bullet_points: [
      "Worked on AVR ATmega microcontroller programming using Embedded C.",
      "Developed and tested GPIO-based embedded applications.",
      "Interfaced sensors and peripheral devices with microcontrollers.",
      "Performed hardware-software integration and basic embedded debugging.",
      "Assisted in troubleshooting embedded hardware and firmware issues.",
      "Gained practical exposure to real-time embedded system development."
    ],
    technologies: ["AVR ATmega", "Embedded C", "GPIO Programming", "Hardware Debugging"],
    logo_url: "",
    display_order: 4
  },
  {
    company: "EMBUZZ TECHNOLOGIES PRIVATE LIMITED",
    role: "Embedded Developer Intern",
    type: "Intern",
    location: "Erode, India",
    start_date: "Jan '25",
    end_date: "Feb '25",
    currently_working: 0,
    description: "Basic introductory training to AVR platforms.",
    bullet_points: [
      "Learned fundamentals of AVR microcontroller architecture and Embedded C programming.",
      "Implemented sensor interfacing and GPIO control applications.",
      "Worked with embedded development boards for testing and experimentation."
    ],
    technologies: ["AVR ATmega", "Embedded C", "Sensor Interfacing", "GPIO Control"],
    logo_url: "",
    display_order: 5
  }
];

const skills = [
  // Programming Languages
  { name: "Embedded C", category: "Programming", proficiency: "Advanced", display_order: 1 },
  { name: "C Programming", category: "Programming", proficiency: "Advanced", display_order: 2 },
  { name: "Python", category: "Programming", proficiency: "Intermediate", display_order: 3 },
  { name: "Java", category: "Programming", proficiency: "Intermediate", display_order: 4 },
  
  // Embedded Platforms & Hardware
  { name: "AVR ATmega Microcontrollers", category: "Embedded Systems", proficiency: "Advanced", display_order: 1 },
  { name: "ESP32", category: "Embedded Systems", proficiency: "Advanced", display_order: 2 },
  { name: "PIC Controller", category: "Embedded Systems", proficiency: "Advanced", display_order: 3 },
  { name: "Sensor Interfacing", category: "Embedded Systems", proficiency: "Advanced", display_order: 4 },
  { name: "Hardware Testing & Debugging", category: "Embedded Systems", proficiency: "Advanced", display_order: 5 },
  { name: "GPIO Programming", category: "Embedded Systems", proficiency: "Advanced", display_order: 6 },
  { name: "Arduino IDE", category: "Embedded Systems", proficiency: "Advanced", display_order: 7 },
  
  // Tools & Software
  { name: "VS Code", category: "AI / Software", proficiency: "Advanced", display_order: 1 },
  { name: "GitHub", category: "AI / Software", proficiency: "Advanced", display_order: 2 },
  { name: "Arduino IDE", category: "AI / Software", proficiency: "Advanced", display_order: 3 },
  
  // IoT
  { name: "IoT Architectures", category: "IoT", proficiency: "Advanced", display_order: 1 },
  { name: "Sensors & Actuators", category: "IoT", proficiency: "Advanced", display_order: 2 },
  
  // Soft Skills
  { name: "Technical Presentation", category: "AI / Software", proficiency: "Advanced", display_order: 4 },
  { name: "Team Collaboration", category: "AI / Software", proficiency: "Advanced", display_order: 5 }
];

const projects = [
  {
    title: "CodeForge Studio",
    short_description: "Developer Productivity & Project Management Suite.",
    full_description: "Developed a Java-based desktop application to manage projects, tasks, code snippets, developer notes, credentials, and workspace files in a unified environment.",
    category: "Software",
    technologies: ["Java 21", "JavaFX", "SQLite", "JDBC", "MVC architecture", "iText PDF"],
    image: "/projects/codeforge_studio.png",
    github_url: "",
    live_demo_url: "",
    featured: 1,
    display_order: 1,
    problem: "Developers face workflow fragmentation shifting between multiple project trackers, notebooks, code vaults, and note-taking apps, causing productivity loss.",
    solution: "Created CodeForge Studio, a unified desktop workspace aggregating project dashboards, Kanban task boards, credential storage with AES-128, a snippet manager, and analytics.",
    role: "Implemented project and task management features, snippet library, file organizer, user authentication with BCrypt hashing, and integrated iText PDF functionality for reports.",
    outcome: "Unified developer productivity workspace compiling code repositories and secure credentials vault."
  },
  {
    title: "IoT Agriculture Robot",
    short_description: "Autonomous IoT agriculture robot for soil and environmental sensing.",
    full_description: "Developed an autonomous IoT-based agriculture robot integrating soil moisture sensing and environmental monitoring for precision farming applications.",
    category: "IoT",
    technologies: ["Arduino", "IoT", "Sensors", "Embedded Systems"],
    image: "/projects/iot_agriculture_robot_mockup_1775811545492.png",
    github_url: "",
    live_demo_url: "https://www.linkedin.com/posts/dileep-v-482035361_built-a-bluetooth-controlled-agriculture-ugcPost-7448966822013599744-0VxM?utm_source=share&utm_medium=member_desktop&rcm=ACoAAGb9-6oB_Nx8qsZe2wKFsjgB362d5YE3RuM",
    featured: 1,
    display_order: 2,
    problem: "Manual soil monitoring is inefficient and inconsistent, affecting crop health and yield.",
    solution: "Developed an autonomous robot that measures soil moisture and environmental conditions for precision agriculture using automated sensing logic.",
    role: "Implemented embedded control logic, sensor calibration, automated sensing operations, and hardware module assembly.",
    outcome: "Functional prototype for automated soil analysis; demonstrates precision agriculture concept."
  },
  {
    title: "EMG Fatigue Detection",
    short_description: "ESP32 EMG monitor designed for muscle signal acquisition and real-time fatigue analysis.",
    full_description: "Built an ESP32-based EMG monitoring system for real-time muscle signal acquisition and fatigue analysis.",
    category: "Embedded",
    technologies: ["ESP32", "Embedded C", "Signal Processing", "Sensors"],
    image: "/projects/emg_muscle_detection_v2_1775817717934.png",
    github_url: "https://github.com/dileepwork/muscle",
    live_demo_url: "",
    featured: 1,
    display_order: 3,
    problem: "Muscle fatigue is difficult to quantify in real-time, leading to injuries in patients and athletes.",
    solution: "Built a system capturing EMG signals to analyze muscle activity and detect fatigue levels dynamically.",
    role: "Performed signal acquisition, sensor calibration, and embedded firmware development for dynamic monitoring.",
    outcome: "Designed for physiotherapy and sports monitoring applications using embedded sensing techniques."
  },
  {
    title: "StudyFlow AI",
    short_description: "AI academic planning assistant that analyzes syllabus content and generates schedules.",
    full_description: "Developed an AI-powered academic planning assistant capable of analyzing syllabus content and generating personalized study schedules.",
    category: "AI / Software",
    technologies: ["Python", "AI", "Automation", "Education Technology"],
    image: "/projects/studyflow_ai_v2_1775817736464.png",
    github_url: "https://github.com/dileepwork/studyflow_ai2.0.git",
    live_demo_url: "https://studyflow-ai-lac.vercel.app/",
    featured: 1,
    display_order: 4,
    problem: "Students struggle to convert large, unstructured syllabus content into actionable study plans.",
    solution: "AI-powered assistant that analyzes syllabuses and generates optimized, personalized study schedules.",
    role: "Designed adaptive planning logic for efficient task organization, study optimization, and syllabus analysis.",
    outcome: "Automated study workflow generation to improve consistency and productivity for students."
  },
  {
    title: "College Bus Tracking",
    short_description: "GPS vehicle tracking system providing real-time bus location updates.",
    full_description: "Developed a GPS-enabled embedded vehicle tracking system with real-time route monitoring and ETA estimation.",
    category: "IoT",
    technologies: ["GPS", "ESP32"],
    image: "/projects/bus_tracking_v2_1775817751690.png",
    github_url: "https://github.com/dileepwork/project_bus.git",
    live_demo_url: "",
    featured: 1,
    display_order: 5,
    problem: "Uncertainty in bus arrival times leads to delays and inefficient commute planning.",
    solution: "Multi-user system with live GPS tracking, route management, and ETA notifications for students and drivers.",
    role: "Integrated IoT communication, designed centralized monitoring system, and backend connectivity for live bus location updates.",
    outcome: "Improved commute transparency and transport management efficiency through live tracking features."
  },
  {
    title: "Arjun AI - WhatsApp CRM",
    short_description: "AI WhatsApp assistant that automates business customer communications.",
    full_description: "Developed an AI-powered WhatsApp assistant for automating customer communication and lead management workflows.",
    category: "AI / Software",
    technologies: ["Python", "NLP", "WhatsApp API", "CRM Systems"],
    image: "/projects/whatsapp_crm_v2_1775817766944.png",
    github_url: "https://github.com/dileepwork/Customer-Segmentation-AI",
    live_demo_url: "",
    featured: 1,
    display_order: 6,
    problem: "Small businesses struggle to manage customer interactions across WhatsApp efficiently.",
    solution: "AI WhatsApp assistant that automates communication, categorizes leads, and handles follow-ups.",
    role: "Implemented conversation handling logic, follow-up automation, and CRM-based interaction tracking with WhatsApp API integration.",
    outcome: "Improved customer response efficiency and reduced manual interaction workload."
  },
  {
    title: "FusionFlow AI",
    short_description: "Intelligent employee attendance system with biometric tracking.",
    full_description: "Developed an intelligent employee management and attendance monitoring system with role-based access functionality.",
    category: "AI / Software",
    technologies: ["React", "Node.js", "Authentication Systems", "HR Management"],
    image: "/projects/attendance_management_v2_1775817782969.png",
    github_url: "",
    live_demo_url: "",
    featured: 1,
    display_order: 7,
    problem: "Organizations face manual attendance errors and lack of real-time workforce visibility.",
    solution: "Intelligent employee management system with biometric tracking and role-based access.",
    role: "Designed authentication logic, reporting features, workforce monitoring workflows, and employee tracking mechanisms.",
    outcome: "Improved operational visibility and reduced manual attendance management errors."
  },
  {
    title: "RoadGuard AI",
    short_description: "Mobile app using AI to detect and tag road potholes.",
    full_description: "Developed an AI-assisted pothole detection and reporting system using image-based road condition analysis.",
    category: "AI / Software",
    technologies: ["Computer Vision", "Firebase", "Mobile Applications", "Civic Technology"],
    image: "/projects/roadguard_ai_v2_1775817799400.png",
    github_url: "https://github.com/Dhinesh71/Roadguard_ai.git",
    live_demo_url: "",
    featured: 1,
    display_order: 8,
    problem: "Potholes cause accidents and vehicle damage; reporting systems are slow and manual.",
    solution: "Mobile app using AI to detect potholes via image capture and report road conditions with GPS tagging.",
    role: "Integrated GPS tagging and reporting workflows for real-time issue tracking, image processing, and gamified reporting concepts.",
    outcome: "Enables faster road repair identification through crowdsourced data collection."
  },
  {
    title: "VisionGuard AI",
    short_description: "AI accident detection using live surveillance cameras feeds.",
    full_description: "Developed an AI-based accident detection system capable of analyzing CCTV footage and triggering emergency alerts.",
    category: "AI / Software",
    technologies: ["Python", "Computer Vision", "AI", "Smart City Systems"],
    image: "/projects/visionguard_ai_accident_mockup_1775811563972.png",
    github_url: "https://github.com/dhineshdevhub/VisionGuard-AI.git",
    live_demo_url: "",
    featured: 1,
    display_order: 9,
    problem: "Delayed accident detection leads to fatalities due to slow emergency response.",
    solution: "AI system analyzing CCTV footage to identify accidents and alert emergency services instantly.",
    role: "Implemented video processing, automated alert generation pipeline, and emergency response incident workflows.",
    outcome: "Reduces response time in accidents; demonstrates smart-city safety solutions."
  },
  {
    title: "Automatic Water Level Indicator and Controller",
    short_description: "PIC microcontroller-based overhead tank water monitoring pump shutoff controller.",
    full_description: "Developed a PIC-based automatic water level monitoring and control system for overhead tank applications.",
    category: "Embedded Systems",
    technologies: ["PIC Microcontroller", "Embedded C", "Water Level Sensors", "Relay", "Embedded Systems"],
    image: "/projects/water_level_controller.png",
    github_url: "",
    live_demo_url: "",
    featured: 0,
    display_order: 10,
    problem: "Overhead tank overflows cause water and electrical power wastage, requiring continuous manual oversight.",
    solution: "Designed a microcontroller automatic pump shutoff system using multiple level float sensors and digital logic.",
    role: "Implemented water-level sensing to indicate different tank levels, programmed PIC controller, integrated relay-based pump control, and indicator outputs.",
    outcome: "Stable automatic water tank pumping control loop requiring zero manual monitoring."
  }
];

db.serialize(() => {
  console.log('Clearing database tables...');
  db.run("DELETE FROM profiles");
  db.run("DELETE FROM social_links");
  db.run("DELETE FROM education");
  db.run("DELETE FROM experiences");
  db.run("DELETE FROM skills");
  db.run("DELETE FROM projects");

  console.log('Inserting profile...');
  db.run(`INSERT INTO profiles (name, title, intro, about, location, email, phone, profile_image, resume_url) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [profile.name, profile.title, profile.intro, profile.about, profile.location, profile.email, profile.phone, profile.profile_image, profile.resume_url]
  );

  console.log('Inserting social links...');
  socialLinks.forEach((link) => {
    db.run("INSERT INTO social_links (platform, url, icon, display_order, published) VALUES (?, ?, ?, ?, 1)",
      [link.platform, link.url, link.icon, link.display_order]
    );
  });

  console.log('Inserting education...');
  education.forEach((edu) => {
    db.run(`INSERT INTO education (institution, degree, department, start_year, end_year, gpa, description, logo_url, display_order, published) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [edu.institution, edu.degree, edu.department, edu.start_year, edu.end_year, edu.gpa, edu.description, edu.logo_url, edu.display_order]
    );
  });

  console.log('Inserting experiences...');
  experiences.forEach((exp) => {
    db.run(`INSERT INTO experiences (company, role, type, location, start_date, end_date, currently_working, description, bullet_points, technologies, logo_url, display_order, published) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [exp.company, exp.role, exp.type, exp.location, exp.start_date, exp.end_date, exp.currently_working, exp.description, JSON.stringify(exp.bullet_points), JSON.stringify(exp.technologies), exp.logo_url, exp.display_order]
    );
  });

  console.log('Inserting skills...');
  skills.forEach((sk) => {
    db.run("INSERT INTO skills (name, category, proficiency, display_order, published) VALUES (?, ?, ?, ?, 1)",
      [sk.name, sk.category, sk.proficiency, sk.display_order]
    );
  });

  console.log('Inserting projects...');
  projects.forEach((proj) => {
    db.run(`INSERT INTO projects (title, short_description, full_description, category, technologies, image, gallery_images, github_url, live_demo_url, featured, display_order, published, problem, solution, role, outcome) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)`,
      [proj.title, proj.short_description, proj.full_description, proj.category, JSON.stringify(proj.technologies), proj.image, JSON.stringify([]), proj.github_url, proj.live_demo_url, proj.featured, proj.display_order, proj.problem, proj.solution, proj.role, proj.outcome]
    );
  });

  console.log('Database synced with CV details successfully!');
});

// Close database connection after queue finishes
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err.message);
    else console.log('Database connection closed. CV Sync successful.');
  });
}, 5000);
