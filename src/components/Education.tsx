import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';

interface Education {
  id: number;
  institution: string;
  degree: string;
  department: string;
  start_year: string;
  end_year: string;
  gpa: string;
  description: string;
  logo_url: string;
}

interface EducationProps {
  education: Education[];
}

const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" style={{ padding: '6rem 2rem', position: 'relative' }}>
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
            Academy
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Educational Background
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Formal qualifications and specialization streams.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%'
        }}>
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass"
              style={{
                padding: '2rem',
                borderRadius: '1.25rem',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'}
            >
              {/* Circuit top border highlight */}
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />

              {/* Institution Row */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {edu.logo_url ? (
                  <img 
                    src={edu.logo_url} 
                    alt={edu.institution}
                    style={{ width: '44px', height: '44px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                ) : (
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}>
                    <GraduationCap size={20} />
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{edu.institution}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar size={10} color="var(--primary)" />
                    <span>{edu.start_year} – {edu.end_year || 'Present'}</span>
                  </div>
                </div>
              </div>

              {/* Degree Details */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>{edu.degree}</h4>
                  {edu.department ? (
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.15rem' }}>{edu.department}</p>
                  ) : null}
                </div>

                {edu.description ? (
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, marginTop: '0.25rem' }}>
                    {edu.description}
                  </p>
                ) : null}
              </div>

              {/* GPA Display Footer */}
              {edu.gpa ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  alignSelf: 'flex-start',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}>
                  <Award size={12} />
                  <span>CGPA/Grade: {edu.gpa}</span>
                </div>
              ) : null}

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
