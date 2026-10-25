import { useEffect, useRef } from 'react';

const vertexSource = `#version 300 es
precision highp float;
in vec3 aWeb;
in vec3 aNetwork;
in vec3 aFrame;
in float aKind;
uniform float uMorph;
uniform float uAssemble;
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform float uDpr;
uniform vec2 uPointer;
out vec3 vColor;
out float vAlpha;
void main() {
  vec3 point = mix(mix(aWeb, aNetwork, uMorph), aFrame, uAssemble);
  float ambient = step(aKind, 0.25);
  point.z += sin(uTime * 0.55 + aKind * 18.0) * (0.065 + ambient * 0.055);
  vec2 offset = point.xy - uPointer * vec2(2.2, 1.65);
  float influence = exp(-dot(offset, offset) * 2.8) * (1.0 - uAssemble);
  point.xy += normalize(offset + vec2(0.001)) * influence * 0.27;
  point.z += influence * 0.3;
  float turn = 0.17 * sin(uTime * 0.32) + uPointer.x * 0.18 + uProgress * 0.37;
  float tilt = -0.09 + uPointer.y * 0.11 + uProgress * 0.12;
  point.xz = mat2(cos(turn), -sin(turn), sin(turn), cos(turn)) * point.xz;
  point.yz = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * point.yz;
  float depth = 4.8 / (4.8 - point.z);
  gl_Position = vec4(point.x * depth / (uAspect * 2.65), point.y * depth / 2.65, 0.0, 1.0);
  gl_PointSize = (ambient > 0.5 ? 2.0 : 3.4 + aKind * 2.0) * depth * uDpr;
  vColor = mix(vec3(0.30, 0.88, 0.88), vec3(0.69, 0.63, 1.0), uMorph * 0.85);
  vColor = mix(vColor, vec3(0.96, 0.99, 1.0), smoothstep(0.72, 1.0, aKind) * 0.45);
  vAlpha = ambient > 0.5 ? 0.42 : 0.65 + 0.35 * aKind;
}`;

const fragmentSource = `#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
out vec4 fragColor;
void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = (1.0 - smoothstep(0.12, 0.5, radius)) * vAlpha;
  fragColor = vec4(vColor, alpha);
}`;

function makeShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(error);
  }
  return shader;
}

function makePositions(count) {
  const web = new Float32Array(count * 3);
  const network = new Float32Array(count * 3);
  const frame = new Float32Array(count * 3);
  const kind = new Float32Array(count);
  let seed = 27431;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const index = i * 3;
    const ambient = i >= count * 0.76;
    kind[i] = ambient ? 0 : 0.45 + random() * 0.55;
    if (ambient) {
      const x = (random() - 0.5) * 7.3;
      const y = (random() - 0.5) * 5.3;
      const z = -1.8 + random() * 1.3;
      web.set([x, y, z], index);
      network.set([x, y, z], index);
      frame.set([x, y, z], index);
      continue;
    }

    // Layered interface planes for web; a toroidal network for blockchain.
    const layer = i % 3;
    const x = (random() - .5) * 3.75;
    const y = (random() - .5) * 2.8;
    web.set([x + layer * .10, y + layer * .10, (layer - 1) * .42], index);

    const theta = random() * Math.PI * 2;
    const phi = random() * Math.PI * 2;
    const radius = 1.63 + .42 * Math.cos(phi);
    network.set([radius * Math.cos(theta), radius * Math.sin(theta), .55 * Math.sin(phi)], index);

    const edge = i % 4;
    const along = random() * 2 - 1;
    frame.set([
      edge < 2 ? along * 2.05 : (edge === 2 ? -2.05 : 2.05),
      edge < 2 ? (edge === 0 ? 1.35 : -1.35) : along * 1.35,
      random() * .16,
    ], index);
  }
  return { web, network, frame, kind };
}

export default function ParticleScene({ mode, pointerRef, progressRef, onUnavailable }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) { onUnavailable(); return undefined; }

    let program;
    let vertex;
    let fragment;
    const buffers = [];
    try {
      vertex = makeShader(gl, gl.VERTEX_SHADER, vertexSource);
      fragment = makeShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (error) {
      console.warn('Particle scene unavailable:', error);
      onUnavailable();
      if (program) gl.deleteProgram(program);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return undefined;
    }

    const count = window.innerWidth < 700 ? 550 : 1250;
    const geometry = makePositions(count);
    gl.useProgram(program);
    for (const [name, data, size] of [
      ['aWeb', geometry.web, 3], ['aNetwork', geometry.network, 3],
      ['aFrame', geometry.frame, 3], ['aKind', geometry.kind, 1],
    ]) {
      const buffer = gl.createBuffer();
      buffers.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    const uniforms = Object.fromEntries(['uMorph', 'uAssemble', 'uTime', 'uProgress', 'uAspect', 'uDpr', 'uPointer']
      .map((name) => [name, gl.getUniformLocation(program, name)]));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let frameId = null;
    let running = false;
    let morph = modeRef.current === 'blockchain' ? 1 : 0;
    let lastTime = 0;
    let aspect = 1;
    let dpr = 1;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      aspect = bounds.width / Math.max(bounds.height, 1);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const render = (time) => {
      if (!running) return;
      const delta = Math.min(48, time - (lastTime || time));
      lastTime = time;
      morph += ((modeRef.current === 'blockchain' ? 1 : 0) - morph) * Math.min(1, delta * .006);
      const progress = progressRef.current;
      const assemble = Math.max(0, Math.min(1, (progress - .48) / .42));
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.uMorph, morph);
      gl.uniform1f(uniforms.uAssemble, assemble);
      gl.uniform1f(uniforms.uTime, time * .001);
      gl.uniform1f(uniforms.uProgress, progress);
      gl.uniform1f(uniforms.uAspect, aspect);
      gl.uniform1f(uniforms.uDpr, dpr);
      gl.uniform2f(uniforms.uPointer, pointerRef.current.x, pointerRef.current.y);
      gl.drawArrays(gl.POINTS, 0, count);
      frameId = window.requestAnimationFrame(render);
    };
    const start = () => {
      if (running || document.hidden) return;
      running = true;
      lastTime = 0;
      frameId = window.requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0 && canvas.getBoundingClientRect().top < window.innerHeight) start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    const resizer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    resize();
    resizer?.observe(canvas);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      resizer?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [pointerRef, progressRef]);

  return <canvas ref={canvasRef} className="signal-particle-canvas" aria-hidden="true" />;
}