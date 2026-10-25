import {
  BoxGeometry, CapsuleGeometry, CylinderGeometry, EdgesGeometry, ExtrudeGeometry,
  Float32BufferAttribute, BufferGeometry, Matrix4, Quaternion, Shape, SphereGeometry,
  TorusGeometry, Vector3, WireframeGeometry,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function seededRandom(seed = 84371) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function createHandGeometry() {
  const parts = [];
  const up = new Vector3(0, 1, 0);
  const add = (geometry, position, quaternion = new Quaternion(), scale = [1, 1, 1]) => {
    geometry.applyMatrix4(new Matrix4().compose(new Vector3(...position), quaternion, new Vector3(...scale)));
    const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    parts.push(nonIndexed);
    geometry.dispose();
  };
  const rod = (start, end, radius, topRadius = radius) => {
    const a = new Vector3(...start);
    const b = new Vector3(...end);
    const direction = b.clone().sub(a);
    const quaternion = new Quaternion().setFromUnitVectors(up, direction.clone().normalize());
    add(new CylinderGeometry(topRadius, radius, direction.length(), 20, 10), a.add(b).multiplyScalar(0.5).toArray(), quaternion);
  };
  const joint = (position, radius) => {
    add(new SphereGeometry(radius, 12, 8), position, new Quaternion(), [1, 1, 0.85]);
    add(new TorusGeometry(radius * 1.03, 0.025, 5, 22), [position[0], position[1], position[2] + radius * 0.75]);
  };

  const palm = new Shape();
  palm.moveTo(1.75, -1.45);
  palm.lineTo(1.75, -0.72);
  palm.quadraticCurveTo(0.65, -0.25, -0.3, -0.62);
  palm.lineTo(-0.8, -1.16);
  palm.quadraticCurveTo(-0.12, -1.85, 1.15, -1.7);
  palm.closePath();
  add(new ExtrudeGeometry(palm, { depth: 0.34, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1, bevelSegments: 2, steps: 2 }), [0, 0, -0.12]);

  const fingers = [
    { radius: 0.15, points: [[0.0,-1.4,0.25],[-1.1,-1.35,0.5],[-1.65,-0.9,0.65],[-1.95,-0.4,0.7]] },
    { radius: 0.18, points: [[-0.12,-1.15,0.2],[-1.45,-0.95,0.48],[-2.05,-0.32,0.63],[-2.15,0.26,0.65]] },
    { radius: 0.19, points: [[-0.15,-0.88,0.05],[-1.45,-0.45,0.23],[-2.12,0.25,0.35],[-2.1,0.87,0.4]] },
    { radius: 0.17, points: [[0.1,-0.7,-0.13],[-0.85,-0.14,-0.1],[-1.3,0.52,-0.02],[-1.22,1.08,0.07]] },
    { radius: 0.22, points: [[1.35,-1.1,0.3],[0.9,-0.44,0.6],[0.27,-0.18,0.8],[-0.08,-0.45,0.9]] },
  ];
  for (const { radius, points } of fingers) {
    points.forEach((point, index) => joint(point, radius * (1.13 - index * 0.08)));
    for (let index = 0; index < points.length - 1; index++) {
      const a = new Vector3(...points[index]);
      const b = new Vector3(...points[index + 1]);
      const distance = a.distanceTo(b);
      const rotation = new Quaternion().setFromUnitVectors(up, b.clone().sub(a).normalize());
      const center = a.add(b).multiplyScalar(0.5).toArray();
      const thickness = radius * (1 - index * 0.14);
      add(new CapsuleGeometry(thickness, Math.max(0.06, distance - thickness * 2), 3, 10), center, rotation);
      add(new BoxGeometry(thickness * 1.1, distance * 0.5, thickness * 0.45, 2, 3, 1), [center[0], center[1], center[2] + thickness * 0.9], rotation);
    }
  }

  rod([1.55,-1.12,-0.03], [6.9,-2.12,-0.23], 0.68, 0.4);
  const forearmDirection = new Vector3(5.35, -1, -0.2).normalize();
  const ringRotation = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), forearmDirection);
  for (let index = 0; index < 15; index++) {
    const t = index / 14;
    add(new TorusGeometry(0.42 + t * 0.26, 0.025, 5, 28), [1.65 + t * 5.25, -1.14 - t, -0.03 - t * 0.2], ringRotation);
  }
  for (let index = 0; index < 5; index++) {
    const z = -0.1 + index * 0.13;
    rod([1.5,-0.84,z], [6.8,-1.63,z - 0.2], 0.026);
  }
  joint([1.65,-1.12,0.16], 0.48);
  for (let index = 0; index < 4; index++) {
    const y = -0.8 - index * 0.17;
    rod([1.5,y,0.43], [0.05,y - 0.26,0.42], 0.027);
  }

  const solid = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  solid.computeVertexNormals();
  const edges = new EdgesGeometry(solid, 28);
  const wire = new WireframeGeometry(solid);
  const random = seededRandom(7182);
  const source = solid.getAttribute('position');
  const dust = new Float32Array(7200 * 3);
  for (let index = 0; index < dust.length / 3; index++) {
    const triangle = Math.floor(random() * (source.count / 3)) * 3;
    let u = random();
    let v = random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    for (let axis = 0; axis < 3; axis++) {
      const a = source.array[triangle * 3 + axis];
      const b = source.array[(triangle + 1) * 3 + axis];
      const c = source.array[(triangle + 2) * 3 + axis];
      dust[index * 3 + axis] = a + u * (b - a) + v * (c - a);
    }
  }
  const particles = new BufferGeometry();
  particles.setAttribute('position', new Float32BufferAttribute(dust, 3));
  return { solid, edges, wire, particles };
}
