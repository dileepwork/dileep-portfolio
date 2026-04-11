import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const VRHud = () => {
  const [time, setTime] = useState('');
  const [depthStr, setDepthStr] = useState('00000');

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 40, stiffness: 80 });
  const depthM = useTransform(smooth, [0, 1], [0, 9600]);
  const barHeight = useTransform(smooth, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const unsub = depthM.on('change', (v) =>
      setDepthStr(Math.round(v).toString().padStart(5, '0'))
    );
    return unsub;
  }, [depthM]);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── Holographic Scanlines ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%',
        opacity: 0.15
      }} />

      {/* ── Scanning Pulse ── */}
      <motion.div
        animate={{
          y: ['-10%', '110%'],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'fixed', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
          boxShadow: '0 0 15px var(--primary)',
          zIndex: 99, pointerEvents: 'none',
        }}
      />
      {/* ── Corner Brackets ── */}
      {[
        { top: 0, left: 0, borderTop: '1.5px solid', borderLeft: '1.5px solid' },
        { top: 0, right: 0, borderTop: '1.5px solid', borderRight: '1.5px solid' },
        { bottom: 0, left: 0, borderBottom: '1.5px solid', borderLeft: '1.5px solid' },
        { bottom: 0, right: 0, borderBottom: '1.5px solid', borderRight: '1.5px solid' },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed', zIndex: 20, pointerEvents: 'none',
            width: 28, height: 28, margin: '1rem',
            borderColor: 'rgba(16,185,129,0.5)',
            ...s,
          }}
        />
      ))}

      {/* ── Top-left: time ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          position: 'fixed', top: '1.75rem', left: '3rem',
          zIndex: 20, pointerEvents: 'none',
          fontFamily: "'Space Grotesk', monospace",
          fontSize: '0.65rem', fontWeight: 700,
          color: 'var(--primary)',
          letterSpacing: '0.18em',
          textShadow: '0 0 10px var(--primary)',
        }}
      >
        {time}
      </motion.div>

      {/* ── Top-right: label ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{
          position: 'fixed', top: '1.75rem', right: '3rem',
          zIndex: 20, pointerEvents: 'none',
          fontFamily: "'Space Grotesk', monospace",
          fontSize: '0.6rem', fontWeight: 700,
          color: 'rgba(16,185,129,0.45)',
          letterSpacing: '0.15em',
        }}
      >
        CYBER_NEXUS_01
      </motion.div>

      {/* ── Right-edge: depth bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          position: 'fixed', right: '1.2rem', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}
      >
        <div style={{ fontSize: '0.45rem', color: 'rgba(16,185,129,0.35)', letterSpacing: '0.1em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          DEPTH
        </div>
        <div style={{ width: 2, height: 100, background: 'rgba(16,185,129,0.08)', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{
            position: 'absolute', bottom: 0, width: '100%',
            background: 'linear-gradient(to top, #10b981, #34d399)',
            height: barHeight,
            boxShadow: '0 0 6px #10b981',
          }} />
        </div>
        <div style={{ fontSize: '0.45rem', color: 'rgba(16,185,129,0.4)', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
          {depthStr}
        </div>
      </motion.div>

      {/* ── Bottom hint ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, pointerEvents: 'none',
          fontSize: '0.55rem', color: 'rgba(16,185,129,0.3)',
          letterSpacing: '0.2em', fontFamily: "'Space Grotesk', monospace",
          whiteSpace: 'nowrap',
        }}
      >
        ◄ &nbsp; SCROLL TO NAVIGATE &nbsp; ►
      </motion.div>
    </>
  );
};

export default VRHud;
