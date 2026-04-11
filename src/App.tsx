import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PanoramicProjects from './components/PanoramicProjects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import EndScene from './components/EndScene';
import VRTunnel from './components/VRTunnel';
import VRHud from './components/VRHud';
import CustomCursor from './components/CustomCursor';
import { MouseParallaxProvider } from './components/MouseParallaxProvider';

// We'll update these with real details provided by the user
const PROJECTS_DATA = [
  {
    title: "IoT Agriculture Robot",
    problem: "Manual soil monitoring is inefficient and inconsistent, affecting crop health and yield.",
    solution: "Developed an autonomous robot that measures soil moisture and environmental conditions for precision agriculture using automated sensing logic.",
    role: "Sensor calibration, logic development, embedded programming, and hardware assembly.",
    outcome: "Functional prototype for automated soil analysis; demonstrates precision agriculture concept.",
    image: "/projects/iot_agriculture_robot_mockup_1775811545492.png",
    tags: ["Arduino", "IoT", "Sensors", "Agriculture"]
  },
  {
    title: "EMG Fatigue Detection",
    problem: "Muscle fatigue is difficult to quantify in real-time, leading to injuries in patients and athletes.",
    solution: "Built a system capturing EMG signals to analyze muscle activity and detect fatigue levels dynamically.",
    role: "Signal acquisition, calibration, and firmware development for real-time analysis.",
    outcome: "Working prototype useful for physiotherapy and sports training applications.",
    image: "/projects/emg_muscle_detection_v2_1775817717934.png",
    tags: ["EMG", "ESP32", "Signal Processing", "Medical Tech"]
  },
  {
    title: "StudyFlow AI",
    problem: "Students struggle to convert large, unstructured syllabus content into actionable study plans.",
    solution: "AI-powered assistant that analyzes syllabuses and generates optimized, personalized study schedules.",
    role: "System architecture, syllabus analysis algorithm, and adaptive plan generation logic.",
    outcome: "Automated planning system that improves study efficiency and consistency.",
    image: "/projects/studyflow_ai_v2_1775817736464.png",
    tags: ["Python", "AI", "Education", "Automation"],
    github: "https://github.com/dileepwork/studyflow_ai2.0.git"
  },
  {
    title: "College Bus Tracking",
    problem: "Uncertainty in bus arrival times leads to delays and inefficient commute planning.",
    solution: "Multi-user system with live GPS tracking, route management, and ETA notifications for students and drivers.",
    role: "Multi-app ecosystem architecture, tracking logic, and backend integration.",
    outcome: "Improved commute transparency and centralized control for transport management.",
    image: "/projects/bus_tracking_v2_1775817751690.png",
    tags: ["Node.js", "Firebase", "GPS", "Fleet Management"],
    github: "https://github.com/dileepwork/project_bus.git"
  },
  {
    title: "Arjun AI - WhatsApp CRM",
    problem: "Small businesses struggle to manage customer interactions across WhatsApp efficiently.",
    solution: "AI WhatsApp assistant that automates communication, categorizes leads, and handles follow-ups.",
    role: "Conversation flow design, CRM logic, and WhatsApp API integration.",
    outcome: "Reduced manual effort and improved customer response times melalui automation.",
    image: "/projects/whatsapp_crm_v2_1775817766944.png",
    tags: ["WhatsApp API", "NLP", "Python", "CRM"]
  },
  {
    title: "FusionFlow AI",
    problem: "Organizations face manual attendance errors and lack of real-time workforce visibility.",
    solution: "Intelligent employee management system with biometric tracking and role-based access.",
    role: "Database structure design, authentication system, and reporting features.",
    outcome: "Streamlined attendance tracking and improved organizational visibility.",
    image: "/projects/attendance_management_v2_1775817782969.png",
    tags: ["React", "Node.js", "HR Management", "Auth"]
  },
  {
    title: "RoadGuard AI",
    problem: "Potholes cause accidents and vehicle damage; reporting systems are slow and manual.",
    solution: "Mobile app using AI to detect potholes via image capture and report road conditions with GPS tagging.",
    role: "AI detection pipeline, image processing integration, and gamified reporting logic.",
    outcome: "Enables faster road repair identification through crowdsourced data collection.",
    image: "/projects/roadguard_ai_v2_1775817799400.png",
    tags: ["Computer Vision", "Firebase", "Civic Tech", "Mobile"],
    github: "https://github.com/Dhinesh71/Roadguard_ai.git"
  },
  {
    title: "VisionGuard AI",
    problem: "Delayed accident detection leads to fatalities due to slow emergency response.",
    solution: "AI system analyzing CCTV footage to identify accidents and alert emergency services instantly.",
    role: "End-to-end architecture, video processing pipeline, and alert triggering logic.",
    outcome: "Reduces response time in accidents; demonstrates smart-city safety solutions.",
    image: "/projects/visionguard_ai_accident_mockup_1775811563972.png",
    tags: ["Computer Vision", "Python", "Smart City", "Security"],
    github: "https://github.com/dhineshdevhub/VisionGuard-AI.git"
  }
];

const Scene = ({ children, id }: { children: React.ReactNode, id: string }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1], // Premium easeOutExpo
        opacity: { duration: 1 } 
      }}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        marginBottom: '4rem',
      }}
    >
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </motion.section>
  );
};

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  return (
    <MouseParallaxProvider>
      <div className="app-container" style={{ background: 'transparent', position: 'relative' }}>

        {/* VR Environment - Stays fixed in background */}
        <VRTunnel />
        <VRHud />
        <CustomCursor />

        <Navbar onNavigate={scrollToSection} />

        <main style={{ position: 'relative', width: '100%' }}>
          <Scene id="hero">
            <Hero />
          </Scene>

          <Scene id="projects">
            <div style={{ paddingTop: '5rem' }}>
              <PanoramicProjects projects={PROJECTS_DATA} />
            </div>
          </Scene>

          <Scene id="skills">
            <Skills />
          </Scene>

          <Scene id="contact">
            <Contact />
          </Scene>

          <Scene id="end">
            <EndScene />
          </Scene>
        </main>
      </div>
    </MouseParallaxProvider>
  );
}

export default App;
