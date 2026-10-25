import { useEffect, useMemo } from 'react';
import { createHandGeometry } from './sceneGeometry.js';
import { createHandTexture } from './coinTexture.js';

export default function RoboticHand() {
  const geometry = useMemo(createHandGeometry, []);
  const texture = useMemo(createHandTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => () => {
    Object.values(geometry).forEach((item) => item.dispose());
  }, [geometry]);

  return (
    <group position={[0.15, 0.04, 0]}>
      <mesh geometry={geometry.solid}>
        <meshStandardMaterial color="#dce1e8" map={texture} emissive="#a5b0c1" emissiveMap={texture} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
      </mesh>
      <lineSegments geometry={geometry.wire}>
        <lineBasicMaterial color="#e7ebf1" transparent opacity={0.24} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={geometry.edges}>
        <lineBasicMaterial color="#f5f5f5" transparent opacity={0.78} />
      </lineSegments>
      <points geometry={geometry.particles}>
        <pointsMaterial color="#ffffff" size={0.02} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
}
