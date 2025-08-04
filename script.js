// Materialdensiteter i kg/m³
const materialDensities = {
  mdf: 750,
  plywood: 600,
  hdf: 850
};

function drawHorn() {
  // 1. Hämta värden
  const height = parseInt(document.getElementById("hornHeight").value);
  const width = parseInt(document.getElementById("hornWidth").value);
  const depth = parseInt(document.getElementById("hornDepth").value);
  const wall = parseInt(document.getElementById("hornWallThickness").value);
  const material = document.getElementById("hornMaterialType").value;
  const wooferCount = parseInt(document.getElementById("wooferCountHorn").value);
  const hornLength = parseInt(document.getElementById("hornLength").value);
  const folds = parseInt(document.getElementById("folds").value);

  // 2. Beräkna volymer
  const outerVolume = (height * width * depth) / 1000000; // m³
  const innerVolume = ((height - 2 * wall) * (width - 2 * wall) * (depth - 2 * wall)) / 1000000; // m³
  const materialVolume = outerVolume - innerVolume;
  const weight = (materialVolume * materialDensities) / 1000000; // kg

  // 3. Frekvensomfång
  const L = hornLength / 1000; // i meter
  const c = 343;
  const f1 = Math.round(c / (4 * L));
  const freqRange = `~${f1} Hz – ${f1 * 5} Hz`;

  // 4. Visa resultat
  document.getElementById("hornDetails").innerHTML = `
    <p><strong>Inre volym:</strong> ${(innerVolume * 1000).toFixed(1)} liter</p>
    <p><strong>Materialvolym:</strong> ${(materialVolume * 1000).toFixed(1)} liter</p>
    <p><strong>Vikt:</strong> ${weight} kg</p>
    <p><strong>Frekvensomfång:</strong> ${freqRange}</p>
    <p><strong>Element:</strong> ${wooferCount} st</p>
    <p><strong>Hornlängd:</strong> ${hornLength} mm (${folds} veck)</p>
  `;

  // 5. Rendera 3D
  initThreeScene(width, height, depth);
}

function initThreeScene(width, height, depth) {
  const container = document.getElementById("threeContainer");
  container.innerHTML = ""; // Rensa tidigare modell

  // Skapa scen
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f5f5f5");

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, height / 100, depth / 100 + 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Ljus
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xaaaaaa));

  // Skapa låda (högtalare)
  const geometry = new THREE.BoxGeometry(width / 1000, height / 1000, depth / 1000);
  const material = new THREE.MeshStandardMaterial({ color: 0x5555ff, transparent: true, opacity: 0.6 });
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);

  // Kontroller (rota, zooma)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
