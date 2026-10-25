import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide } from 'three';
import { createCoinTexture, createGlowTexture } from './coinTexture.js';

export default function BitcoinModel({ active, reduceMotion }) {
  const coin = useRef(null);
  const halo = useRef(null);
  const elapsed = useRef(0);
  const face = useMemo(createCoinTexture, []);
  const glow = useMemo(createGlowTexture, []);
  useEffect(() => () => glow.dispose(), [glow]);

  useEffect(() => () => face.dispose(), [face]);

  useFrame((_, delta) => {
    if (!active || reduceMotion || !coin.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const time = elapsed.current;
    coin.current.position.y = 1.2 + Math.sin(time * 0.8) * 0.1;
    coin.current.rotation.y = -0.2 + time * 0.045;
    if (halo.current) halo.current.material.opacity = 0.3 + Math.sin(time * 0.85) * 0.07;
  });

  return (
    <group ref={coin} position={[-0.55, 1.2, -0.1]} rotation={[0.04, -0.2, -0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.13, 1.13, 0.16, 96, 1]} />
        <meshStandardMaterial color="#7d8591" metalness={0.95} roughness={0.28} />
      </mesh>
      {[1, -1].map((side) => (
        <group key={side} position={[0, 0, side * 0.085]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
          <mesh>
            <circleGeometry args={[1.115, 96]} />
            <meshBasicMaterial map={face} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.006]}>
            <torusGeometry args={[1.115, 0.018, 6, 96]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <torusGeometry args={[0.925, 0.008, 4, 96]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}
      <mesh ref={halo} position={[0, 0, -0.1]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial color="#ffffff" map={glow} transparent opacity={0.3} side={DoubleSide} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
