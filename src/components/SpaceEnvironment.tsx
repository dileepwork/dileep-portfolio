import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion as m } from 'framer-motion';
import { useScroll, useSpring, useTransform } from 'framer-motion';

import Asteroids from './Asteroids';
import FloatingNucleus from './FloatingNucleus';

function CosmicDust() {
  const ref = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
      ref.current.rotation.x += 0.0001;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Nebula() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.0001;
    }
  });

  return (
    <group>
      <mesh ref={mesh} position={[10, -5, -10]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      <mesh position={[-15, 10, -20]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#064e3b" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

const SceneController = () => {
  const { scrollYProgress } = useScroll();
  const group = useRef<THREE.Group>(null);
  
  // Smooth scroll sync for space movement
  const scrollValue = useSpring(scrollYProgress, { damping: 50, stiffness: 100 });
  
  useFrame(() => {
    if (group.current) {
      // Rotate the entire cosmos as we scroll
      group.current.rotation.z = scrollValue.get() * Math.PI * 0.2;
      group.current.rotation.y = scrollValue.get() * 0.5;
      // Slight push moving "into" space
      group.current.position.z = scrollValue.get() * 10;
    }
  });

  return (
    <group ref={group}>
      <Stars radius={120} depth={60} count={7000} factor={7} saturation={0} fade speed={1.5} />
      <CosmicDust />
      <Nebula />
    </group>
  );
}

const SpaceEnvironment = () => {
  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, #050505 0%, #000000 100%)'
      }}
    >
      <Canvas dpr={[1, 2]} performance={{ min: 0.5 }} gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={55} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4c1d95" />
        
        <SceneController />
        <Asteroids />
        <fog attach="fog" args={['#000000', 5, 150]} />
      </Canvas>
    </m.div>
  );
};

export default SpaceEnvironment;
