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

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

function drawHorn() {
  initHorn3DView();
  const canvas = document.getElementById('hornCanvas');
  const ctx = canvas.getContext('2d');

  const height = Number(document.getElementById('hornHeight').value);
  const width = Number(document.getElementById('hornWidth').value);
  const depth = Number(document.getElementById('hornDepth').value);
  const wall = Number(document.getElementById('hornWallThickness').value);
  const folds = Number(document.getElementById('folds').value);
  const hornLength = Number(document.getElementById('hornLength').value);
  const material = document.getElementById('hornMaterialType').value;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scaleX = 480 / (width * folds);
  const scaleY = 280 / height;
  const scale = Math.min(scaleX, scaleY);

  const foldWidth = width * scale;
  const foldHeight = height * scale;

  for (let i = 0; i < folds; i++) {
    const x = i * foldWidth;
    ctx.fillStyle = '#0071e3';
    ctx.fillRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
    ctx.strokeStyle = '#004a99';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
  }

  ctx.fillStyle = '#0071e3';
  ctx.font = 'bold 16px "SF Pro Text", sans-serif';
  ctx.fillText(`Antal veck: ${folds}`, 10, 20);
  ctx.fillText(`Hornets längd: ${hornLength} mm`, 10, 40);

  const outerVolumeM3 = (height * width * depth) / 1000000;
  const innerHeight = (height - wall * 2) / 1000;
  const innerWidth = (width - wall * 2) / 1000;
  const innerDepth = hornLength / 1000;


  const innerVolumeM3 = innerHeight * innerWidth * innerDepth;
  const materialVolumeM3 = outerVolumeM3 - innerVolumeM3;
  const density = materialVolumeM3 * getMaterialDensity(material) / 1000;
  const weight = materialVolumeM3 * density

  document.getElementById('hornDetails').innerHTML = `
    <p>Dimensioner (HxBxD): ${height} x ${width} x ${depth} mm</p>
    <p>Väggtjocklek: ${wall} mm</p>
    <p>Antal veck: ${folds}</p>
    <p>Hornets längd: ${hornLength} mm</p>
    <p><strong>Materialvikt:</strong> ${weight.toFixed(2)} kg (${material.toUpperCase()})</p>
  `;
}
