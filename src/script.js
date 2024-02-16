import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {
  depthColor: "#0b2042",
  surfaceColor: "#346f7f",
  fogColor: "#262837",
  foamColor: "#bad3e3",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesSpeed: { value: 0.75 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.25 },
    uColorMultiplier: { value: 2 },

    fogColor: { value: new THREE.Color(debugObject.fogColor) },
    fogDensity: { value: 0.5 },

    uFoamColor: { value: new THREE.Color(debugObject.foamColor) },
  },
  fog: true,
  defines: {
    USE_FOG: "",
    FOG_EXP2: "",
  },
});

// Debug
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value", 0, 1, 0.001)
  .name("Big Waves Elevation");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x", 0, 10, 0.001)
  .name("Big Waves Frequency X");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y", 0, 10, 0.001)
  .name("Big Waves Frequency Y");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value", 0, 4, 0.001)
  .name("Big Waves Speed");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value", 0, 1, 0.001)
  .name("Small Waves Elevation");
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value", 0, 30, 0.001)
  .name("Small Waves Frequency");
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value", 0, 4, 0.001)
  .name("Small Waves Speed");
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value", 0, 8, 1)
  .name("Small Waves Iterations");

gui
  .addColor(debugObject, "depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  })
  .name("Depth Color");
gui
  .addColor(debugObject, "surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  })
  .name("Surface Color");
gui
  .add(waterMaterial.uniforms.uColorOffset, "value", 0, 1, 0.001)
  .name("Color Offset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value", 0, 10, 0.001)
  .name("Color Multiplier");
gui
  .addColor(debugObject, "fogColor")
  .onChange(() => {
    waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor);
  })
  .name("Fog Color");
gui
  .add(waterMaterial.uniforms.fogDensity, "value", 0, 2, 0.001)
  .name("Fog Density");

gui
  .addColor(debugObject, "foamColor")
  .onChange(() => {
    waterMaterial.uniforms.uFoamColor.value.set(debugObject.foamColor);
  })
  .name("Foam Color");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Water
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
