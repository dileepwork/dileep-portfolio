import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface Profile {
  name: string;
  title: string;
  intro: string;
  about: string;
  profile_image: string;
  resume_url: string;
}

interface HeroProps {
  profile: Profile;
}

const QuantumNetwork = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central Pulsing Hub */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      
      {/* Animated Data "Nodes" */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 300 - 150, 
            y: Math.random() * 300 - 150,
            opacity: Math.random()
          }}
          animate={{ 
            y: [null, Math.random() * -60 - 30, null],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 8 + Math.random() * 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'var(--primary)',
            boxShadow: '0 0 10px var(--primary)',
            borderRadius: '50%'
          }}
        />
      ))}

      {/* Grid Lines Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
        opacity: 0.4
      }} />

      {/* Technical Focal Rings */}
      <div style={{
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        border: '1px solid rgba(16, 185, 129, 0.1)',
        position: 'relative'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: -15,
            border: '1px dashed rgba(16, 185, 129, 0.1)',
            borderRadius: '50%'
          }}
        />
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      padding: '12rem 1rem 6rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container hero-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          style={{ textAlign: 'left' }}
        >
          {/* Specialization category tag */}
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{
              color: 'var(--primary)',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
              display: 'block',
              marginBottom: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '0.3rem 0.8rem',
              borderRadius: '2rem',
              background: 'rgba(16, 185, 129, 0.03)',
              alignSelf: 'flex-start',
              width: 'fit-content'
            }}
          >
            {profile.title || "IoT & Embedded Systems Engineer"}
          </motion.span>

          {/* Name heading */}
          <motion.h1 
            className="text-shadow"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{ 
              fontSize: 'clamp(2rem, 8vw, 5.5rem)', 
              fontWeight: 900, 
              lineHeight: 1.05,
              marginBottom: '1.25rem',
              letterSpacing: '-0.05em',
              wordBreak: 'break-word',
              color: '#fff'
            }}
          >
            I'm <span style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #34d399 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.2))'
            }}>{profile.name || "Dileep V"}</span>
          </motion.h1>
          
          {/* Subtitle Intro */}
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{ 
              color: '#fff', 
              opacity: 0.8,
              maxWidth: '600px', 
              marginBottom: '2.5rem',
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              lineHeight: 1.7,
              fontWeight: 300
            }}
          >
            {profile.intro || "Pioneering high-precision IoT engineering and specialized embedded systems built to unify the digital and physical worlds."}
          </motion.p>

          {/* Resume Download Trigger */}
          {profile.resume_url ? (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              style={{ marginBottom: '3rem' }}
            >
              <a 
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '2rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(16,185,129,0.1)',
                  transition: 'all 0.25s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#000'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; e.currentTarget.style.color = 'var(--primary)'; }}
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME / CV</span>
              </a>
            </motion.div>
          ) : null}

          {/* Immersive Scroll HUD */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            style={{ 
              marginTop: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.2rem',
              borderLeft: '1px solid rgba(16, 185, 129, 0.3)',
              paddingLeft: '1.5rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}
              />
              <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)' }}>
                System Ready: Active
              </span>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.05em' }}>
              SCROLL TO INITIATE INTERFACE SEQUENCING
            </p>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: '1px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', marginTop: '0.5rem', originY: 0 }}
            />
          </motion.div>
        </motion.div>

        {/* Right Side Visual Unit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            position: 'relative', 
            width: '100%', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'min(600px, 70vh)',
            background: 'transparent'
          }}
        >
          {/* Background Quantum Rings */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QuantumNetwork />
          </div>

          <motion.img 
            src={profile.profile_image || "/dileep.png"} 
            alt="Dileep V"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '90%',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: (profile.profile_image && profile.profile_image.includes('dileep')) ? '2rem' : '0',
              border: (profile.profile_image && profile.profile_image.includes('dileep')) ? '2px solid rgba(16, 185, 129, 0.15)' : 'none',
              boxShadow: (profile.profile_image && profile.profile_image.includes('dileep')) ? '0 0 30px rgba(16, 185, 129, 0.1)' : 'none',
              mixBlendMode: (profile.profile_image && profile.profile_image.includes('dileep')) ? 'normal' : 'screen',
              filter: (profile.profile_image && profile.profile_image.includes('dileep')) ? 'none' : 'brightness(1.2) contrast(1.5)',
              WebkitMaskImage: (profile.profile_image && profile.profile_image.includes('dileep')) ? 'none' : 'radial-gradient(circle, black 60%, transparent 95%)',
              maskImage: (profile.profile_image && profile.profile_image.includes('dileep')) ? 'none' : 'radial-gradient(circle, black 60%, transparent 95%)',
              pointerEvents: 'none',
              position: 'relative',
              zIndex: 2,
              display: 'block'
            }}
          />
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 968px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .hero-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-btns {
            justify-content: center !important;
          }
          .hero-content p {
            margin: 0 auto 3rem !important;
          }
        }
      `}} />
    </section>
  );
};

export default Hero;
