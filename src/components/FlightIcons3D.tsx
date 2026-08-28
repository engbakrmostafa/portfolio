import { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Float, Preload, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { SkillData } from '../App';

function FloatingIcon({ 
  url, 
  position, 
  floatSpeed, 
  rotationIntensity 
}: { 
  url: string; 
  position: [number, number, number]; 
  floatSpeed: number; 
  rotationIntensity: number; 
}) {
  // Use a fallback transparent texture if URL fails, but try to load first
  const texture = useLoader(THREE.TextureLoader, url);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <Float 
      speed={floatSpeed} 
      rotationIntensity={rotationIntensity} 
      floatIntensity={2} 
      position={position}
    >
      <Billboard>
        <mesh>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
        </mesh>
      </Billboard>
    </Float>
  );
}

export default function FlightIcons3D({ skills }: { skills: SkillData[] }) {
  // Only use skills that have an uploaded icon_image
  const validSkills = skills.filter((s) => s.icon_image);

  // Generate random positions for the initial scatter
  const iconProps = useMemo(() => {
    return validSkills.map((skill) => ({
      url: skill.icon_image as string,
      name: skill.name,
      // Random position in a spherical volume
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5 - 2, // Push slightly back so they don't clip near camera
      ] as [number, number, number],
      speed: 1 + Math.random() * 1.5,
      rotation: 0.5 + Math.random(),
    }));
  }, [validSkills]);

  if (validSkills.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0A0B0E] border border-white/5 rounded-3xl">
        <p className="text-white/30 text-sm uppercase tracking-widest font-semibold">
          Upload images in Admin to see 3D flight
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#050508] border border-white/5 rounded-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={1} />
        {iconProps.map((props, i) => (
          <FloatingIcon
            key={props.name + i}
            url={props.url}
            position={props.position}
            floatSpeed={props.speed}
            rotationIntensity={props.rotation}
          />
        ))}
        <Preload all />
      </Canvas>
      
      {/* Subtle overlay text just to give it depth, optional */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050508_100%)] z-10" />
    </div>
  );
}
