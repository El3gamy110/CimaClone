import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollBackground() {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, 0, 5);

    // Create a GSAP timeline linked to the scroll of the entire page
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      },
    });

    // Animate the camera flying forward and rotating slightly
    tl.to(camera.position, {
      z: -5, // Fly less deep into the scene to slow down the perceived scroll speed
      y: -2,
      ease: 'power1.inOut',
    }, 0);

    tl.to(camera.rotation, {
      z: Math.PI / 4,
      x: Math.PI / 12,
      ease: 'power1.inOut',
    }, 0);

    return () => {
      tl.kill();
    };
  }, [camera]);

  useFrame(() => {
    if (groupRef.current) {
      // Add continuous slow rotation independent of scroll
      groupRef.current.rotation.y += 0.0003;
      groupRef.current.rotation.z += 0.0006;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Create a field of floating cinematic elements (like abstract monoliths or particles) */}
      {Array.from({ length: 50 }).map((_, i) => {
        const x = MathUtils.randFloatSpread(40);
        const y = MathUtils.randFloatSpread(40);
        const z = MathUtils.randFloatSpread(40) - 10; // Bias them deeper into the screen
        const scale = MathUtils.randFloat(0.5, 2);

        return (
          <mesh key={i} position={[x, y, z]} scale={scale} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#d8b4fe' : '#93c5fd'} 
              wireframe={Math.random() > 0.5} 
              transparent 
              opacity={0.3}
              emissive={i % 2 === 0 ? '#a855f7' : '#3b82f6'}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
