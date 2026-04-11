import { motion } from 'framer-motion';
import { Code, Server, Lightbulb, Target, Wrench } from 'lucide-react';

interface ProjectProps {
  title: string;
  problem: string;
  solution: string;
  role: string;
  outcome: string;
  image: string;
  tags: string[];
  github?: string;
}

const ProjectSlide = ({ title, problem, solution, role, outcome, image, tags, github }: ProjectProps) => {
  return (
    <div className="container" style={{ 
      width: '100%', 
      maxWidth: '1300px', 
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 1rem'
    }}>
      <div className="glass" style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Symmetrical 50/50 split
        borderRadius: '2.5rem',
        overflow: 'hidden',
        width: '100%',
        minHeight: '600px',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Visual Side */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#050505' }}>
          <img 
            src={image} 
            alt={title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: 0.6
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to right, transparent, rgba(5,5,5,0.95))' 
          }} />
          
          {/* Technical HUD Overlay */}
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
            <div style={{ height: '1px', width: '30px', background: 'linear-gradient(to right, var(--primary), transparent)' }} />
          </div>
          
          <div style={{ 
            position: 'absolute', 
            top: '2.5rem', 
            right: '2rem', 
            fontSize: '0.65rem', 
            color: 'var(--primary)', 
            opacity: 0.5, 
            letterSpacing: '0.3em', 
            fontWeight: 800,
            transform: 'rotate(90deg)',
            transformOrigin: 'right top'
          }}>
            SYSTEM_ANALYSIS_MOD_4
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: '2rem', 
            left: '2rem', 
            width: '2px', 
            height: '40px', 
            background: 'linear-gradient(to bottom, var(--primary), transparent)' 
          }} />

          {/* Overlay Info for Visual Interest */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '3rem',
            right: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h3 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 900, 
              lineHeight: 1, 
              letterSpacing: '-0.06em',
              color: '#fff',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)'
            }}>
              {title}
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {tags.map((tag, i) => (
                <span key={i} style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '2rem', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--primary)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '0.05em'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Content Side */}
        <div style={{ 
          padding: '3.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(20px)',
          overflowY: 'auto',
          maxHeight: '85vh'
        }}>
          {/* Problem Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ff4d4d', marginBottom: '0.5rem' }}>
              <Lightbulb size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Challenge</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {problem}
            </p>
          </div>

          {/* Solution Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <Target size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Innovation</span>
            </div>
            <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, fontWeight: 300 }}>
              {solution}
            </p>
          </div>

          {/* Role & Outcome Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#3b82f6', marginBottom: '0.5rem' }}>
                <Wrench size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>My Role</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.4 }}>{role}</p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', marginBottom: '0.5rem' }}>
                <Server size={18} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Outcome</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.4 }}>{outcome}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-start' }}>
            {github && github !== '#' && (
              <motion.a 
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                href={github} 
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  border: '1px solid var(--glass-border)', 
                  color: '#fff', 
                  padding: '0.8rem 1.8rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: 600, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.7rem',
                  fontSize: '0.9rem'
                }}
              >
                View Repository <Code size={18} />
              </motion.a>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .glass {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .glass > div:first-child {
            display: none !important;
          }
          .glass > div:last-child {
            padding: 2.5rem !important;
          }
        }
      `}} />
    </div>
  );
};

export default ProjectSlide;
