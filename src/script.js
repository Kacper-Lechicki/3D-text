import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import GUI from 'lil-gui';

// Constants
const textures = {
	matcapTexture1: '/textures/matcaps/3.png',
	matcapTexture2: '/textures/matcaps/2.png',
};

const fonts = {
	helvetiker_regular: '/fonts/helvetiker_regular.typeface.json',
};
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// Base
const gui = new GUI();
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();
const clock = new THREE.Clock();

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(1, 1, 2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Variables
let textGeometry;

// Functions
const addDonuts = (count, geometry, material) => {
	material.matcap.colorSpace = THREE.SRGBColorSpace;

	for (let i = 0; i < count; i++) {
		const donut = new THREE.Mesh(geometry, material);
		donut.position.set(
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10
		);
		donut.scale.setScalar(Math.random() * (1.5 - 0.3) + 0.3);
		donut.rotation.set(
			Math.random() * Math.PI * 2, // Random rotation around x-axis
			Math.random() * Math.PI * 2, // Random rotation around y-axis
			Math.random() * Math.PI * 2 // Random rotation around z-axis
		);
		scene.add(donut);
	}
};

const initText = (font) => {
	textGeometry = new TextGeometry('Kacper Lechicki', {
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
	textGeometry.center();

	const matcapMaterial1 = new THREE.MeshMatcapMaterial({
		matcap: textureLoader.load(textures.matcapTexture1),
	});
	matcapMaterial1.matcap.colorSpace = THREE.SRGBColorSpace;

	const text = new THREE.Mesh(textGeometry, matcapMaterial1);
	scene.add(text);

	const matcapMaterial2 = new THREE.MeshMatcapMaterial({
		matcap: textureLoader.load(textures.matcapTexture2),
	});
	matcapMaterial2.matcap.colorSpace = THREE.SRGBColorSpace;

	addDonuts(100, new THREE.TorusGeometry(0.3, 0.2, 20, 45), matcapMaterial2);
};

const onWindowResize = () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const animate = () => {
	const elapsedTime = clock.getElapsedTime();
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate);
};

// Event Listeners
window.addEventListener('resize', onWindowResize);

// Initialization
fontLoader.load(fonts.helvetiker_regular, initText);
animate();

// GUI Controls
gui.add(camera.position, 'x').min(-10).max(10).step(0.1).name('Camera X');
gui.add(camera.position, 'y').min(-10).max(10).step(0.1).name('Camera Y');
gui.add(camera.position, 'z').min(-10).max(10).step(0.1).name('Camera Z');

// Donut Count Control
const donutCount = { count: 100 };
gui
	.add(donutCount, 'count')
	.min(0)
	.max(200)
	.step(10)
	.onChange((value) => {
		// Remove existing donuts
		scene.children.forEach((child) => {
			if (
				child instanceof THREE.Mesh &&
				child.geometry instanceof THREE.TorusGeometry
			) {
				scene.remove(child);
			}
		});
		// Add new donuts
		addDonuts(
			value,
			new THREE.TorusGeometry(0.3, 0.2, 20, 45),
			new THREE.MeshMatcapMaterial({
				matcap: textureLoader.load(textures.matcapTexture2),
			})
		);
	})
	.name('Donut Count');
