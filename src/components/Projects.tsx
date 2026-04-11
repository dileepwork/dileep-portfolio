import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';

const projects = [
  {
    title: "AI Nexus Dashboard",
    description: "Next-gen AI monitoring platform with real-time data visualization and neural network mapping.",
    image: "/src/assets/projects/project1.png",
    tags: ["React", "TypeScript", "D3.js", "Framer Motion"],
    link: "#",
    github: "#"
  },
  {
    title: "CryptoVault Mobile",
    description: "Secure, decentralized wallet supporting multi-chain assets with a premium glassmorphic interface.",
    image: "/src/assets/projects/project2.png",
    tags: ["React Native", "Web3.js", "Solidity", "Tailwind"],
    link: "#",
    github: "#"
  },
  {
    title: "Zenith Space Analytics",
    description: "Space-themed SaaS landing page for advanced telemetry analytics and satellite tracking.",
    image: "/src/assets/projects/project3.png",
    tags: ["Next.js", "Three.js", "PostgreSQL", "Prisma"],
    link: "#",
    github: "#"
  }
];

const Projects = () => {
  return (
    <section id="projects" style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5, margin: "-15% 0px 0px 0px" }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Selected Works</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A collection of projects that push the boundaries of design and technology.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25, margin: "-20% 0px 0px 0px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card"
              style={{ 
                borderRadius: '1.5rem', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s ease'
              }}
              whileHover={{ y: -10 }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  className="project-image"
                />
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.8))' 
                }} />
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {project.tags.map((tag, i) => (
                    <span key={i} style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '2rem', 
                      background: 'rgba(16, 185, 129, 0.08)', 
                      color: 'var(--accent)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      fontWeight: 600,
                      letterSpacing: '0.02em'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  {project.description}
                </p>

                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <a href={project.github} className="hover-scale" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    fontSize: '0.85rem',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <Code size={16} /> Code
                  </a>
                  <a href={project.link} className="hover-scale" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    fontSize: '0.85rem', 
                    color: 'var(--primary)',
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontWeight: 600
                  }}>
                    <ExternalLink size={16} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
