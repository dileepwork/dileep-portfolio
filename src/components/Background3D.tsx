import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Asteroids from './Asteroids';

const AnimatedShape = ({ position, color, speed, distort, radius }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[radius, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.4}
        />
      </Sphere>
    </Float>
  );
};

const TexturedBackground = () => {
  // Futuristic Grid with material settings
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 3D Texture Elements */}
      <AnimatedShape 
        position={[-4, 2, -5]} 
        color="#10b981" 
        speed={1.5} 
        distort={0.4} 
        radius={1.5} 
      />
      <AnimatedShape 
        position={[4, -2, -6]} 
        color="#3b82f6" 
        speed={2} 
        distort={0.5} 
        radius={2.2} 
      />
      <AnimatedShape 
        position={[0, 4, -8]} 
        color="#0891b2" 
        speed={1.2} 
        distort={0.3} 
        radius={1.2} 
      />
      
      <Asteroids />

      {/* Futuristic Grid */}
      <gridHelper args={[100, 50, '#10b981', '#1f2937']} position={[0, -10, 0]} />
      
      {/* Subtle Fog for depth */}
      <fog attach="fog" args={['#0a0a0a', 5, 20]} />
    </>
  );
};

const Background3D = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'radial-gradient(circle at center, #111 0%, #0a0a0a 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <TexturedBackground />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
        opacity: 0.05,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default Background3D;
