import { motion } from 'framer-motion';

const BackgroundDynamic = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'var(--bg-dark)'
    }}>
      {/* Quantum Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${['#10b981', '#3b82f6', '#8b5cf6'][i % 3]}33 0%, transparent 70%)`,
            filter: 'blur(30px)',
            borderRadius: '50%',
            willChange: 'transform'
          }}
        />
      ))}

      {/* Main Orbs */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -70, 70, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          willChange: 'transform'
        }}
      />

      {/* Orb 2 - Optimized */}
      <motion.div
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 80, -80, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

export default BackgroundDynamic;
