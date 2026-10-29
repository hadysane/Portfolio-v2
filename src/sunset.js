import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, FogExp2,
  BufferGeometry, Float32BufferAttribute, PlaneGeometry,
  ShaderMaterial, MeshBasicMaterial, LineBasicMaterial, PointsMaterial,
  Mesh, Points, LineSegments, WireframeGeometry, DoubleSide, Vector2,
} from 'three';

// A single small scene, with no textures, postprocessing, or external assets.
export function createSunset(host, hero, { paused: initiallyPaused, onUnavailable, onReady }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    onUnavailable();
    return null;
  }

  const scene = new Scene();
  scene.fog = new FogExp2(0x100b18, 0.019);
  const camera = new PerspectiveCamera(43, 1, 0.1, 160);
  camera.position.set(0, 4.2, 13);
  camera.lookAt(0, 3.6, -35);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x100b18, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const vertex = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const sunMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      topColor: { value: new Color('#ffdd86') },
      middleColor: { value: new Color('#ff9864') },
      bottomColor: { value: new Color('#f8598d') },
    },
    vertexShader: vertex,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 topColor, middleColor, bottomColor;
      void main() {
        float d = length(vUv - 0.5);
        float edge = fwidth(d);
        float alpha = 1.0 - smoothstep(0.497 - edge, 0.5, d);
        float y = vUv.y;
        // The gaps get wider toward the bottom, like a 1980s print.
        if (y < .48) {
          float band = fract(y * 13.0);
          float gap = mix(.65, .12, y / .48);
          alpha *= smoothstep(gap, gap + fwidth(y) * 13.0, band);
        }
        vec3 col = y < .5 ? mix(bottomColor, middleColor, y * 2.0)
                            : mix(middleColor, topColor, (y - .5) * 2.0);
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const sun = new Mesh(new PlaneGeometry(25, 25), sunMaterial);
  sun.position.set(0, 10, -49);
  scene.add(sun);

  const glow = new Mesh(new PlaneGeometry(68, 68), new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { glowColor: { value: new Color('#f8598d') } },
    vertexShader: vertex,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 glowColor;
      void main() {
        float d = length(vUv - .5) * 2.0;
        float a = pow(max(0.0, 1.0 - d), 4.0) * .24;
        gl_FragColor = vec4(glowColor, a);
        #include <colorspace_fragment>
      }
    `,
  }));
  glow.position.set(0, 10, -50);
  scene.add(glow);

  const gridMaterial = new ShaderMaterial({
    transparent: true,
    side: DoubleSide,
    uniforms: {
      time: { value: 0 },
      gridColor: { value: new Color('#8270ba') },
      horizonColor: { value: new Color('#ec6aaf') },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorld;
      uniform float time;
      uniform vec3 gridColor, horizonColor;
      void main() {
        vec2 coord = vec2(vWorld.x, vWorld.z + time * .9) / 2.4;
        vec2 grid = abs(fract(coord - .5) - .5) / max(fwidth(coord), vec2(.001));
        float line = 1.0 - min(min(grid.x, grid.y), 1.0);
        float fade = 1.0 - smoothstep(12.0, 80.0, -vWorld.z);
        vec3 col = mix(gridColor, horizonColor, smoothstep(0.0, 55.0, -vWorld.z));
        gl_FragColor = vec4(col, line * fade * .48);
        #include <colorspace_fragment>
      }
    `,
  });
  const floor = new Mesh(new PlaneGeometry(220, 160), gridMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -.1, -55);
  scene.add(floor);

  // Deterministic mountains keep the same composition across visits.
  const columns = 60;
  const rows = 28;
  const positions = [];
  const indices = [];
  for (let row = 0; row <= rows; row++) {
    const z = 4 - row * 3;
    for (let col = 0; col <= columns; col++) {
      const x = (col - columns / 2) * 2;
      const ridge = Math.max(0, Math.min(1, (Math.abs(x) - 11) / 13));
      const wave = 2.6 + Math.sin(x * .38 + z * .23) * 1.6
        + Math.sin(x * .81 - z * .19) * .85;
      const y = ridge * wave * (1 + Math.max(0, -z) / 85) - .18;
      positions.push(x, y, z);
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const terrain = new BufferGeometry();
  terrain.setAttribute('position', new Float32BufferAttribute(positions, 3));
  terrain.setIndex(indices);
  const land = new Mesh(terrain, new MeshBasicMaterial({ color: '#100b18', side: DoubleSide }));
  const wires = new LineSegments(new WireframeGeometry(terrain), new LineBasicMaterial({
    color: '#8270ba', transparent: true, opacity: .13,
  }));
  wires.position.y = .015;
  scene.add(land, wires);

  let seed = 1986;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const stars = [];
  for (let i = 0; i < 220; i++) stars.push((random() - .5) * 150, 10 + random() * 65, -70 - random() * 30);
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute('position', new Float32BufferAttribute(stars, 3));
  scene.add(new Points(starGeometry, new PointsMaterial({
    color: '#fff3e5', size: .085, transparent: true, opacity: .5, fog: false,
  })));

  let paused = initiallyPaused;
  let visible = true;
  let lost = false;
  let disposed = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  const pointer = new Vector2();
  const current = new Vector2();
  const abort = new AbortController();
  const { signal } = abort;

  function useFallback() {
    lost = true;
    cancelAnimationFrame(frame);
    host.classList.remove('is-ready');
    onUnavailable();
  }
  renderer.debug.onShaderError = useFallback;

  function render(now = 0) {
    frame = 0;
    if (disposed || lost) return;
    if (!paused) {
      elapsed += previous ? Math.min((now - previous) / 1000, .05) : 0;
      current.lerp(pointer, .025);
    }
    previous = now;
    gridMaterial.uniforms.time.value = elapsed;
    camera.position.x = current.x * .45;
    camera.position.y = 4.2 + current.y * .16;
    camera.lookAt(0, 3.6, -35);
    try { renderer.render(scene, camera); }
    catch { useFallback(); }
    if (lost) return;
    host.classList.add('is-ready');
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(render);
  }

  function reconcile() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (!lost && !disposed && visible && !document.hidden) render(performance.now());
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    // Fit the full sun in narrow viewports without changing its vertical scale.
    sun.scale.setScalar(Math.min(1, camera.aspect / .85));
    renderer.setSize(width, height, false);
    camera.updateProjectionMatrix();
    reconcile();
  }

  hero.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
  }, { signal, passive: true });
  hero.addEventListener('pointerleave', () => pointer.set(0, 0), { signal });
  document.addEventListener('visibilitychange', reconcile, { signal });
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    useFallback();
  }, { signal });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    lost = false;
    resize();
    onReady();
  }, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    reconcile();
  });
  observer.observe(hero);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  if (!lost) onReady();

  return {
    setPaused(value) { paused = value; reconcile(); },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      abort.abort();
      observer.disconnect();
      resizeObserver.disconnect();
      scene.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      renderer.dispose();
      host.replaceChildren();
      host.classList.remove('is-ready');
    },
  };
}
