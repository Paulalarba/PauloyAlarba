import { CanvasTexture, SRGBColorSpace } from 'three';
import { seededRandom } from './sceneGeometry.js';

export function createCoinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is unavailable.');
  const random = seededRandom(2846);
  const center = 512;
  context.fillStyle = '#050608';
  context.fillRect(0, 0, 1024, 1024);
  context.strokeStyle = '#e9edf2';
  for (const radius of [496, 486, 472, 452, 435, 420, 398, 378]) {
    context.lineWidth = radius > 450 ? 3 : 1.5;
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.stroke();
  }
  for (let index = 0; index < 100; index++) {
    const angle = index * Math.PI * 2 / 100;
    const inner = index % 5 === 0 ? 449 : 465;
    context.lineWidth = index % 5 === 0 ? 4 : 2;
    context.beginPath();
    context.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner);
    context.lineTo(center + Math.cos(angle) * 480, center + Math.sin(angle) * 480);
    context.stroke();
  }
  context.strokeStyle = '#a9b2bf';
  context.lineWidth = 2;
  for (let index = 0; index < 100; index++) {
    const angle = random() * Math.PI * 2;
    const radius = 285 + random() * 95;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * 32, y + Math.sin(angle) * 32);
    context.lineTo(x + Math.cos(angle) * 32 + (index % 2 ? 20 : -20), y + Math.sin(angle) * 32);
    context.stroke();
    context.fillStyle = '#eff3f8';
    context.fillRect(x - 2, y - 2, 4, 4);
  }
  context.fillStyle = '#07080a';
  context.beginPath();
  context.arc(center, center, 280, 0, Math.PI * 2);
  context.fill();
  context.font = 'bold 570px "Segoe UI Symbol", Arial, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineWidth = 4;
  context.strokeStyle = '#ffffff';
  context.shadowBlur = 13;
  context.shadowColor = '#ffffff';
  context.strokeText('₿', 510, 541);
  context.shadowBlur = 0;
  context.fillStyle = '#dbe0e8';
  context.fillText('₿', 510, 541);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createHandTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is unavailable.');
  const random = seededRandom(9183);
  context.fillStyle = '#08090b';
  context.fillRect(0, 0, 512, 512);
  context.lineWidth = 0.8;
  for (let index = 0; index < 220; index++) {
    const x = Math.floor(random() * 32) * 16;
    const y = Math.floor(random() * 32) * 16;
    const length = 8 + Math.floor(random() * 4) * 8;
    context.strokeStyle = index % 4 === 0 ? '#eef2f7' : '#727c8b';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length, y);
    context.lineTo(x + length + 8, y - 8);
    context.lineTo(x + length + 8, y - 16 - random() * 24);
    context.stroke();
    context.strokeRect(x - 1.5, y - 1.5, 3, 3);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is unavailable.');
  const gradient = context.createRadialGradient(64, 64, 20, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,0.75)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.28)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}
