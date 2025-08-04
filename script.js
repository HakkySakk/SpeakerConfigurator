// Materialdensiteter kg/m3
function getMaterialDensity(material) {
  switch (material) {
    case 'mdf': return 700;
    case 'plywood': return 600;
    case 'hdf': return 850;
    default: return 700;
  }
}

function showSection(section) {
  document.getElementById("standardSection").classList.add("hidden");
  document.getElementById("hornSection").classList.add("hidden");

  if (section === "standard") {
    document.getElementById("standardSection").classList.remove("hidden");
  } else {
    document.getElementById("hornSection").classList.remove("hidden");
    drawHorn();
  }
}

function calculateVolume() {
  const height = Number(document.getElementById('height').value);
  const width = Number(document.getElementById('width').value);
  const depth = Number(document.getElementById('depth').value);
  const wall = Number(document.getElementById('wallThickness').value);
  const material = document.getElementById('materialType').value;

  const innerHeight = height - wall * 2;
  const innerWidth = width - wall * 2;
  const innerDepth = depth - wall * 2;

  if (innerHeight <= 0 || innerWidth <= 0 || innerDepth <= 0) {
    alert('Väggtjockleken är för stor för dimensionerna.');
    return;
  }

  const volume = (innerHeight * innerWidth * innerDepth) / 1000000;
  const outerVolume = (height * width * depth) / 1000000;
  const materialVolume = outerVolume - volume;
  const density = getMaterialDensity(material);
  const weight = materialVolume * density / 1000;

  document.getElementById('results').innerHTML = `
    <p><strong>Inre volym:</strong> ${volume.toFixed(2)} liter</p>
    <p><strong>Materialvikt:</strong> ${weight.toFixed(2)} kg (${material.toUpperCase()})</p>
  `;
}

function drawHorn() {
  const canvas = document.getElementById("hornCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const L = parseInt(document.getElementById("hornLength").value);
  const folds = parseInt(document.getElementById("folds").value);
  const wooferCount = parseInt(document.getElementById("wooferCountHorn").value);
  const portD = parseInt(document.getElementById("portDiameter").value);
  const portL = parseInt(document.getElementById("portLength").value);

  const h = parseInt(document.getElementById("hornHeight").value);
  const w = parseInt(document.getElementById("hornWidth").value);
  const d = parseInt(document.getElementById("hornDepth").value);
  const wall = parseInt(document.getElementById("hornWallThickness").value);
  const mat = document.getElementById("hornMaterialType").value;

  const volume = ((h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000;
  const materialVol = ((h * w * d - (h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000).toFixed(1);
  const weight = (materialVol * materialDensities[mat]).toFixed(1);

  const foldH = (canvas.height - 40) / folds;
  const margin = 20;

  ctx.beginPath();
  ctx.moveTo(margin, margin);

  for (let i = 0; i < folds; i++) {
    const x = i % 2 === 0 ? canvas.width - margin : margin;
    const y = margin + (i + 1) * foldH;
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = 0; i <= folds; i++) {
    const x = i % 2 === 0 ? margin : canvas.width - margin;
    const y = margin + i * foldH;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? "#007BFF" : "#FF0000";
    ctx.fill();
  }

  const portArea = Math.PI * Math.pow(portD / 2, 2) / 100;

  document.getElementById("hornRange").innerText = `Frekvensomfång: ${simulateHornResponse(L)}`;
  document.getElementById("hornDetails").innerHTML = `
    <p><strong>Element:</strong> ${wooferCount} st</p>
    <p><strong>Basreflexport:</strong> Portyta: ${portArea.toFixed(1)} cm², Längd: ${portL} mm</p>
    <p><strong>Inre volym:</strong> ${volume.toFixed(1)} liter</p>
    <p><strong>Materialvolym:</strong> ${materialVol} liter</p>
    <p><strong>Vikt:</strong> ${weight} kg</p>
  `;

  drawPressureCurve();
  initHorn3DView();
}

function drawPressureCurve() {
  const canvas = document.getElementById("pressureCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const folds = parseInt(document.getElementById("folds").value);
  const hornLength = parseInt(document.getElementById("hornLength").value);
  const samples = 100;
  const pressure = [];

  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    const standingWave = Math.sin(Math.PI * x);
    pressure.push(standingWave);
  }

  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, canvas.height - 30);
  ctx.lineTo(canvas.width - 10, canvas.height - 30);
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= samples; i++) {
    const x = 40 + i * ((canvas.width - 60) / samples);
    const y = canvas.height - 30 - pressure[i] * (canvas.height - 60);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "#FF6600";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";
  ctx.fillText("0", 30, canvas.height - 25);
  ctx.fillText("Hornlängd (mm)", canvas.width / 2 - 30, canvas.height - 10);
  ctx.fillText("Lufttryck", 5, 20);
}

function initHorn3DView() {
  const container = document.getElementById("threeDContainer");
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f2f2);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 500, 0.1, 1000);
  camera.position.set(0, 100, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, 500);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  const h = parseInt(document.getElementById("hornHeight").value);
  const w = parseInt(document.getElementById("hornWidth").value);
  const d = parseInt(document.getElementById("hornDepth").value);
  const wall = parseInt(document.getElementById("hornWallThickness").value);
  const folds = parseInt(document.getElementById("folds").value);

  const hornMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.1, roughness: 0.8 });

  const wallGeometry = new THREE.BoxGeometry(w, wall, d);
  const topWall = new THREE.Mesh(wallGeometry, hornMaterial);
  topWall.position.set(0, h / 2, 0);
  scene.add(topWall);

  const bottomWall = topWall.clone();
  bottomWall.position.y = -h / 2;
  scene.add(bottomWall);

  const sideWallGeometry = new THREE.BoxGeometry(wall, h, d);
  const leftWall = new THREE.Mesh(sideWallGeometry, hornMaterial);
  leftWall.position.set(-w / 2, 0, 0);
  scene.add(leftWall);

  const rightWall = leftWall.clone();
  rightWall.position.x = w / 2;
  scene.add(rightWall);

  const foldSpacing = h / (folds + 1);
  for (let i = 0; i < folds; i++) {
    const path = new THREE.BoxGeometry(w - 2 * wall, wall, d - 2 * wall);
    const fold = new THREE.Mesh(path, new THREE.MeshStandardMaterial({ color: 0x6666ff }));
    fold.position.set(0, h / 2 - (i + 1) * foldSpacing, 0);
    fold.rotation.y = (i % 2 === 0) ? 0 : Math.PI;
    scene.add(fold);
  }
// 3D-rendering av Folded Horn med Three.js
function renderFoldedHorn3D() {
  const container = document.getElementById('threeContainer');
  container.innerHTML = ''; // Töm tidigare innehåll

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000);
  camera.position.set(800, 600, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Ljussättning
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // Hämta dimensioner från input
  const height = parseFloat(document.getElementById('hornHeight').value);
  const width = parseFloat(document.getElementById('hornWidth').value);
  const depth = parseFloat(document.getElementById('hornDepth').value);
  const wallThickness = parseFloat(document.getElementById('hornWallThickness').value);
  const folds = parseInt(document.getElementById('folds').value);

  const hornLength = parseFloat(document.getElementById('hornLength').value);
  const foldHeight = height / (folds * 2);
  const gap = wallThickness * 1.5;
  let x = -width / 2 + gap;
  let y = height / 2 - foldHeight / 2;
  let direction = 1;

  // Rita hornets väggar som boxar
  for (let i = 0; i < folds; i++) {
    const geometry = new THREE.BoxGeometry(depth - gap * 2, wallThickness, foldHeight);
    const material = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, y, 0);
    scene.add(wall);

    x += direction * (width - gap * 2 - wallThickness);
    y -= foldHeight;
    direction *= -1;
  }

  // Kabinettets utsida
  const outerGeometry = new THREE.BoxGeometry(width, wallThickness, depth);
  const outerMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const top = new THREE.Mesh(outerGeometry, outerMaterial);
  top.position.y = height / 2;
  scene.add(top);

  const bottom = new THREE.Mesh(outerGeometry, outerMaterial);
  bottom.position.y = -height / 2;
  scene.add(bottom);

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Koppla till knappen i hornSection
function drawHorn() {
  renderHorn2D(); // tidigare 2D-canvas
  renderFoldedHorn3D(); // ny 3D-rendering
  calculateHorn(); // uppdatera info
}

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
