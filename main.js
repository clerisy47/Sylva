import * as THREE from 'three';
import { Tree } from './tree.js';
import { BarkType, Billboard, LeafType, TreeType } from './enums.js';
import TreeOptions from './options.js';

class SimpleFractalForest {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.trees = [];
    this.clock = new THREE.Clock();
    
    this.init();
    this.setupLights();
    this.createGround();
    this.generateForest();
    this.animate();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 15, 30);
    this.camera.lookAt(0, 10, 0);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    document.body.appendChild(this.renderer.domElement);

    // Simple camera controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraPosition = { theta: 0, phi: Math.PI / 4, radius: 40 };

    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onMouseMove = (event) => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      cameraPosition.theta -= deltaX * 0.01;
      cameraPosition.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraPosition.phi + deltaY * 0.01));

      this.updateCameraPosition(cameraPosition);
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onWheel = (event) => {
      cameraPosition.radius = Math.max(10, Math.min(100, cameraPosition.radius + event.deltaY * 0.1));
      this.updateCameraPosition(cameraPosition);
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('wheel', onWheel);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  updateCameraPosition({ theta, phi, radius }) {
    this.camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    this.camera.position.y = radius * Math.cos(phi);
    this.camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    this.camera.lookAt(0, 5, 0);
  }

  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x8bb7f0, 0.3);
    fillLight.position.set(-30, 20, -30);
    this.scene.add(fillLight);
  }

  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x2d5016,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  generateForest() {
    console.log('🌲 Generating fractal forest...');
    
    // Generate random trees
    for (let i = 0; i < 15; i++) {
      try {
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        
        // Skip if too close to center
        if (Math.sqrt(x * x + z * z) < 15) continue;

        const options = this.createRandomTreeOptions();
        const tree = new Tree(options);
        tree.position.set(x, 0, z);
        tree.generate();
        this.scene.add(tree);
        this.trees.push(tree);
        
        console.log(`🌳 Tree ${i + 1} generated at (${x.toFixed(1)}, ${z.toFixed(1)})`);
      } catch (error) {
        console.warn(`❌ Failed to generate tree ${i + 1}:`, error);
      }
    }

    console.log(`✅ Generated ${this.trees.length} trees successfully!`);
  }

  createRandomTreeOptions() {
    const options = new TreeOptions();
    
    // Basic settings
    options.seed = Math.floor(Math.random() * 100000);
    options.type = Math.random() > 0.6 ? TreeType.Evergreen : TreeType.Deciduous;
    
    // Bark settings
    const barkTypes = Object.values(BarkType);
    options.bark.type = barkTypes[Math.floor(Math.random() * barkTypes.length)];
    options.bark.tint = this.getRandomBarkColor();
    options.bark.textureScale.y = 3 + Math.random() * 7;
    
    // Branch settings
    options.branch.levels = 2 + Math.floor(Math.random() * 2); // 2-3 levels
    
    // Simplified branch parameters
    for (let level = 0; level <= options.branch.levels; level++) {
      if (level > 0) {
        options.branch.angle[level] = 25 + Math.random() * 40;
        options.branch.children[level - 1] = 3 + Math.floor(Math.random() * 4);
        options.branch.start[level] = 0.3 + Math.random() * 0.4;
      }
      
      options.branch.length[level] = (8 + Math.random() * 15) * (1 - level * 0.25);
      options.branch.radius[level] = (0.4 + Math.random() * 0.8) * (1 - level * 0.15);
      options.branch.gnarliness[level] = Math.random() * 0.2;
      options.branch.taper[level] = 0.5 + Math.random() * 0.3;
      options.branch.sections[level] = Math.max(4, 10 - level * 2);
      options.branch.segments[level] = Math.max(4, 8 - level);
    }
    
    // Leaf settings
    const leafTypes = Object.values(LeafType);
    options.leaves.type = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    options.leaves.billboard = Math.random() > 0.5 ? Billboard.Double : Billboard.Single;
    options.leaves.count = 3 + Math.floor(Math.random() * 12);
    options.leaves.size = 1.2 + Math.random() * 1.5;
    options.leaves.sizeVariance = 0.2 + Math.random() * 0.4;
    options.leaves.angle = 5 + Math.random() * 25;
    options.leaves.start = Math.random() * 0.2;
    options.leaves.tint = this.getRandomLeafColor();
    
    return options;
  }

  getRandomBarkColor() {
    const colors = [0x8B4513, 0xA0522D, 0x654321, 0x915C3A, 0x7D6553, 0x5D4037];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomLeafColor() {
    const colors = [0x228B22, 0x32CD32, 0x006400, 0x9ACD32, 0x8FBC8F, 0xFF6347, 0xFFA500, 0xDC143C];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update trees with wind animation
    this.trees.forEach(tree => {
      if (tree.update) {
        tree.update(elapsedTime);
      }
    });
    
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Setup styles
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'hidden';
  document.body.style.fontFamily = 'Arial, sans-serif';
  
  // Add UI
  const ui = document.createElement('div');
  ui.style.position = 'absolute';
  ui.style.top = '10px';
  ui.style.left = '10px';
  ui.style.color = 'white';
  ui.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  ui.style.padding = '15px';
  ui.style.borderRadius = '8px';
  ui.style.fontSize = '14px';
  ui.style.zIndex = '1000';
  ui.innerHTML = `
    <h3>🌲 Fractal Tree Forest</h3>
    <p>🖱️ <strong>Mouse:</strong> Click and drag to orbit</p>
    <p>🔄 <strong>Scroll:</strong> Zoom in/out</p>
    <p>🌳 <strong>Trees:</strong> Procedurally generated</p>
    <p>💨 <strong>Wind:</strong> Animated swaying</p>
    <p><small>Loading textures and generating trees...</small></p>
  `;
  document.body.appendChild(ui);
  
  // Initialize the forest
  try {
    const forest = new SimpleFractalForest();
    console.log('🎉 Fractal Tree Forest initialized successfully!');
    
    // Update UI after initialization
    setTimeout(() => {
      const statusElement = ui.querySelector('small');
      if (statusElement) {
        statusElement.textContent = `Generated ${forest.trees.length} unique trees!`;
      }
    }, 2000);
    
  } catch (error) {
    console.error('❌ Failed to initialize forest:', error);
    ui.innerHTML += `<p style="color: #ff6b6b;"><small>Error: ${error.message}</small></p>`;
  }
});

export { SimpleFractalForest };
