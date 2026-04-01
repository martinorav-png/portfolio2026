/**
 * Ball pit hero background - adapted from Kevin Levron / soju22 pattern
 * (RoomEnvironment + MeshPhysicalMaterial + instanced spheres).
 */
import { useEffect, useRef } from 'react';
import {
  Vector3,
  MeshPhysicalMaterial,
  InstancedMesh,
  Clock,
  AmbientLight,
  SphereGeometry,
  ShaderChunk,
  Scene,
  Color,
  Object3D,
  SRGBColorSpace,
  MathUtils,
  PMREMGenerator,
  Vector2,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  ACESFilmicToneMapping,
  Plane,
  Raycaster,
  type WebGLRendererParameters,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Site palette as hex integers (purple → cyan → amber). */
export const BALLPIT_SITE_COLORS_HEX = [
  0xd6bcfa, 0xb794f6, 0x7c3aed, 0x99f6e4, 0x5eead4, 0x06b6d4, 0xfde68a, 0xfbbf24, 0xf59e0b, 0xe5e5e5,
] as const;

export type BallpitProps = {
  className?: string;
  followCursor?: boolean;
  count?: number;
  colors?: readonly number[] | string[];
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  maxVelocity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  materialParams?: ConstructorParameters<typeof MeshPhysicalMaterial>[0];
};

type MiniThreeOptions = {
  canvas: HTMLCanvasElement;
  size?: 'parent' | { width: number; height: number };
  rendererOptions?: WebGLRendererParameters;
};

type TimeState = { elapsed: number; delta: number };

class MiniThreeApp {
  #opts: MiniThreeOptions;
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene: Scene;
  renderer: WebGLRenderer;
  #post: { render: () => void; dispose?: () => void } | null = null;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render: () => void;
  onBeforeRender: (t: TimeState) => void = () => {};
  onAfterRender: (t: TimeState) => void = () => {};
  onAfterResize: (s: typeof this.size) => void = () => {};
  #running = false;
  isDisposed = false;
  #resizeDebounce: ReturnType<typeof setTimeout> | null = null;
  #resizeObs: ResizeObserver | null = null;
  #clock = new Clock();
  #time: TimeState = { elapsed: 0, delta: 0 };
  #raf = 0;

  /** Window resize only - debounced. Parent size uses ResizeObserver (immediate). */
  #onWindowResize = () => {
    if (this.#resizeDebounce) clearTimeout(this.#resizeDebounce);
    this.#resizeDebounce = setTimeout(() => this.resize(), 100);
  };

  #onParentResize = () => {
    this.resize();
  };

  #onVisibility = () => {
    document.hidden ? this.#stopLoop() : this.#startLoop();
  };

  constructor(opts: MiniThreeOptions) {
    this.#opts = { ...opts };
    this.render = this.#defaultRender;
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
    this.scene = new Scene();
    this.canvas = opts.canvas;
    this.canvas.style.display = 'block';
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(opts.rendererOptions ?? {}),
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.#bindObservers();
    this.resize();
    this.#startLoop();
    requestAnimationFrame(() => this.resize());
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.resize());
    });
  }

  #bindObservers() {
    if (!(this.#opts.size instanceof Object)) {
      window.addEventListener('resize', this.#onWindowResize);
      if (this.#opts.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObs = new ResizeObserver(this.#onParentResize);
        this.#resizeObs.observe(this.canvas.parentNode as Element);
      }
    }
    document.addEventListener('visibilitychange', this.#onVisibility);
  }

  #unbindObservers() {
    window.removeEventListener('resize', this.#onWindowResize);
    this.#resizeObs?.disconnect();
    document.removeEventListener('visibilitychange', this.#onVisibility);
  }

  resize() {
    let w: number;
    let h: number;
    if (this.#opts.size instanceof Object) {
      w = this.#opts.size.width;
      h = this.#opts.size.height;
    } else if (this.#opts.size === 'parent' && this.canvas.parentNode) {
      const el = this.canvas.parentNode as HTMLElement;
      const r = el.getBoundingClientRect();
      w = Math.round(r.width) || el.clientWidth || el.offsetWidth || 0;
      h = Math.round(r.height) || el.clientHeight || el.offsetHeight || 0;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    if (w < 2 || h < 2) {
      w = Math.max(2, window.innerWidth);
      h = Math.max(2, window.innerHeight);
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.#updateCameraAspect();
    this.#updateRendererSize();
    this.onAfterResize(this.size);
  }

  #updateCameraAspect() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#applyAspectFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#applyAspectFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #applyAspectFov(targetAspect: number) {
    const t =
      Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(t));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const vFOV = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  #updateRendererSize() {
    this.renderer.setSize(this.size.width, this.size.height);
    let pr = window.devicePixelRatio;
    if (this.maxPixelRatio && pr > this.maxPixelRatio) pr = this.maxPixelRatio;
    else if (this.minPixelRatio && pr < this.minPixelRatio) pr = this.minPixelRatio;
    this.renderer.setPixelRatio(pr);
    this.size.pixelRatio = pr;
  }

  get postprocessing() {
    return this.#post;
  }

  set postprocessing(pp: MiniThreeApp['#post']) {
    this.#post = pp;
    if (pp) this.render = () => pp.render();
    else this.render = this.#defaultRender;
  }

  #startLoop() {
    if (this.#running) return;
    const tick = () => {
      this.#raf = requestAnimationFrame(tick);
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#running = true;
    this.#clock.start();
    tick();
  }

  #stopLoop() {
    if (this.#running) {
      cancelAnimationFrame(this.#raf);
      this.#running = false;
      this.#clock.stop();
    }
  }

  #defaultRender() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((obj) => {
      const mesh = obj as InstancedMesh & { isMesh?: boolean; material?: unknown; geometry?: unknown };
      if (mesh.isMesh && mesh.material && typeof mesh.material === 'object') {
        const mat = mesh.material as Record<string, unknown> & { dispose: () => void };
        Object.keys(mat).forEach((k) => {
          const v = mat[k];
          if (v && typeof v === 'object' && 'dispose' in v && typeof (v as { dispose: () => void }).dispose === 'function') {
            (v as { dispose: () => void }).dispose();
          }
        });
        mat.dispose();
      }
      if (mesh.geometry && typeof (mesh.geometry as { dispose?: () => void }).dispose === 'function') {
        (mesh.geometry as { dispose: () => void }).dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#unbindObservers();
    this.#stopLoop();
    this.clear();
    this.#post?.dispose?.();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }
}

/* -- pointer bridge (document-level) -- */

const registry = new Map<HTMLElement, InteractionState>();
const pointerDoc = new Vector2();
let registryActive = false;

type InteractionState = {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (s: InteractionState) => void;
  onMove: (s: InteractionState) => void;
  onClick: (s: InteractionState) => void;
  onLeave: (s: InteractionState) => void;
  dispose?: () => void;
};

function registerInteraction(domElement: HTMLElement, state: InteractionState) {
  if (!registry.has(domElement)) {
    registry.set(domElement, state);
    if (!registryActive) {
      document.body.addEventListener('pointermove', onPointerMove);
      document.body.addEventListener('pointerleave', onPointerLeave);
      document.body.addEventListener('click', onClick);
      document.body.addEventListener('touchstart', onTouchStart, { passive: false });
      document.body.addEventListener('touchmove', onTouchMove, { passive: false });
      document.body.addEventListener('touchend', onTouchEnd);
      document.body.addEventListener('touchcancel', onTouchEnd);
      registryActive = true;
    }
  }
  state.dispose = () => {
    registry.delete(domElement);
    if (registry.size === 0) {
      document.body.removeEventListener('pointermove', onPointerMove);
      document.body.removeEventListener('pointerleave', onPointerLeave);
      document.body.removeEventListener('click', onClick);
      document.body.removeEventListener('touchstart', onTouchStart);
      document.body.removeEventListener('touchmove', onTouchMove);
      document.body.removeEventListener('touchend', onTouchEnd);
      document.body.removeEventListener('touchcancel', onTouchEnd);
      registryActive = false;
    }
  };
  return state;
}

function onPointerMove(e: PointerEvent) {
  pointerDoc.set(e.clientX, e.clientY);
  processInteraction();
}

function processInteraction() {
  for (const [elem, st] of registry) {
    const rect = elem.getBoundingClientRect();
    if (hitRect(rect)) {
      setLocalPointer(st, rect);
      if (!st.hover) {
        st.hover = true;
        st.onEnter(st);
      }
      st.onMove(st);
    } else if (st.hover && !st.touching) {
      st.hover = false;
      st.onLeave(st);
    }
  }
}

function onClick(e: MouseEvent) {
  pointerDoc.set(e.clientX, e.clientY);
  for (const [elem, st] of registry) {
    const rect = elem.getBoundingClientRect();
    setLocalPointer(st, rect);
    if (hitRect(rect)) st.onClick(st);
  }
}

function onPointerLeave() {
  for (const st of registry.values()) {
    if (st.hover) {
      st.hover = false;
      st.onLeave(st);
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    pointerDoc.set(e.touches[0]!.clientX, e.touches[0]!.clientY);
    for (const [elem, st] of registry) {
      const rect = elem.getBoundingClientRect();
      if (hitRect(rect)) {
        st.touching = true;
        setLocalPointer(st, rect);
        if (!st.hover) {
          st.hover = true;
          st.onEnter(st);
        }
        st.onMove(st);
      }
    }
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    pointerDoc.set(e.touches[0]!.clientX, e.touches[0]!.clientY);
    for (const [elem, st] of registry) {
      const rect = elem.getBoundingClientRect();
      setLocalPointer(st, rect);
      if (hitRect(rect)) {
        if (!st.hover) {
          st.hover = true;
          st.touching = true;
          st.onEnter(st);
        }
        st.onMove(st);
      } else if (st.hover && st.touching) {
        st.onMove(st);
      }
    }
  }
}

function onTouchEnd() {
  for (const st of registry.values()) {
    if (st.touching) {
      st.touching = false;
      if (st.hover) {
        st.hover = false;
        st.onLeave(st);
      }
    }
  }
}

function setLocalPointer(st: InteractionState, rect: DOMRect) {
  st.position.set(pointerDoc.x - rect.left, pointerDoc.y - rect.top);
  st.nPosition.set((st.position.x / rect.width) * 2 - 1, (-st.position.y / rect.height) * 2 + 1);
}

function hitRect(rect: DOMRect) {
  const { x, y } = pointerDoc;
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

/* -- physics -- */

const { randFloat, randFloatSpread } = MathUtils;
const _p = new Vector3();
const _v = new Vector3();
const _o = new Vector3();
const _ov = new Vector3();
const _delta = new Vector3();
const _push = new Vector3();
const _impA = new Vector3();
const _impB = new Vector3();

type PhysicsConfig = {
  count: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  minSize: number;
  maxSize: number;
  size0: number;
  controlSphere0: boolean;
};

class BallPhysics {
  config: PhysicsConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new Vector3();

  constructor(config: PhysicsConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.#scatterPositions();
    this.setSizes();
  }

  #scatterPositions() {
    const { config, positionData: pos } = this;
    this.center.toArray(pos, 0);
    for (let i = 1; i < config.count; i++) {
      const b = 3 * i;
      pos[b] = randFloatSpread(2 * config.maxX);
      pos[b + 1] = randFloatSpread(2 * config.maxY);
      pos[b + 2] = randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(dt: { delta: number }) {
    const { config, center, positionData: pos, sizeData: sizes, velocityData: vel } = this;
    let start = 0;
    if (config.controlSphere0) {
      start = 1;
      _p.fromArray(pos, 0);
      _p.lerp(center, 0.1).toArray(pos, 0);
      new Vector3(0, 0, 0).toArray(vel, 0);
    }
    for (let idx = start; idx < config.count; idx++) {
      const base = 3 * idx;
      _p.fromArray(pos, base);
      _v.fromArray(vel, base);
      _v.y -= dt.delta * config.gravity * sizes[idx]!;
      _v.multiplyScalar(config.friction);
      _v.clampLength(0, config.maxVelocity);
      _p.add(_v);
      _p.toArray(pos, base);
      _v.toArray(vel, base);
    }
    for (let idx = start; idx < config.count; idx++) {
      const base = 3 * idx;
      _p.fromArray(pos, base);
      _v.fromArray(vel, base);
      const radius = sizes[idx]!;
      for (let j = idx + 1; j < config.count; j++) {
        const ob = 3 * j;
        _o.fromArray(pos, ob);
        _ov.fromArray(vel, ob);
        const or = sizes[j]!;
        _delta.copy(_o).sub(_p);
        const dist = _delta.length();
        const sumR = radius + or;
        if (dist < sumR && dist > 1e-6) {
          const overlap = sumR - dist;
          _push.copy(_delta).normalize().multiplyScalar(0.5 * overlap);
          _impA.copy(_push).multiplyScalar(Math.max(_v.length(), 1));
          _impB.copy(_push).multiplyScalar(Math.max(_ov.length(), 1));
          _p.sub(_push);
          _v.sub(_impA);
          _p.toArray(pos, base);
          _v.toArray(vel, base);
          _o.add(_push);
          _ov.add(_impB);
          _o.toArray(pos, ob);
          _ov.toArray(vel, ob);
        }
      }
      if (config.controlSphere0) {
        _p.fromArray(pos, base);
        _v.fromArray(vel, base);
        _o.fromArray(pos, 0);
        _delta.copy(_o).sub(_p);
        const dist = _delta.length();
        const sumR0 = radius + sizes[0]!;
        if (dist < sumR0 && dist > 1e-6) {
          const diff = sumR0 - dist;
          _push.copy(_delta).normalize().multiplyScalar(diff);
          _impA.copy(_push).multiplyScalar(Math.max(_v.length(), 2));
          _p.sub(_push);
          _v.sub(_impA);
        }
      }
      if (Math.abs(_p.x) + radius > config.maxX) {
        _p.x = Math.sign(_p.x) * (config.maxX - radius);
        _v.x = -_v.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(_p.y) + radius > config.maxY) {
          _p.y = Math.sign(_p.y) * (config.maxY - radius);
          _v.y = -_v.y * config.wallBounce;
        }
      } else if (_p.y - radius < -config.maxY) {
        _p.y = -config.maxY + radius;
        _v.y = -_v.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(_p.z) + radius > maxBoundary) {
        _p.z = Math.sign(_p.z) * (config.maxZ - radius);
        _v.z = -_v.z * config.wallBounce;
      }
      _p.toArray(pos, base);
      _v.toArray(vel, base);
    }
  }
}

/* -- scattering PBR material -- */

class ScatteringPhysicalMaterial extends MeshPhysicalMaterial {
  uniforms: Record<string, { value: number }>;
  onBeforeCompile2?: (params: { fragmentShader: string; uniforms: Record<string, unknown> }) => void;

  constructor(params: ConstructorParameters<typeof MeshPhysicalMaterial>[0]) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines.USE_UV = '';
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {`,
      );
      const lightsBegin = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `,
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lightsBegin);
      this.onBeforeCompile2?.(shader);
    };
  }
}

const DEFAULT_BALLPIT = {
  count: 200,
  colors: [...BALLPIT_SITE_COLORS_HEX] as number[],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
} as const;

const _dummy = new Object3D();

type BallpitGroupConfig = typeof DEFAULT_BALLPIT & PhysicsConfig;

class BallpitInstancedGroup extends InstancedMesh {
  config: BallpitGroupConfig;
  physics: BallPhysics;
  ambientLight: AmbientLight;
  light: PointLight;

  constructor(renderer: WebGLRenderer, opts: Partial<BallpitGroupConfig> = {}) {
    const config = { ...DEFAULT_BALLPIT, ...opts } as BallpitGroupConfig;
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(room, 0.04).texture;
    pmrem.dispose();

    const geo = new SphereGeometry();
    const mat = new ScatteringPhysicalMaterial({ envMap, ...config.materialParams });
    mat.envMapRotation.x = -Math.PI / 2;
    super(geo, mat, config.count);
    this.frustumCulled = false;
    this.config = config;
    this.physics = new BallPhysics(config);
    this.#initLights();
    this.setColors(config.colors);
  }

  #initLights() {
    this.ambientLight = new AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);
    const c0 = this.config.colors[0] ?? 0xffffff;
    this.light = new PointLight(c0, this.config.lightIntensity);
    this.add(this.light);
  }

  setColors(hexList: number[]) {
    if (!Array.isArray(hexList) || hexList.length < 2) return;
    const palette = hexList.map((h) => new Color(h));
    const getAt = (ratio: number, out = new Color()) => {
      const t = Math.max(0, Math.min(1, ratio)) * (palette.length - 1);
      const i = Math.floor(t);
      const start = palette[i]!;
      if (i >= palette.length - 1) return start.clone();
      const a = t - i;
      const end = palette[i + 1]!;
      out.r = start.r + a * (end.r - start.r);
      out.g = start.g + a * (end.g - start.g);
      out.b = start.b + a * (end.b - start.b);
      return out;
    };
    for (let idx = 0; idx < this.count; idx++) {
      this.setColorAt(idx, getAt(idx / this.count));
      if (idx === 0) this.light.color.copy(getAt(idx / this.count));
    }
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(dt: TimeState) {
    this.physics.update(dt);
    for (let idx = 0; idx < this.count; idx++) {
      _dummy.position.fromArray(this.physics.positionData, 3 * idx);
      /* Instance 0 is the cursor “pusher”; keep physics + light, hide the mesh */
      if (idx === 0) {
        _dummy.scale.setScalar(0);
      } else {
        _dummy.scale.setScalar(this.physics.sizeData[idx]!);
      }
      _dummy.updateMatrix();
      this.setMatrixAt(idx, _dummy.matrix);
      if (idx === 0) this.light.position.copy(_dummy.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function normalizeColors(colors?: readonly number[] | string[]): number[] {
  if (!colors?.length) return [...BALLPIT_SITE_COLORS_HEX];
  return colors.map((c) => (typeof c === 'number' ? c : parseInt(String(c).replace('#', ''), 16)));
}

/** New random palette each page load; hues sorted so the instance gradient stays smooth. */
function randomBallpitPalette(keyCount = 10): number[] {
  const stops = Array.from({ length: keyCount }, () => ({
    h: Math.random(),
    s: 0.74 + Math.random() * 0.24,
    l: 0.4 + Math.random() * 0.32,
  }));
  stops.sort((a, b) => a.h - b.h);
  return stops.map(({ h, s, l }) => new Color().setHSL(h, s, l).getHex());
}

export function createBallpit(canvas: HTMLCanvasElement, opts: Partial<BallpitGroupConfig> = {}) {
  const three = new MiniThreeApp({
    canvas,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true },
  });
  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();

  let spheres: BallpitInstancedGroup | null = null;
  let paused = false;
  let pointerDispose: (() => void) | undefined;

  function init(cfg: Partial<BallpitGroupConfig>) {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new BallpitInstancedGroup(three.renderer, cfg);
    three.scene.add(spheres);
  }

  init(opts);

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const hit = new Vector3();

  if (opts.followCursor !== false) {
    canvas.style.touchAction = 'none';
    canvas.style.userSelect = 'none';
    canvas.style.webkitUserSelect = 'none';
    canvas.style.cursor = 'crosshair';

    const interaction = registerInteraction(canvas, {
      position: new Vector2(),
      nPosition: new Vector2(),
      hover: false,
      touching: false,
      onEnter: () => {},
      onMove: () => {
        raycaster.setFromCamera(interaction.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, hit);
        spheres!.physics.center.copy(hit);
        spheres!.config.controlSphere0 = true;
      },
      onClick: () => {},
      onLeave: () => {
        spheres!.config.controlSphere0 = false;
      },
    });
    pointerDispose = interaction.dispose;
  } else {
    canvas.style.touchAction = '';
    canvas.style.userSelect = '';
    canvas.style.cursor = '';
  }

  three.onBeforeRender = (t) => {
    if (!paused && spheres) spheres.update(t);
  };
  three.onAfterResize = (s) => {
    if (spheres) {
      spheres.config.maxX = s.wWidth / 2;
      spheres.config.maxY = s.wHeight / 2;
    }
  };

  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(n: number) {
      init({ ...spheres!.config, count: n });
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      pointerDispose?.();
      canvas.style.cursor = '';
      three.dispose();
    },
  };
}

function stripReactProps(props: BallpitProps): Partial<BallpitGroupConfig> {
  const { className: _c, colors: _colors, followCursor: _fc, ...rest } = props;
  return rest;
}

export default function Ballpit({ className = '', followCursor = true, ...props }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const colors =
      props.colors != null && props.colors.length > 0
        ? normalizeColors(props.colors)
        : randomBallpitPalette();
    const inst = createBallpit(canvas, { followCursor, ...stripReactProps(props), colors });
    return () => inst.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- GPU scene built once; matches reference component
  }, []);

  return <canvas className={className} ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
