import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0xacaf5 }); // <-- FIXED
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

//Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

// cube.position.x = 0.7;
// cube.position.y = -0.6;
// cube.position.z = 1;
// cube.scale.set(2, 0.25, 0.5);//x y z
// cube.rotation.set(0.5, Math.PI * 0.25, Math.PI * 0.25);
// console.log("Distance of cube from camera", cube.position.distanceTo(camera.position));

//Axes Helper
const axes = new THREE.AxesHelper(14);
scene.add(axes);

//Scaling objects
// cube.scale.x = 2;
// cube.scale.y = 0.25;
// cube.scale.z = 0.5;

//Rotation objects
// cube.rotation.x = Math.PI * 0.25;
// cube.rotation.y = Math.PI * 0.25;
// cube.rotation.z = Math.PI * 0.25;

const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.2;
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -1.5;
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
);
cube2.position.x =0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000})
);
cube3.position.x = 1.5
group.add(cube3)

function animate() {
    requestAnimationFrame(animate);
//    cube.rotation.x += 0.01;
//    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();