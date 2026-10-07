import * as THREE from 'three';

export function createZoneLabelTexture(
  title: string,
  isActive: boolean,
  isHovered: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 192);

  const primaryColor = isActive ? '#00e5ff' : isHovered ? '#38bdf8' : '#64748b';
  const bgColor = isActive
    ? 'rgba(3, 21, 37, 0.95)'
    : isHovered
    ? 'rgba(8, 20, 36, 0.95)'
    : 'rgba(6, 11, 20, 0.9)';

  // Draw rounded card
  const x = 24, y = 24, w = 464, h = 144, r = 16;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = bgColor;
  ctx.fill();

  ctx.lineWidth = isHovered || isActive ? 5 : 2;
  ctx.strokeStyle = primaryColor;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isHovered) {
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('CLICK TO INTERACT ↵', 256, 68);

    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, 256, 118);
  } else {
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = isActive ? '#00e5ff' : '#f8fafc';
    ctx.fillText(title, 256, 96);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function createCoreLabelTexture(
  isHubActive: boolean,
  isHovered: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 256);

  const x = 24, y = 24, w = 464, h = 208, r = 20;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = isHovered
    ? 'rgba(8, 14, 28, 0.96)'
    : 'rgba(5, 8, 17, 0.92)';
  ctx.fill();

  ctx.lineWidth = isHovered ? 5 : 3;
  ctx.strokeStyle = isHovered ? '#00e5ff' : 'rgba(0, 229, 255, 0.4)';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isHovered) {
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText(isHubActive ? 'CENTRAL HUB ACTIVE' : 'CLICK TO FOCUS HUB ↵', 256, 74);
  }

  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PRITHVI', 256, isHovered ? 124 : 108);

  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
  ctx.fillText('SOFTWARE · AI · BUILD', 256, isHovered ? 176 : 165);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
