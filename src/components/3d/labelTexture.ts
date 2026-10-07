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

  const primaryColor = isActive ? '#ff1744' : isHovered ? '#38bdf8' : '#64748b';
  const bgColor = isActive
    ? 'rgba(40, 8, 16, 0.96)'
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
    ctx.fillStyle = isActive ? '#ff1744' : '#00e5ff';
    ctx.fillText('CLICK TO INTERACT ↵', 256, 68);

    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, 256, 118);
  } else {
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = isActive ? '#ff1744' : '#f8fafc';
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

  // Color theme: Red when orbit is selected, Cyan when in normal Hub
  const isRedMode = !isHubActive;

  ctx.fillStyle = isRedMode
    ? isHovered
      ? 'rgba(38, 8, 16, 0.97)'
      : 'rgba(26, 5, 11, 0.94)'
    : isHovered
    ? 'rgba(8, 14, 28, 0.96)'
    : 'rgba(5, 8, 17, 0.92)';
  ctx.fill();

  ctx.lineWidth = isHovered ? 5 : 3;
  ctx.strokeStyle = isRedMode
    ? isHovered
      ? '#ff1744'
      : 'rgba(255, 23, 68, 0.6)'
    : isHovered
    ? '#00e5ff'
    : 'rgba(0, 229, 255, 0.4)';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isHovered) {
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = isRedMode ? '#ff1744' : '#00e5ff';
    ctx.fillText(isHubActive ? 'CENTRAL HUB ACTIVE' : 'RETURN TO HUB ↵', 256, 74);
  }

  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PRITHVI', 256, isHovered ? 124 : 108);

  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = isRedMode ? 'rgba(255, 120, 140, 0.9)' : 'rgba(0, 229, 255, 0.85)';
  ctx.fillText(isRedMode ? 'ORBIT ACTIVE · ENGAGED' : 'SOFTWARE · AI · BUILD', 256, isHovered ? 176 : 165);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Floating 'Click to interact' badge texture
export function createInteractPromptTexture(
  text: string = 'CLICK TO INTERACT ↵',
  color: string = '#00e5ff'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 384, 96);

  // Draw pill shape
  const x = 16, y = 14, w = 352, h = 68, r = 34;
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

  ctx.fillStyle = 'rgba(3, 10, 22, 0.94)';
  ctx.fill();

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = color;
  ctx.stroke();

  // Glowing beacon dot
  ctx.beginPath();
  ctx.arc(52, 48, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Label text
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 72, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
