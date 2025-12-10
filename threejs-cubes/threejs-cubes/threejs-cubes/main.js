import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog = new THREE.Fog(0x0a0a1a, 10, 50);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Store all cubes
let cubes = [];
let selectedCube = null;

// DOM Elements
const defaultMessage = document.querySelector('.default-message');
const cubeInfo = document.querySelector('.cube-info');
const posX = document.getElementById('posX');
const posY = document.getElementById('posY');
const posZ = document.getElementById('posZ');
const sizeW = document.getElementById('sizeW');
const sizeH = document.getElementById('sizeH');
const sizeD = document.getElementById('sizeD');
const colorHex = document.getElementById('colorHex');
const colorBox = document.getElementById('colorBox');
const cubeId = document.getElementById('cubeId');
const previewCube = document.getElementById('previewCube');
const resetBtn = document.getElementById('resetBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const helpBtn = document.getElementById('helpBtn');
const closeBtn = document.querySelector('.close-btn');
const instructionsModal = document.getElementById('instructionsModal');

// Generate random color
function getRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3',
        '#FFC300', '#C70039', '#900C3F', '#581845', '#1A5276',
        '#28B463', '#D35400', '#8E44AD', '#16A085', '#2C3E50',
        '#E74C3C', '#3498DB', '#9B59B6', '#1ABC9C', '#F39C12'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create a cube with random properties
function createRandomCube(id) {
    // Random size between 0.5 and 2.5
    const width = Math.random() * 2 + 0.5;
    const height = Math.random() * 2 + 0.5;
    const depth = Math.random() * 2 + 0.5;
    
    // Random position within bounds
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 10 + 2;
    const z = (Math.random() - 0.5) * 20;
    
    // Random color
    const color = getRandomColor();
    
    // Create geometry and material
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color(color).multiplyScalar(0.1)
    });
    
    // Create mesh
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    // Store custom properties
    cube.userData = {
        id: id,
        originalColor: color,
        width: width,
        height: height,
        depth: depth
    };
    
    // Add slight random rotation
    cube.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );
    
    scene.add(cube);
    cubes.push(cube);
    return cube;
}

// Create 20 random cubes
function createCubes() {
    cubes.forEach(cube => scene.remove(cube));
    cubes = [];
    
    for (let i = 0; i < 20; i++) {
        createRandomCube(i + 1);
    }
}

// Update UI with cube information
function updateCubeInfo(cube) {
    if (!cube) return;
    
    // Show info panel, hide default message
    defaultMessage.classList.add('hidden');
    cubeInfo.classList.remove('hidden');
    
    // Update position
    posX.textContent = cube.position.x.toFixed(2);
    posY.textContent = cube.position.y.toFixed(2);
    posZ.textContent = cube.position.z.toFixed(2);
    
    // Update size
    sizeW.textContent = cube.userData.width.toFixed(2);
    sizeH.textContent = cube.userData.height.toFixed(2);
    sizeD.textContent = cube.userData.depth.toFixed(2);
    
    // Update color
    const color = cube.userData.originalColor;
    colorHex.textContent = color;
    colorBox.style.backgroundColor = color;
    previewCube.style.backgroundColor = color;
    
    // Update ID
    cubeId.textContent = cube.userData.id;
    
    // Add animation to preview cube
    previewCube.style.animation = 'none';
    setTimeout(() => {
        previewCube.style.animation = 'float 3s ease-in-out infinite';
    }, 10);
}

// Reset selection
function resetSelection() {
    if (selectedCube) {
        // Reset cube appearance
        selectedCube.material.color.set(selectedCube.userData.originalColor);
        selectedCube.material.emissive.setHex(0x000000);
        selectedCube.scale.set(1, 1, 1);
        selectedCube = null;
    }
    
    // Reset UI
    defaultMessage.classList.remove('hidden');
    cubeInfo.classList.add('hidden');
}

// Highlight selected cube
function highlightCube(cube) {
    // Reset previous selection
    if (selectedCube && selectedCube !== cube) {
        selectedCube.material.color.set(selectedCube.userData.originalColor);
        selectedCube.material.emissive.setHex(0x000000);
        selectedCube.scale.set(1, 1, 1);
    }
    
    // Highlight new cube
    selectedCube = cube;
    const highlightColor = new THREE.Color(0xffffff);
    cube.material.color.copy(highlightColor);
    cube.material.emissive.setHex(0x444444);
    
    // Add selection animation
    cube.scale.set(1.1, 1.1, 1.1);
    
    // Update UI
    updateCubeInfo(cube);
}

// Mouse click handler
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects(cubes);
    
    if (intersects.length > 0) {
        // Cube was clicked
        const cube = intersects[0].object;
        highlightCube(cube);
        
        // Add bounce animation
        const originalY = cube.position.y;
        let bounceHeight = 0.5;
        
        function bounce() {
            bounceHeight *= 0.7;
            cube.position.y += bounceHeight;
            
            if (bounceHeight > 0.01) {
                requestAnimationFrame(() => {
                    cube.position.y -= bounceHeight;
                    bounce();
                });
            } else {
                cube.position.y = originalY;
            }
        }
        
        bounce();
    } else {
        // Clicked on empty space - show message
        resetSelection();
        
        // Show temporary message
        const tempMessage = document.createElement('div');
        tempMessage.className = 'temp-message';
        tempMessage.innerHTML = '<i class="fas fa-times-circle"></i> No cube selected';
        tempMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: bold;
            animation: fadeOut 2s forwards;
        `;
        
        // Add CSS for fadeOut
        if (!document.querySelector('#fadeOutStyle')) {
            const style = document.createElement('style');
            style.id = 'fadeOutStyle';
            style.textContent = `
                @keyframes fadeOut {
                    0% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(tempMessage);
        setTimeout(() => tempMessage.remove(), 2000);
    }
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate all cubes slowly
    cubes.forEach(cube => {
        if (cube !== selectedCube) {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.005;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Initialize the scene
function init() {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a2e,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create cubes
    createCubes();
    
    // Event listeners
    window.addEventListener('click', onMouseClick);
    window.addEventListener('resize', onWindowResize);
    
    // Button listeners
    resetBtn.addEventListener('click', resetSelection);
    
    randomizeBtn.addEventListener('click', () => {
        createCubes();
        resetSelection();
    });
    
    helpBtn.addEventListener('click', () => {
        instructionsModal.classList.remove('hidden');
    });
    
    closeBtn.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
    });
    
    // Close modal when clicking outside
    instructionsModal.addEventListener('click', (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.classList.add('hidden');
        }
    });
    
    // Start animation
    animate();
}

// Start the application
init();