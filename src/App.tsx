import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PanoramicProjects from './components/PanoramicProjects';
import Skills from './components/Skills';
import Experiences from './components/Experiences';
import Education from './components/Education';
import Certificates from './components/Certificates';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import EndScene from './components/EndScene';
import VRTunnel from './components/VRTunnel';
import VRHud from './components/VRHud';
import CustomCursor from './components/CustomCursor';
import { MouseParallaxProvider } from './components/MouseParallaxProvider';

// Admin Auth & Layout
import { AuthProvider } from './admin/AuthContext';
import { ProtectedRoute } from './admin/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';

// Admin CMS Panels
import DashboardHome from './admin/DashboardHome';
import ProjectManagement from './admin/ProjectManagement';
import ProjectForm from './admin/ProjectForm';
import ExperienceManagement from './admin/ExperienceManagement';
import ExperienceForm from './admin/ExperienceForm';
import SkillsManagement from './admin/SkillsManagement';
import CertificatesManagement from './admin/CertificatesManagement';
import AchievementsManagement from './admin/AchievementsManagement';
import EducationManagement from './admin/EducationManagement';
import SocialLinksManagement from './admin/SocialLinksManagement';
import ContactMessages from './admin/ContactMessages';
import MediaLibrary from './admin/MediaLibrary';
import ProfileManagement from './admin/ProfileManagement';
import Settings from './admin/Settings';

// Public Section Wrapper
const Scene = ({ children, id }: { children: React.ReactNode; id: string }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.9 } 
      }}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        marginBottom: '2rem',
      }}
    >
      <div style={{ width: '100%' }}>
        {children}
      </div>
    </motion.section>
  );
};

// --- PUBLIC PORTFOLIO COMPONENT ---
const PublicPortfolio = () => {
  const lenisRef = useRef<Lenis | null>(null);
  
  // Data State
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Smooth Scrolling setup
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

  // Fetch API dataset
  useEffect(() => {
    const addLog = (msg: string) => {
      setSystemLogs(prev => [...prev, `[INIT] ${msg}`]);
    };

    const loadDataset = async () => {
      try {
        addLog("Resolving core identity structures...");
        const resProfile = await fetch('/api/public/profile');
        if (resProfile.ok) {
          const profileData = await resProfile.json();
          setProfile(profileData);
        }

        addLog("Loading global SEO configuration keys...");
        const resSettings = await fetch('/api/public/settings');
        if (resSettings.ok) {
          const settingsData = await resSettings.json();
          if (settingsData.portfolio_title) {
            document.title = settingsData.portfolio_title;
          }
          if (settingsData.seo_description) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute('content', settingsData.seo_description);
          }
        }

        addLog("Querying project stack elements...");
        const resProj = await fetch('/api/public/projects');
        if (resProj.ok) setProjects(await resProj.json());

        addLog("Compiling technical skillset logs...");
        const resSkills = await fetch('/api/public/skills');
        if (resSkills.ok) setSkills(await resSkills.json());

        addLog("Assembling work history milestones...");
        const resExp = await fetch('/api/public/experiences');
        if (resExp.ok) setExperiences(await resExp.json());

        addLog("Compiling academic qualifications details...");
        const resEdu = await fetch('/api/public/education');
        if (resEdu.ok) setEducation(await resEdu.json());

        addLog("Verifying security certifications...");
        const resCerts = await fetch('/api/public/certificates');
        if (resCerts.ok) setCertificates(await resCerts.json());

        addLog("Loading hackathons achievements archive...");
        const resAchs = await fetch('/api/public/achievements');
        if (resAchs.ok) setAchievements(await resAchs.json());

        addLog("Fetching contact networks...");
        const resSocials = await fetch('/api/public/social-links');
        if (resSocials.ok) setSocialLinks(await resSocials.json());

        addLog("System diagnostic: ALL SYSTEMS OPERATIONAL");
        setTimeout(() => setLoading(false), 900);
      } catch (err) {
        console.error("Error loading portfolio dataset:", err);
        setLoading(false);
      }
    };

    loadDataset();
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

  // Futuristic Terminal Loader
  if (loading) {
    return (
      <div style={{
        background: '#05080D',
        minHeight: '100vh',
        color: '#10b981',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        padding: '2rem',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', maxWidth: '500px', border: '1px solid rgba(16,185,129,0.15)', background: '#0B1118', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 0 30px rgba(16,185,129,0.05)' }}>
          <div style={{ borderBottom: '1px solid rgba(16,185,129,0.1)', paddingBottom: '0.4rem', marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
            CYBER-NEXUS DECK INITIALIZATION
          </div>
          <div style={{ height: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.75rem', color: '#8B98A8' }}>
            {systemLogs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          LOADING DATA DECK INTERFACE...
        </div>
      </div>
    );
  }

  return (
    <MouseParallaxProvider>
      <div className="app-container" style={{ background: 'transparent', position: 'relative' }}>
        
        {/* Futuristic VR Environment overlays */}
        <VRTunnel />
        <VRHud />
        <CustomCursor />

        <Navbar onNavigate={scrollToSection} />

        <main style={{ position: 'relative', width: '100%' }}>
          
          <Scene id="hero">
            <Hero profile={profile || { name: 'Dileep V', title: 'IoT Engineer', intro: '', profile_image: '/dileep.png', resume_url: '' }} />
          </Scene>

          {projects && projects.length > 0 && (
            <section id="projects" style={{ width: '100%', position: 'relative' }}>
              <PanoramicProjects projects={projects} />
            </section>
          )}

          {skills && skills.length > 0 && (
            <Scene id="skills">
              <Skills skills={skills} />
            </Scene>
          )}

          {experiences && experiences.length > 0 && (
            <Scene id="experiences">
              <Experiences experiences={experiences} />
            </Scene>
          )}

          {education && education.length > 0 && (
            <Scene id="education">
              <Education education={education} />
            </Scene>
          )}

          {certificates && certificates.length > 0 && (
            <Scene id="certificates">
              <Certificates certificates={certificates} />
            </Scene>
          )}

          {achievements && achievements.length > 0 && (
            <Scene id="achievements">
              <Achievements achievements={achievements} />
            </Scene>
          )}

          <Scene id="contact">
            <Contact 
              profile={profile || { email: '', phone: '', location: '' }} 
              socialLinks={socialLinks || []} 
            />
          </Scene>

          <Scene id="end">
            <EndScene />
          </Scene>

        </main>
      </div>
    </MouseParallaxProvider>
  );
};

// --- MAIN ROUTE CONTROLLER ---
const AppInner = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* If we are on an admin screen, override cursor styles to restore normal system cursor */}
      {isAdminRoute && (
        <style dangerouslySetInnerHTML={{ __html: `
          * { cursor: auto !important; }
          body { overflow: auto !important; }
        `}} />
      )}

      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<PublicPortfolio />} />

        {/* Secure Admin Portal Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          
          {/* Projects CRUD */}
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          
          {/* Experiences CRUD */}
          <Route path="experiences" element={<ExperienceManagement />} />
          <Route path="experiences/new" element={<ExperienceForm />} />
          <Route path="experiences/edit/:id" element={<ExperienceForm />} />
          
          {/* Other CRM segments */}
          <Route path="skills" element={<SkillsManagement />} />
          <Route path="certificates" element={<CertificatesManagement />} />
          <Route path="achievements" element={<AchievementsManagement />} />
          <Route path="education" element={<EducationManagement />} />
          <Route path="socials" element={<SocialLinksManagement />} />
          
          {/* Miscellaneous panels */}
          <Route path="messages" element={<ContactMessages />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="profile" element={<ProfileManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
