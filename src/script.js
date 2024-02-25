import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture1 = textureLoader.load('/textures/matcaps/3.png');
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png');
matcapTexture1.colorSpace = THREE.SRGBColorSpace;
matcapTexture2.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Kacper Lechicki', {
		font,
		size: 0.4,
		height: 0.1,
		bevelEnabled: true,
		curveSegments: 20,
		bevelThickness: 0.02,
		bevelSize: 0.01,
		bevelOffset: 0,
		bevelSegments: 2,
	});

	const matcapMaterial1 = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture1,
	});

	const matcapMaterial2 = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture2,
	});

	textGeometry.center();

	const text = new THREE.Mesh(textGeometry, matcapMaterial1);

	scene.add(text);

	/**
	 * Donuts
	 */
	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

	for (let i = 0; i < 100; i++) {
		const donut = new THREE.Mesh(donutGeometry, matcapMaterial2);

		const randomPositionX = (Math.random() - 0.5) * 10;
		const randomPositionY = (Math.random() - 0.5) * 10;
		const randomPositionZ = (Math.random() - 0.5) * 10;
		donut.position.set(randomPositionX, randomPositionY, randomPositionZ);

		const randomScale = Math.random() * (1.5 - 0.3) + 0.3;
		donut.scale.set(randomScale, randomScale, randomScale);

		const randomRotation = Math.random() * Math.PI;
		donut.rotation.set(randomRotation, randomRotation, randomRotation);

		scene.add(donut);
	}
});

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
