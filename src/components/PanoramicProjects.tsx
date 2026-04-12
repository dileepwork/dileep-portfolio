import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Lightbulb, Target, Zap, ExternalLink } from 'lucide-react';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

interface Project {
  title: string;
  problem: string;
  solution: string;
  role: string;
  outcome: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
}

const ProjectCardFlip = ({ project, index, scrollProgress, total }: { project: Project; index: number, scrollProgress: any, total: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Project Nexus: Progressive Reveal (Linear Fan)
  // Starts fanned out and pans through the deck
  
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const cardWidth = 300;
  const cardSpacing = 280; 
  
  // Base fanned position
  const fannedX = (index - (total - 1) / 2) * cardSpacing;
  
  // Panning: Offset the whole deck so we can scroll through it
  // Starts with the first card fanned on the left, pans across
  const totalDeckRange = (total - 1) * cardSpacing;
  const panOffset = useTransform(scrollProgress, [0, 0.85], [totalDeckRange / 2, -totalDeckRange / 2]);
  
  const xOffset = useTransform(panOffset, (p: any) => fannedX + p);

  const yOffset = 40; 
  const rotation = (index - (total - 1) / 2) * 2;
  
  // Opacity & Scale: Start visible, then fade out at the very end
  const opacity = useTransform(
    scrollProgress, 
    [0, 0.85, 1.0], 
    [1, 1, 0]
  );

  // Focus effect: Scale up when near the center of the viewport
  const scaleFocus = useTransform(
    xOffset,
    [-viewportWidth / 2, 0, viewportWidth / 2],
    [0.7, 1.05, 0.7]
  );
  
  const ACCENT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        x: xOffset,
        y: yOffset,
        translateX: '-50%',
        translateY: '-50%',
        rotateZ: rotation,
        opacity,
        scale: scaleFocus,
        perspective: '1200px',
        width: `${cardWidth}px`,
        height: '400px',
        zIndex: useTransform(xOffset, (x: any) => {
          if (isFlipped) return 500;
          return Math.round(100 - Math.abs(x as number) / 10);
        }),
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          y: isFlipped ? -60 : 0,
          scale: isFlipped ? 1.15 : 1,
          z: isFlipped ? 100 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
        }}
      >
        {/* FRONT SIDE (Image & Title) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          background: 'rgba(5, 20, 12, 0.9)',
          border: `1px solid ${accent}40`,
          boxShadow: `0 15px 35px rgba(0,0,0,0.5), 0 0 20px ${accent}20`,
        }}>
          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
          
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{project.title}</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {project.tags.slice(0, 2).map((t, i) => (
                <span key={i} style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: `${accent}20`, color: accent, borderRadius: '1rem', border: `1px solid ${accent}40` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', opacity: 0.3 }}>
             <Zap size={20} color={accent} />
          </div>
        </div>

        {/* BACK SIDE (Details) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          background: 'rgba(4, 12, 8, 0.95)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${accent}60`,
          boxShadow: `0 0 40px ${accent}25`,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ borderBottom: `1px solid ${accent}30`, paddingBottom: '0.5rem' }}>
            <h3 style={{ color: accent, fontSize: '1rem', fontWeight: 900 }}>{project.title}</h3>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', paddingRight: '0.2rem' }}>
            <div className="detail-item">
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                 <Lightbulb size={12} /> Challenge
               </div>
               <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{project.problem}</p>
            </div>

            <div className="detail-item">
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: accent, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                 <Target size={12} /> Solution
               </div>
               <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{project.solution}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
               <div>
                  <div style={{ color: '#60a5fa', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>Role</div>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{project.role}</p>
               </div>
               <div>
                  <div style={{ color: '#fbbf24', fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase' }}>Impact</div>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{project.outcome}</p>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); if(project.github) window.open(project.github, '_blank'); }}
              style={{ flex: 1, background: `${accent}20`, border: `1px solid ${accent}40`, color: '#fff', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: project.github ? 'pointer' : 'not-allowed', opacity: project.github ? 1 : 0.4 }}
            >
              <GithubIcon size={14} /> Code
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); if(project.demo) window.open(project.demo, '_blank'); }}
              style={{ flex: 1, background: accent, border: 'none', color: '#000', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', cursor: project.demo ? 'pointer' : 'not-allowed', opacity: project.demo ? 1 : 0.4 }}
            >
              <ExternalLink size={14} /> Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PanoramicProjects = ({ projects }: { projects: Project[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  
  // Calculate dynamic height based on project count (min 350vh, +50vh per project beyond 8)
  const containerHeight = Math.max(350, 200 + (projects.length * 50));

  return (
    <div ref={containerRef} style={{ height: `${containerHeight}vh`, position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Section Header */}
        <motion.div
           style={{
             position: 'absolute',
             top: '8rem',
             textAlign: 'center',
             zIndex: 5,
             opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
           }}
        >
          <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Selected Works</span>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Project Nexus
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Scroll to explore the sequence</p>
          
          {/* Deck Counter Indicator */}
          <div style={{ 
            marginTop: '2rem', 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {projects.map((_, i) => (
              <motion.div 
                key={i}
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  opacity: useTransform(smoothProgress, [0.3 + (i / projects.length) * 0.5, 0.3 + ((i + 1) / projects.length) * 0.5], [0.2, 1])
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* The Card Stack */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           {projects.map((p, i) => (
             <ProjectCardFlip key={i} project={p} index={i} total={projects.length} scrollProgress={smoothProgress} />
           ))}
        </div>
      </div>
    </div>
  );
};

export default PanoramicProjects;
