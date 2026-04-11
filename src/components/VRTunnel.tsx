import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Grid, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useSpring } from 'framer-motion';

/* ─── Galaxy Nebula Effect ─── */
function Nebula() {
  const count = 15;
  const nebulaData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -Math.random() * 100],
      scale: Math.random() * 20 + 10,
      color: ['#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 3)],
      opacity: Math.random() * 0.05 + 0.02
    }));
  }, []);

  return (
    <group>
      {nebulaData.map((d, i) => (
        <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}>
          <mesh position={d.position as any}>
            <sphereGeometry args={[d.scale, 32, 32]} />
            <meshBasicMaterial 
              color={d.color} 
              transparent 
              opacity={d.opacity} 
              blending={THREE.AdditiveBlending} 
              depthWrite={false} 
              side={THREE.BackSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ─── Floating Particle Field ─── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 1200; // Increased count for more density

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.004) * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={COUNT} 
          array={positions} 
          itemSize={3} 
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#10b981"
        size={0.08}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Floating Rings ─── */
function FloatingRings({ scrollVal }: { scrollVal: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const rings = useMemo(() => ([
    { radius: 18, tube: 0.04, color: '#10b981', opacity: 0.18, rotX: Math.PI / 2, y: 0, z: -20 },
    { radius: 12, tube: 0.03, color: '#06b6d4', opacity: 0.15, rotX: Math.PI / 3, y: 3, z: -10 },
    { radius: 22, tube: 0.025, color: '#10b981', opacity: 0.1, rotX: Math.PI / 4, y: -4, z: -30 },
    { radius: 8,  tube: 0.03, color: '#34d399', opacity: 0.2, rotX: Math.PI / 6, y: 2, z: -5 },
  ]), []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
    // parallax with scroll
    group.current.position.z = scrollVal.current * 15;
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, r.y, r.z]} rotation={[r.rotX, i * 0.5, i * 0.3]}>
          <torusGeometry args={[r.radius, r.tube, 4, 128]} />
          <meshBasicMaterial color={r.color} transparent opacity={r.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Infinite Grid Floor ─── */
function InfiniteGrid({ scrollVal }: { scrollVal: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    // scroll-linked drift
    ref.current.position.z = (scrollVal.current * 20) % 4;
  });

  return (
    <group ref={ref} position={[0, -6, 0]} rotation={[0, 0, 0]}>
      <Grid
        args={[200, 200]}
        cellSize={4}
        cellThickness={0.4}
        cellColor="#0d3320"
        sectionSize={20}
        sectionThickness={0.8}
        sectionColor="#10b981"
        fadeDistance={60}
        fadeStrength={1.5}
        infiniteGrid
      />
    </group>
  );
}

/* ─── Ceiling Grid Mirror ─── */
function CeilingGrid({ scrollVal }: { scrollVal: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z = (scrollVal.current * 20) % 4;
  });

  return (
    <group ref={ref} position={[0, 14, 0]} rotation={[Math.PI, 0, 0]}>
      <Grid
        args={[200, 200]}
        cellSize={4}
        cellThickness={0.3}
        cellColor="#050f09"
        sectionSize={20}
        sectionThickness={0.6}
        sectionColor="#064e3b"
        fadeDistance={50}
        fadeStrength={2}
        infiniteGrid
      />
    </group>
  );
}

/* ─── Glowing Accent Lines (side walls) ─── */
function WallLines({ scrollVal }: { scrollVal: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const LINE_COUNT = 12;

  const lines = useMemo(() => (
    Array.from({ length: LINE_COUNT }, (_, i) => ({
      z: -i * 8,
      opacity: 0.06 + (i % 3) * 0.04,
    }))
  ), []);

  useFrame(() => {
    if (!group.current) return;
    const speed = (scrollVal.current * LINE_COUNT * 8);
    group.current.position.z = speed % (LINE_COUNT * 8);
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <mesh key={i} position={[0, 4, line.z]}>
          <planeGeometry args={[0.015, 20]} />
          <meshBasicMaterial color="#10b981" transparent opacity={line.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      {/* Left & Right glowing edges */}
      {[-12, 12].map((x, j) =>
        lines.map((line, i) => (
          <mesh key={`${j}-${i}`} position={[x, 4, line.z]} rotation={[0, j === 0 ? 0.3 : -0.3, 0]}>
            <planeGeometry args={[0.012, 20]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={line.opacity * 0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ─── Mouse-Tracked Camera ─── */
function CameraRig({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const currentPos = useRef({ x: 0, y: 0, z: 8 });
  const currentRot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Smoothed positional parallax (Moving the camera head)
    currentPos.current.x += (mouseRef.current.x * 1.5 - currentPos.current.x) * 0.03;
    currentPos.current.y += (mouseRef.current.y * 1.2 + 1 - currentPos.current.y) * 0.03;
    
    // Smoothed rotational parallax (Looking around)
    currentRot.current.x += (mouseRef.current.y * 0.12 - currentRot.current.x) * 0.05;
    currentRot.current.y += (mouseRef.current.x * 0.18 - currentRot.current.y) * 0.05;

    camera.position.x = currentPos.current.x;
    camera.position.y = currentPos.current.y;
    camera.rotation.x = currentRot.current.x;
    camera.rotation.y = currentRot.current.y;
  });

  return null;
}

/* ─── Main 3D Environment ─── */
const VRTunnel = () => {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { damping: 40, stiffness: 80 });
  const scrollVal = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const unsub = smooth.on('change', (v) => { scrollVal.current = v; });
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);
    return () => { unsub(); window.removeEventListener('mousemove', onMouse); };
  }, [smooth]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: -1, pointerEvents: 'none',
      background: 'linear-gradient(180deg, #030d07 0%, #020a05 60%, #010604 100%)',
    }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }} performance={{ min: 0.5 }}>
        <PerspectiveCamera makeDefault position={[0, 1, 8]} fov={65} />
        <fog attach="fog" args={['#020a05', 30, 120]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} color="#0d4429" />
        <pointLight position={[0, 8, 0]}  intensity={1.5} color="#10b981" distance={60} decay={2} />
        <pointLight position={[0, -4, 10]} intensity={0.8} color="#06b6d4" distance={40} decay={2} />
        <pointLight position={[15, 2, -20]} intensity={0.5} color="#10b981" distance={50} decay={2} />
        <pointLight position={[-15, 2, -20]} intensity={0.5} color="#06b6d4" distance={50} decay={2} />

        <CameraRig mouseRef={mouseRef} />
        
        {/* Galaxy Background Components */}
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1.5} />
        <Nebula />
        
        <InfiniteGrid scrollVal={scrollVal} />
        <CeilingGrid scrollVal={scrollVal} />
        <FloatingRings scrollVal={scrollVal} />
        <WallLines scrollVal={scrollVal} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default VRTunnel;
