import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import ScrollBackground from './ScrollBackground';

export default function Scene() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#c084fc" />
        <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#60a5fa" />
        <Environment preset="night" />
        
        <ScrollBackground />
      </Canvas>
    </div>
  );
}
