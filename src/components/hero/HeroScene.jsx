import { Component, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import BitcoinModel from './BitcoinModel.jsx';
import BackgroundParticles from './BackgroundParticles.jsx';
import RoboticHand from './RoboticHand.jsx';
import HeroSceneFallback from './HeroSceneFallback.jsx';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <HeroSceneFallback /> : this.props.children; }
}

function SceneComposition({ active, reduceMotion, pointerRef, compact }) {
  const group = useRef(null);
  const viewport = useThree((state) => state.viewport);
  const scale = Math.min(viewport.width / (compact ? 9.5 : 14.5), viewport.height / 5.8);

  useFrame((_, delta) => {
    if (!active || reduceMotion || !group.current) return;
    const dt = Math.min(delta, 0.05);
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, pointerRef.current.x * 0.1, 4, dt);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -pointerRef.current.y * 0.055, 4, dt);
    group.current.position.x = MathUtils.damp(group.current.position.x, pointerRef.current.x * scale * 0.12, 4, dt);
  });

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-3, 4, 6]} intensity={3.5} color="#ffffff" />
      <directionalLight position={[4, -1, 3]} intensity={1.8} color="#dbe4f2" />
      <group ref={group} scale={scale}>
        <BackgroundParticles active={active} reduceMotion={reduceMotion} compact={compact} />
        <RoboticHand />
        <BitcoinModel active={active} reduceMotion={reduceMotion} />
      </group>
    </>
  );
}

export default function HeroScene({ active, reduceMotion, pointerRef }) {
  const [lostContext, setLostContext] = useState(false);
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const cleanupContext = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setCompact(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => () => cleanupContext.current?.(), []);

  if (lostContext) return <HeroSceneFallback />;

  return (
    <SceneBoundary>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 35, near: 0.1, far: 60 }}
        dpr={compact ? [1, 1.25] : [1, 1.5]}
        frameloop={active && !reduceMotion ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}
        fallback={<HeroSceneFallback />}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const onLost = (event) => { event.preventDefault(); setLostContext(true); };
          canvas.addEventListener('webglcontextlost', onLost);
          cleanupContext.current = () => canvas.removeEventListener('webglcontextlost', onLost);
          gl.setClearColor('#000000', 0);
        }}
      >
        <SceneComposition active={active} reduceMotion={reduceMotion} pointerRef={pointerRef} compact={compact} />
      </Canvas>
    </SceneBoundary>
  );
}
