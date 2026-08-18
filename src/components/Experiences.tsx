import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface Experience {
  id: number;
  company: string;
  role: string;
  type: string;
  location: string;
  start_date: string;
  end_date: string;
  currently_working: number;
  description: string;
  bullet_points: string[];
  technologies: string[];
  logo_url: string;
}

interface ExperiencesProps {
  experiences: Experience[];
}

const Experiences: React.FC<ExperiencesProps> = ({ experiences }) => {
  return (
    <section id="experiences" style={{ padding: '6rem 2rem', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Section Title */}
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
            Milestones
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Professional Timelines
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            History of embedded and IoT development training and internships.
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Central Line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '15px',
            bottom: '15px',
            width: '1px',
            background: 'linear-gradient(to bottom, var(--primary) 0%, rgba(16, 185, 129, 0.1) 100%)',
          }} />

          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              style={{
                display: 'flex',
                gap: '1.5rem',
                position: 'relative'
              }}
            >
              {/* Timeline Bullet Node */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: exp.currently_working === 1 ? 'rgba(16, 185, 129, 0.15)' : '#05120a',
                border: `1px solid ${exp.currently_working === 1 ? 'var(--primary)' : 'rgba(16, 185, 129, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                boxShadow: exp.currently_working === 1 ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none',
                zIndex: 10,
                flexShrink: 0
              }}>
                <Briefcase size={16} />
              </div>

              {/* Glass Details Card */}
              <div 
                className="glass"
                style={{
                  flex: 1,
                  padding: '1.8rem',
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'}
              >
                {/* Header Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.8rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{exp.role}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>{exp.company}</span>
                      <span style={{ opacity: 0.3, color: '#fff' }}>|</span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '0.25rem',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  {/* Location & Time */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', gap: '0.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} color="var(--primary)" />
                      {exp.start_date} – {exp.currently_working === 1 ? 'Present' : exp.end_date}
                    </span>
                    {exp.location ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} color="rgba(16,185,129,0.7)" />
                        {exp.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Description */}
                {exp.description ? (
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                    {exp.description}
                  </p>
                ) : null}

                {/* Responsibility Bullets */}
                {exp.bullet_points && exp.bullet_points.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
                    {exp.bullet_points.map((bullet, bIdx) => (
                      <div key={bIdx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>
                        <span style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }}>✓</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Technologies Tags */}
                {exp.technologies && exp.technologies.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.85rem' }}>
                    {exp.technologies.map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        style={{
                          fontSize: '0.65rem',
                          background: 'rgba(16, 185, 129, 0.05)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          color: 'var(--primary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '1rem',
                          fontWeight: 600
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}

              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
