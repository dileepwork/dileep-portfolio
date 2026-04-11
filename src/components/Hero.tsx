import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const MagneticButton = ({ children, style }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: any) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    x.set(deltaX * 0.35);
    y.set(deltaY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        x: springX,
        y: springY,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

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

const Hero = () => {
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
        gridTemplateColumns: '1fr 1fr', // Symmetrical 50/50 high-impact split
        gap: '4rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1400px', // Wider layout to use all space
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

          <motion.h1 
            className="text-shadow"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            style={{ 
              fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
              fontWeight: 900, 
              lineHeight: 1.05,
              marginBottom: '1rem',
              letterSpacing: '-0.05em'
            }}
          >
            Engineering the <br />
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #34d399 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.2))'
            }}>Technological Future</span>
          </motion.h1>
          
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
            Pioneering high-precision IoT engineering and specialized 
            embedded systems built to unify the digital and physical worlds.
          </motion.p>

          {/* Immersive Scroll HUD Replacement */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            style={{ 
              marginTop: '4rem', 
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
                System Ready: v4.0.2
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
            minHeight: '600px',
            background: 'transparent' // Ensure no background interferes with screen blend
          }}
        >
          {/* Background Quantum Rings */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QuantumNetwork />
          </div>

          <motion.img 
            src="/robot.png" 
            alt="Robotic Assistant"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: '90%',
              maxHeight: '85vh',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'brightness(1.2) contrast(1.5)', // Increased contrast to kill near-black pixels
              WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 95%)', // Hide box edges
              maskImage: 'radial-gradient(circle, black 60%, transparent 95%)',
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
