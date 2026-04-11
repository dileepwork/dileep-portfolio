import { motion } from 'framer-motion';
import { Cpu, Code2, BrainCircuit, Wrench } from 'lucide-react';

const skillCategories = [
  {
    title: "Core Expertise",
    icon: <Cpu size={26} />,
    color: "rgba(16, 185, 129, 0.2)",
    accent: "#10b981",
    skills: [
      "Embedded Systems Development",
      "IoT System Design & Prototyping",
      "Sensor Fusion & Real-Time Monitoring",
      "Wearable Tech & Medical Devices"
    ]
  },
  {
    title: "Software & Programming",
    icon: <Code2 size={26} />,
    color: "rgba(139, 92, 246, 0.2)",
    accent: "#8b5cf6",
    skills: [
      "Embedded C / C++ (Arduino)",
      "Python (Data & Signal Processing)",
      "Firmware Development",
      "Serial Communication & Debugging"
    ]
  },
  {
    title: "AI & Data Applications",
    icon: <BrainCircuit size={26} />,
    color: "rgba(245, 158, 11, 0.2)",
    accent: "#f59e0b",
    skills: [
      "Sensor Data Interpretation",
      "Predictive Systems Design",
      "Threshold-Free Edge Analysis",
      "Real-Time Analytics Integration"
    ]
  },
  {
    title: "Tools & Platforms",
    icon: <Wrench size={26} />,
    color: "rgba(236, 72, 153, 0.2)",
    accent: "#ec4899",
    skills: [
      "KiCad & EasyEDA (PCB Design)",
      "Proteus Circuit Simulation",
      "Git & Version Control",
      "Arduino & PlatformIO"
    ]
  }
];

const Skills = () => {
  return (
    <section id="skills" style={{ padding: '5rem 2rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          #skills { padding: 8rem 2rem !important; }
        }
      `}} />
      <div className="container" style={{ padding: '0 2.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem', textAlign: 'center' }}
        >
          <span style={{
            color: 'var(--primary)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Technical Arsenal
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.55) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Technical Skillset
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0.4rem auto 0', fontSize: '0.9rem' }}>
            Specializing in embedded systems and IoT hardware design from logic to PCB.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, borderColor: `${category.accent}80` }}
              className="glass"
              style={{
                padding: '2rem',
                borderRadius: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Circuit board decoration */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', opacity: 0.15 }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', width: '30px', height: '30px', borderTop: `1px solid ${category.accent}`, borderRight: `1px solid ${category.accent}` }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${category.accent}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: category.accent,
                  boxShadow: `0 0 15px ${category.accent}15`,
                  flexShrink: 0
                }}>
                  {category.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    {category.title}
                  </h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.5rem'
                  }}>
                    {category.skills.map((skill, i) => (
                      <span key={i} style={{ 
                        fontSize: '0.65rem',
                        color: 'rgba(255,255,255,0.6)', 
                        background: 'rgba(255,255,255,0.03)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '2rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontWeight: 600,
                        letterSpacing: '0.02em'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 1100px) {
            #skills > div > div:last-child {
              grid-template-columns: 1fr !important;
            }
            .glass {
              grid-template-columns: 1fr !important;
              text-align: center;
              padding: 2rem !important;
            }
            ul {
              border-left: none !important;
              padding-left: 0 !important;
              align-items: center;
            }
          }
        `}} />
      </div>
    </section>
  );
};

export default Skills;
