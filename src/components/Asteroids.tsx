import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const Asteroid = ({ position, size, rotationSpeed, scrollYProgress }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const initialY = position[1];

  const color = useMemo(() => {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const fallDistance = 40;
    meshRef.current.position.y = initialY - scrollYProgress.get() * fallDistance;
    meshRef.current.rotation.x += rotationSpeed.x;
    meshRef.current.rotation.y += rotationSpeed.y;
    meshRef.current.rotation.z += rotationSpeed.z;
  });

  return (
    <group ref={meshRef} position={position}>
      <Icosahedron args={[size, 0]}>
        <meshStandardMaterial 
          color="#050505" 
          emissive={color}
          emissiveIntensity={1.2}
          roughness={0.1} 
          metalness={1} 
          flatShading
        />
      </Icosahedron>
      <pointLight 
        distance={size * 6} 
        intensity={2} 
        color={color} 
      />
    </group>
  );
};

const Asteroids = () => {
  const { scrollYProgress } = useScroll();
  
  const asteroidData = useMemo(() => {
    return Array.from({ length: 8 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20, // X
        Math.random() * 20 + 10,    // Y (start above/spread)
        (Math.random() - 0.5) * 10 - 5 // Z
      ],
      size: Math.random() * 0.4 + 0.1,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      }
    }));
  }, []);

  return (
    <group>
      {asteroidData.map((data, index) => (
        <Asteroid 
          key={index} 
          {...data} 
          scrollYProgress={scrollYProgress} 
        />
      ))}
    </group>
  );
};

export default Asteroids;
