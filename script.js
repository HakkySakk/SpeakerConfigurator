// script.js

// Hantera formulär och sidnavigering
const foldedHornBtn = document.getElementById("foldedHornBtn");
const foldedHornSection = document.getElementById("foldedHornSection");
const otherSection = document.getElementById("otherSection");

foldedHornBtn.addEventListener("click", () => {
  foldedHornSection.classList.remove("hidden");
  otherSection.classList.add("hidden");
  initHornVisualization();
});

// Materialdata för viktberäkning
const plywoodDensity = 700; // kg/m³ (typiskt för björkplywood)

// Rita folded horn visualisering i 3D
function initHornVisualization() {
  const container = document.getElementById("threeContainer");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    5000
  );
  camera.position.set(0, 500, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Enkel volym med öppning - placeholder
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(400, 800, 500),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 })
  );
  scene.add(box);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Uträkning av materialvikt (exempel)
function calculateMaterialWeight(width, height, depth, thickness) {
  const mm3ToM3 = 1e-9;
  const outerVolume = width * height * depth;
  const innerVolume = (width - 2 * thickness) * (height - 2 * thickness) * (depth - 2 * thickness);
  const panelVolume = (outerVolume - innerVolume) * mm3ToM3; // m³
  return panelVolume * plywoodDensity; // kg
}

// Exempel på att skriva ut vikt
const weightOutput = document.getElementById("materialWeight");
const exampleWeight = calculateMaterialWeight(400, 800, 500, 18);
if (weightOutput) weightOutput.textContent = `Materialvikt: ${exampleWeight.toFixed(1)} kg`;

