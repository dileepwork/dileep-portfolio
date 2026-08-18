import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';

interface Certificate {
  id: number;
  name: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  verification_url: string;
  file_url: string;
  description: string;
}

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <section id="certificates" style={{ padding: '6rem 2rem', position: 'relative' }}>
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
            Credentials
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to right, #fff, #888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Professional Certifications
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Validated micro-controller architectures, hardware design, and software engineering.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%'
        }}>
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass"
              style={{
                padding: '1.8rem',
                borderRadius: '1.25rem',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)'}
            >
              {/* Header: Icon and Verification Link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <Award size={18} />
                </div>

                {cert.verification_url ? (
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      color: 'var(--primary)',
                      fontWeight: 700
                    }}
                  >
                    <span>Verify</span>
                    <ExternalLink size={10} />
                  </a>
                ) : null}
              </div>

              {/* Title & Organization */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{cert.name}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 650, marginTop: '0.15rem' }}>
                  {cert.organization}
                </p>
              </div>

              {/* Description */}
              {cert.description ? (
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, flex: 1 }}>
                  {cert.description}
                </p>
              ) : null}

              {/* Details Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                paddingTop: '0.85rem',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.4)'
              }}>
                {cert.issue_date ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Calendar size={10} color="var(--primary)" />
                    {cert.issue_date}
                  </span>
                ) : null}
                
                {cert.credential_id ? (
                  <span>ID: {cert.credential_id}</span>
                ) : null}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Certificates;
