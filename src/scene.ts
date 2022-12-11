import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const setupScene = (): { scene: THREE.Scene; update: () => void } => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.rotateX(Math.PI / 2);
  camera.position.y = -1.5;
  camera.up.set(0, 0, 1);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.autoRotate = true;
  let autoRotateTimeout: number | null = null;
  controls.addEventListener("start", () => {
    if (autoRotateTimeout) {
      clearTimeout(autoRotateTimeout);
    }
    controls.autoRotate = false;
  });
  controls.addEventListener("end", () => {
    autoRotateTimeout = setTimeout(function () {
      controls.autoRotate = true;
    }, 5000);
  });
  return {
    scene: scene,
    update: () => {
      renderer.render(scene, camera);
      controls.update();
    },
  };
};
