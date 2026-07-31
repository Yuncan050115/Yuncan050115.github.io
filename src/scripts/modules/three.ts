/**
 * Three.js 呼吸场景：粒子星云 + 鼠标视差（动态 import three）
 */

import { isMobile } from '../core/env';

export const initThree = async () => {
  if (window.__yuncanThree) return;
  const canvas = document.querySelector<HTMLCanvasElement>('#breath-scene');
  if (!canvas) return;
  window.__yuncanThree = true;

  const THREE = await import('three');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;

  const isDark = () => document.documentElement.dataset.theme === 'dark';

  // 光标排斥状态：由 initCursor 的 mousemove 回调写入，夜间模式下驱动粒子避开光标
  const particleState = { mouseX: 0, mouseY: 0 };
  window.__yuncanParticles = particleState;

  // 粒子数量：桌面端 320，移动端降到 120 保证流畅
  const COUNT = isMobile() ? 120 : 320;
  const WORLD_H = 14;
  const origins = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const speeds = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const colorWarm = new Float32Array(COUNT * 3);
  const colorCool = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i += 1) {
    origins[i * 3] = (Math.random() - 0.5) * 20;
    origins[i * 3 + 1] = (Math.random() - 0.5) * WORLD_H;
    origins[i * 3 + 2] = (Math.random() - 0.5) * 6;
    sizes[i] = Math.random() * 0.7 + 0.25;
    speeds[i] = Math.random() * 0.35 + 0.12;
    phases[i] = Math.random() * Math.PI * 2;

    // 白天：暖色与冷色混合，避免全黄
    const wr = Math.random();
    if (wr < 0.3) { colorWarm[i * 3] = 1.0; colorWarm[i * 3 + 1] = 0.78; colorWarm[i * 3 + 2] = 0.32; }
    else if (wr < 0.5) { colorWarm[i * 3] = 1.0; colorWarm[i * 3 + 1] = 0.92; colorWarm[i * 3 + 2] = 0.55; }
    else if (wr < 0.75) { colorWarm[i * 3] = 0.9; colorWarm[i * 3 + 1] = 0.95; colorWarm[i * 3 + 2] = 1.0; }
    else { colorWarm[i * 3] = 0.6; colorWarm[i * 3 + 1] = 0.8; colorWarm[i * 3 + 2] = 1.0; }

    // 夜间：蓝色、紫色、白色
    const cr = Math.random();
    if (cr < 0.4) { colorCool[i * 3] = 0.4; colorCool[i * 3 + 1] = 0.62; colorCool[i * 3 + 2] = 1.0; }
    else if (cr < 0.7) { colorCool[i * 3] = 0.62; colorCool[i * 3 + 1] = 0.42; colorCool[i * 3 + 2] = 1.0; }
    else { colorCool[i * 3] = 0.95; colorCool[i * 3 + 1] = 0.95; colorCool[i * 3 + 2] = 1.0; }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(origins, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aColorWarm', new THREE.BufferAttribute(colorWarm, 3));
  geometry.setAttribute('aColorCool', new THREE.BufferAttribute(colorCool, 3));

  const uniforms = {
    uTime: { value: 0 },
    uDark: { value: isDark() ? 1 : 0 },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uWorldH: { value: WORLD_H },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };

  // 所有逐粒子计算（上升、漂浮、闪烁）都在 GPU 顶点着色器完成，CPU 仅更新时间
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      attribute float aSize;
      attribute float aSpeed;
      attribute float aPhase;
      attribute vec3 aColorWarm;
      attribute vec3 aColorCool;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;
      uniform float uDark;
      uniform float uPixelRatio;
      uniform float uWorldH;
      uniform vec2 uMouse;
      void main() {
        // 白天气泡快速上升，夜间星星缓慢漂浮
        float rise = mod(position.y + uTime * aSpeed * mix(1.0, 0.15, uDark) + uWorldH * 0.5, uWorldH) - uWorldH * 0.5;
        vec3 pos = vec3(
          position.x + sin(uTime * 0.3 + aPhase) * 0.5,
          rise,
          position.z + cos(uTime * 0.18 + aPhase) * 0.3
        );
        // 光标排斥：夜间模式下粒子避开鼠标位置
        vec2 toMouse = pos.xy - uMouse;
        float dist = max(length(toMouse), 0.001);
        float repel = 1.0 - smoothstep(0.0, 3.0, dist);
        pos.xy += (toMouse / dist) * repel * 0.9;
        // 颜色：白天暖色 / 夜间冷色
        vColor = mix(aColorWarm, aColorCool, uDark);
        // 闪烁：白天温和呼吸，夜间明显闪烁
        float twinkle = 0.55 + 0.45 * sin(uTime * 2.2 + aPhase * 3.5);
        vTwinkle = mix(0.75 + 0.15 * sin(uTime * 0.8 + aPhase), twinkle, uDark);
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z) * (0.7 + 0.3 * twinkle);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float dist = length(p);
        if (dist > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, dist);
        float core = smoothstep(0.16, 0.0, dist);
        vec3 color = vColor * (glow * 0.8 + core * 1.0);
        float alpha = (glow * 0.85 + core * 0.5) * vTwinkle;
        gl_FragColor = vec4(color, alpha);
      }
    `
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  // 流星（仅夜间），用 LineSegments 表示拖尾
  const MAX_METEORS = 3;
  type Meteor = { active: boolean; x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
  const meteorState: Meteor[] = [];
  for (let i = 0; i < MAX_METEORS; i += 1) {
    meteorState.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0 });
  }
  const meteorPositions = new Float32Array(MAX_METEORS * 2 * 3);
  const meteorGeom = new THREE.BufferGeometry();
  meteorGeom.setAttribute('position', new THREE.BufferAttribute(meteorPositions, 3));
  const meteorMat = new THREE.LineBasicMaterial({ color: 0xb0c8ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const meteorLines = new THREE.LineSegments(meteorGeom, meteorMat);
  meteorLines.frustumCulled = false;
  scene.add(meteorLines);

  let viewW = 10;
  let viewH = 8;
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    viewH = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
    viewW = viewH * camera.aspect;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let rafId: number | null = null;
  const startAnimation = () => {
    if (rafId === null && isDark()) {
      rafId = requestAnimationFrame(animate);
    }
  };
  new MutationObserver(() => {
    uniforms.uDark.value = isDark() ? 1 : 0;
    startAnimation();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const startTime = performance.now();
  let lastFrame = startTime;
  let nextMeteorTime = 2 + Math.random() * 3;

  const spawnMeteor = (m: Meteor) => {
    m.active = true;
    m.x = (Math.random() - 0.2) * viewW * 0.8;
    m.y = viewH * 0.4 + Math.random() * 2;
    const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    const speed = 12 + Math.random() * 8;
    m.vx = Math.cos(angle) * speed;
    m.vy = Math.sin(angle) * speed;
    m.maxLife = 1.2 + Math.random() * 0.8;
    m.life = m.maxLife;
  };

  // requestAnimationFrame 自适应调度，使用真实 delta time，FPS 节流约 36fps 减少 GPU 压力
  const TARGET_INTERVAL = 1000 / 36; // 约 27.8ms
  let lastFrameTime = 0;
  const animate = (time: number) => {
    // 白天模式停止 rAF 循环，由 MutationObserver 在切回夜间时重启
    if (!isDark()) {
      rafId = null;
      return;
    }
    const delta = time - lastFrameTime;
    if (delta < TARGET_INTERVAL) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = time - (delta % TARGET_INTERVAL);

    const now = performance.now();
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    const t = (now - startTime) / 1000;
    uniforms.uTime.value = t;
    // 更新光标位置（夜间模式下驱动粒子排斥），归一化坐标映射到可视世界范围
    uniforms.uMouse.value.set(particleState.mouseX * viewW * 0.5, particleState.mouseY * viewH * 0.5);

    const dark = isDark();
    meteorMat.opacity = dark ? 0.85 : 0;
    if (dark && t > nextMeteorTime) {
      nextMeteorTime = t + 2.5 + Math.random() * 4;
      const free = meteorState.find((m) => !m.active);
      if (free) spawnMeteor(free);
    }

    for (let i = 0; i < MAX_METEORS; i += 1) {
      const m = meteorState[i];
      if (m.active) {
        m.life -= dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.life <= 0) m.active = false;
      }
      const base = i * 6;
      if (m.active) {
        const trailLen = 1.5;
        const speedInv = 1 / Math.hypot(m.vx, m.vy);
        meteorPositions[base] = m.x;
        meteorPositions[base + 1] = m.y;
        meteorPositions[base + 2] = 0;
        meteorPositions[base + 3] = m.x - m.vx * speedInv * trailLen;
        meteorPositions[base + 4] = m.y - m.vy * speedInv * trailLen;
        meteorPositions[base + 5] = 0;
      } else {
        meteorPositions[base] = 0;
        meteorPositions[base + 1] = 0;
        meteorPositions[base + 2] = 0;
        meteorPositions[base + 3] = 0;
        meteorPositions[base + 4] = 0;
        meteorPositions[base + 5] = 0;
      }
    }
    meteorGeom.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };
  startAnimation();
};
