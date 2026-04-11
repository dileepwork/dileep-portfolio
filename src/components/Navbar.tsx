import { motion } from 'framer-motion';

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
