import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  organization: string;
  date: string;
  description: string;
  image_url: string;
  certificate_url: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <section id="achievements" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}
        >
          <span style={{
            color: 'var(--primary)',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Honor
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Awards & Recognitions
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Hackathons, technical presentations, and project competitions.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%'
        }}>
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass"
              style={{
                borderRadius: '1.25rem',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '340px',
                position: 'relative',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'}
            >
              {/* Image Preview / Banner Area */}
              <div style={{
                height: '140px',
                background: '#05080D',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {ach.image_url ? (
                  <img 
                    src={ach.image_url} 
                    alt={ach.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: 'rgba(16, 185, 129, 0.3)' }}>
                    <Trophy size={36} />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />
                
                {/* Floating Date */}
                {ach.date ? (
                  <span style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '1rem',
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontWeight: 500
                  }}>
                    <Calendar size={10} color="var(--primary)" />
                    {ach.date}
                  </span>
                ) : null}

                {/* Floating Trophy Icon */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1.2rem',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: '0 0 10px rgba(16,185,129,0.2)'
                }}>
                  <Trophy size={14} />
                </div>
              </div>

              {/* Contents Area */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }}>
                    {ach.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 650, marginTop: '0.15rem' }}>
                    {ach.organization}
                  </p>
                </div>

                {ach.description ? (
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ach.description}
                  </p>
                ) : null}

                {/* Floating Certificate Verification Link */}
                {ach.certificate_url ? (
                  <a
                    href={ach.certificate_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: 'auto',
                      alignSelf: 'flex-start',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <span>View Recognition</span>
                    <ExternalLink size={10} />
                  </a>
                ) : null}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Achievements;
