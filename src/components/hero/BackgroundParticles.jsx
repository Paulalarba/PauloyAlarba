import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial } from 'three';
import { seededRandom } from './sceneGeometry.js';

const vertexShader = `
  attribute float aSeed;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.12 + aSeed * 31.0) * 0.14;
    p.y += sin(uTime * 0.18 + aSeed * 24.0) * 0.16;
    p.z += cos(uTime * 0.1 + aSeed * 18.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((0.8 + aSeed * 1.5) * uDpr, 0.8, 3.0);
    vAlpha = (0.16 + aSeed * 0.6) * (0.65 + sin(uTime * 0.3 + aSeed * 36.0) * 0.25);
  }
`;
const fragmentShader = `
  varying float vAlpha;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    float alpha = (1.0 - smoothstep(0.05, 0.5, radius)) * vAlpha;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

export default function BackgroundParticles({ active, reduceMotion, compact }) {
  const elapsed = useRef(0);
  const dpr = useThree((state) => state.viewport.dpr);
  const geometry = useMemo(() => {
    const random = seededRandom(7839);
    const count = compact ? 1050 : 2400;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      const clustered = index < count * 0.58;
      const angle = random() * Math.PI * 2;
      const radius = 1.3 + random() * 1.5;
      positions.set(clustered
        ? [-0.55 + Math.cos(angle) * radius, 0.65 + Math.sin(angle) * radius * 0.9, -0.7 - random() * 0.5]
        : [(random() - 0.5) * 13.5, (random() - 0.5) * 5.2, -1 - random()], index * 3);
      seeds[index] = random();
    }
    const result = new BufferGeometry();
    result.setAttribute('position', new Float32BufferAttribute(positions, 3));
    result.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
    return result;
  }, [compact]);
  const material = useMemo(() => new ShaderMaterial({
    vertexShader, fragmentShader,
    uniforms: { uTime: { value: 0 }, uDpr: { value: 1 } },
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  }), []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => { material.uniforms.uDpr.value = Math.min(dpr, 1.5); }, [dpr, material]);

  useFrame((_, delta) => {
    if (!active || reduceMotion) return;
    elapsed.current += Math.min(delta, 0.05);
    material.uniforms.uTime.value = elapsed.current;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
