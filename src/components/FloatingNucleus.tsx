import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TorusKnot, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

const FloatingNucleus = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollYProgress.get();
    const t = state.clock.getElapsedTime();
    
    // Scale pulse tied to scroll speed
    const pulseFactor = 2 + (scroll * 8);
    const pulse = 1 + Math.sin(t * pulseFactor) * 0.08;
    meshRef.current.scale.set(pulse, pulse, pulse);
    
    // Rotation speeds up on scroll
    meshRef.current.rotation.x = t * (0.2 + scroll * 1.5);
    meshRef.current.rotation.y = t * (0.3 + scroll * 2);
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
      <TorusKnot ref={meshRef} args={[1.2, 0.4, 64, 12]} scale={1}>
        <meshStandardMaterial
          color="#10b981"
          roughness={0.1}
          metalness={1}
          emissive="#10b981"
          emissiveIntensity={1.5}
        />
      </TorusKnot>
    </Float>
  );
};

export default FloatingNucleus;
