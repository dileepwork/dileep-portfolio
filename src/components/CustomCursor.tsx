import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const scale = useMotionValue(1);

  // Lagging outer element
  const lx = useSpring(mx, { damping: 18, stiffness: 200, mass: 0.6 });
  const ly = useSpring(my, { damping: 18, stiffness: 200, mass: 0.6 });
  const ls = useSpring(scale, { damping: 16, stiffness: 180 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button')) {
        scale.set(1.7);
      }
    };
    const onOut = () => scale.set(1);
    const onDown = () => { scale.set(0.7); setTimeout(() => scale.set(1), 120); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);

    return () => {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
    };
  }, [mx, my, scale]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* ── Outer scanner — rotated square (diamond) with gaps ── */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: lx, y: ly,
          translateX: '-50%', translateY: '-50%',
          width: 30, height: 30,
          rotate: 45,
          scale: ls,
          zIndex: 99999, pointerEvents: 'none',
        }}
      >
        {/* 4 corner brackets of the diamond */}
        {[
          { top: 0, left: 0, borderTop: '1.5px solid #10b981', borderLeft: '1.5px solid #10b981' },
          { top: 0, right: 0, borderTop: '1.5px solid #10b981', borderRight: '1.5px solid #10b981' },
          { bottom: 0, left: 0, borderBottom: '1.5px solid #10b981', borderLeft: '1.5px solid #10b981' },
          { bottom: 0, right: 0, borderBottom: '1.5px solid #10b981', borderRight: '1.5px solid #10b981' },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 8, height: 8,
              ...s,
            }}
          />
        ))}
      </motion.div>

      {/* ── Inner dot — snaps instantly ── */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          width: 4, height: 4,
          rotate: 45,
          background: '#10b981',
          boxShadow: '0 0 6px #10b981, 0 0 14px rgba(16,185,129,0.5)',
          zIndex: 99999, pointerEvents: 'none',
        }}
      />

      {/* ── Crosshair ticks — lag slightly ── */}
      {/* Horizontal */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: lx, y: ly,
          translateX: '-50%', translateY: '-50%',
          zIndex: 99999, pointerEvents: 'none',
        }}
      >
        {/* left tick */}
        <div style={{
          position: 'absolute', top: '50%', left: -20,
          transform: 'translateY(-50%)',
          width: 8, height: 1,
          background: 'rgba(16,185,129,0.5)',
        }} />
        {/* right tick */}
        <div style={{
          position: 'absolute', top: '50%', right: -20,
          transform: 'translateY(-50%)',
          width: 8, height: 1,
          background: 'rgba(16,185,129,0.5)',
        }} />
        {/* top tick */}
        <div style={{
          position: 'absolute', left: '50%', top: -20,
          transform: 'translateX(-50%)',
          width: 1, height: 8,
          background: 'rgba(16,185,129,0.5)',
        }} />
        {/* bottom tick */}
        <div style={{
          position: 'absolute', left: '50%', bottom: -20,
          transform: 'translateX(-50%)',
          width: 1, height: 8,
          background: 'rgba(16,185,129,0.5)',
        }} />
      </motion.div>
    </>
  );
};

export default CustomCursor;
