import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const EndScene = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '2rem'
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div style={{
          width: '80px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
          marginBottom: '2rem'
        }} />
        
        <h2 style={{ 
          fontSize: 'clamp(3rem, 10vw, 8rem)', 
          fontWeight: 900, 
          letterSpacing: '-0.06em',
          lineHeight: 0.9,
          margin: 0,
          background: 'linear-gradient(135deg, #fff 0%, #a3a3a3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1))'
        }}>
          FIN.
        </h2>
        
        <p style={{ 
          color: 'var(--primary)', 
          fontWeight: 700, 
          letterSpacing: '0.4em', 
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          textTransform: 'uppercase'
        }}>
          End of Transmission
        </p>

        <div style={{
          width: '80px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
          marginTop: '2rem'
        }} />
      </motion.div>

      <motion.div 
        style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <a href="https://github.com/dileepwork" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.5 }}><GithubIcon size={20} /></a>
        <a href="https://www.linkedin.com/in/dileep-v-482035361" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.5 }}><LinkedinIcon size={20} /></a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=dileeppvt03@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.5 }}><Mail size={20} /></a>
      </motion.div>

      <motion.p 
        style={{ 
          marginTop: '2rem', 
          fontSize: '0.7rem', 
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.1em'
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.5 }}
      >
        © 2026 DILEEP PORTFOLIO — ENGINEERED WITH PRECISION
      </motion.p>
    </div>
  );
};

export default EndScene;
