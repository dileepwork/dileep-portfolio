import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const NavLink = ({ href, children, isMobile, onClick }: { href: string, children: React.ReactNode, isMobile?: boolean, onClick?: () => void }) => (
  <motion.a 
    href={href} 
    onClick={onClick}
    style={{ 
      position: 'relative', 
      fontSize: isMobile ? '1.5rem' : '0.9rem', 
      fontWeight: isMobile ? 700 : 500, 
      color: 'var(--text-dim)',
      padding: isMobile ? '1rem 0' : '0'
    }}
    whileHover={{ color: '#fff' }}
  >
    {children}
    {!isMobile && (
      <motion.div
        className="nav-line"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: 'circOut' }}
        style={{
          position: 'absolute',
          bottom: '-4px',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'var(--primary)',
          originX: 0
        }}
      />
    )}
  </motion.a>
);

const Navbar = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() => onNavigate('hero')}
      style={{
        position: 'fixed',
        top: '2.5rem',
        left: '2.5rem',
        zIndex: 1000,
        cursor: 'pointer'
      }}
    >
      <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
        DILEEP<span style={{ color: 'var(--primary)' }}>.</span>
      </div>
    </motion.div>
  );
};

export default Navbar;
