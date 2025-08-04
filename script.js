// script.js

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

const materialDensities = {
  mdf: 750,
  plywood: 600,
  hdf: 850
};

function simulateStandardResponse(volumeLiters, type, wooferSize) {
  const fs = 40 + (30 - wooferSize);
  let low = type === "sealed" ? Math.round(fs * Math.pow(60 / volumeLiters, 0.25)) : Math.round(38 - (volumeLiters / 10));
  let high = type === "sealed" ? 300 : 250;
  return `~${low} Hz – ${high} Hz`;
}

function calculateVolume() {
  const h = parseInt(document.getElementById("height").value);
  const w = parseInt(document.getElementById("width").value);
  const d = parseInt(document.getElementById("depth").value);
  const wall = parseInt(document.getElementById("wallThickness").value);
  const mat = document.getElementById("materialType").value;
  const woofer = parseInt(document.getElementById("wooferCount").value);
  const type = document.getElementById("cabinetType").value;

  const volume = ((h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000;
  const materialVol = ((h * w * d - (h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000).toFixed(1);
  const weight = (materialVol * materialDensities[mat]).toFixed(1);
  const freq = simulateStandardResponse(volume, type, 30);

  document.getElementById("results").innerHTML = `
    <p><strong>Inre volym:</strong> ${volume.toFixed(1)} liter</p>
    <p><strong>Materialvolym:</strong> ${materialVol} liter</p>
    <p><strong>Vikt:</strong> ${weight} kg</p>
    <p><strong>Simulerat frekvensomfång:</strong> ${freq}</p>
  `;
}

function getMaterialDensity(material) {
  switch (material) {
    case 'mdf': return 700;
    case 'plywood': return 600;
    case 'hdf': return 850;
    default: return 700;
  }
}

// Standard volym + vikt
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

  // Volym i liter
  const volume = (innerHeight * innerWidth * innerDepth) / 1000000;

  // Yttermått volym (inkl väggar)
  const outerVolume = (height * width * depth) / 1000000;

  // Materialvolym = yttermått - inre hålrum (m³)
  const materialVolume = outerVolume - volume; // i liter
  const materialVolumeM3 = materialVolume / 1000; // m³

  // Densitet kg/m3
  const density = getMaterialDensity(material);

  // Vikt i kg
  const weight = materialVolumeM3 * density;

  const resultDiv = document.getElementById('results');
  resultDiv.innerHTML = `
    <p>Inre volym: ${volume.toFixed(2)} liter</p>
    <p>Materialvikt: ${weight.toFixed(2)} kg (${material.toUpperCase()})</p>
  `;
}

// Folded horn viktberäkning (ungefärligt)
function drawHorn() {
  const canvas = document.getElementById('hornCanvas');
  const ctx = canvas.getContext('2d');

  // Hämta värden
  const height = Number(document.getElementById('hornHeight').value);
  const width = Number(document.getElementById('hornWidth').value);
  const depth = Number(document.getElementById('hornDepth').value);
  const wall = Number(document.getElementById('hornWallThickness').value);
  const folds = Number(document.getElementById('folds').value);
  const hornLength = Number(document.getElementById('hornLength').value);
  const material = document.getElementById('hornMaterialType').value;

  // Rensa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grundinställningar
  ctx.strokeStyle = '#0071e3';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#cce4ff';

  // Skalningsfaktor för att få plats på canvas (max bredd 480)
  const scaleX = 480 / (width * folds);
  const scaleY = 280 / height;
  const scale = Math.min(scaleX, scaleY);

  // Beräkna ruta för varje veck
  const foldWidth = width * scale;
  const foldHeight = height * scale;

  // Rita folded horn som staplade rektanglar som representerar veck
  for (let i = 0; i < folds; i++) {
    const x = i * foldWidth;
    ctx.fillRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
    ctx.strokeRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
  }

  // Lägg till en text som visar total längd
  ctx.fillStyle = '#0071e3';
  ctx.font = 'bold 16px "SF Pro Text", sans-serif';
  ctx.fillText(`Antal veck: ${folds}`, 10, 20);
  ctx.fillText(`Hornets längd: ${hornLength} mm`, 10, 40);

  // Materialviktberäkning folded horn (ungefärligt)

  // Total yta (ungefär) - vi kan anta hornet är ungefär som en lång låda med tjocklek wall
  // Volym av horn (yttervolym) i m³
  const outerVolumeM3 = (height / 1000) * (width / 1000) * (depth / 1000);

  // Inre volym approx: anta hornets inre längd = hornLength / 1000 meter och bredd och höjd minus väggar
  const innerHeight = (height - wall * 2) / 1000;
  const innerWidth = (width - wall * 2) / 1000;
  const innerDepth = hornLength / 1000;

  const innerVolumeM3 = innerHeight * innerWidth * innerDepth;

  // Materialvolym är yttermått minus inre volym
  const materialVolumeM3 = outerVolumeM3 - innerVolumeM3;

  // Densitet kg/m3
  const density = getMaterialDensity(material);

  // Vikt i kg
  const weight = materialVolumeM3 * density;

  const details = document.getElementById('hornDetails');
  details.innerHTML = `
    <p>Dimensioner (HxBxD): ${height} x ${width} x ${depth} mm</p>
    <p>Väggtjocklek: ${wall} mm</p>
    <p>Antal veck: ${folds}</p>
    <p>Hornets längd: ${hornLength} mm</p>
    <p>Materialvikt: ${weight.toFixed(2)} kg (${material.toUpperCase()})</p>
  `;
}

// Folded horn viktberäkning (ungefärligt)
function drawHorn() {
  const canvas = document.getElementById('hornCanvas');
  const ctx = canvas.getContext('2d');

  // Hämta värden
  const height = Number(document.getElementById('hornHeight').value);
  const width = Number(document.getElementById('hornWidth').value);
  const depth = Number(document.getElementById('hornDepth').value);
  const wall = Number(document.getElementById('hornWallThickness').value);
  const folds = Number(document.getElementById('folds').value);
  const hornLength = Number(document.getElementById('hornLength').value);
  const material = document.getElementById('hornMaterialType').value;

  // Rensa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Grundinställningar
  ctx.strokeStyle = '#0071e3';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#cce4ff';

  // Skalningsfaktor för att få plats på canvas (max bredd 480)
  const scaleX = 480 / (width * folds);
  const scaleY = 280 / height;
  const scale = Math.min(scaleX, scaleY);

  // Beräkna ruta för varje veck
  const foldWidth = width * scale;
  const foldHeight = height * scale;

  // Rita folded horn som staplade rektanglar som representerar veck
  for (let i = 0; i < folds; i++) {
    const x = i * foldWidth;
    ctx.fillRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
    ctx.strokeRect(x, canvas.height - foldHeight - 20, foldWidth - 5, foldHeight);
  }

  // Lägg till en text som visar total längd
  ctx.fillStyle = '#0071e3';
  ctx.font = 'bold 16px "SF Pro Text", sans-serif';
  ctx.fillText(`Antal veck: ${folds}`, 10, 20);
  ctx.fillText(`Hornets längd: ${hornLength} mm`, 10, 40);

  // Materialviktberäkning folded horn (ungefärligt)

  // Total yta (ungefär) - vi kan anta hornet är ungefär som en lång låda med tjocklek wall
  // Volym av horn (yttervolym) i m³
  const outerVolumeM3 = (height / 1000) * (width / 1000) * (depth / 1000);

  // Inre volym approx: anta hornets inre längd = hornLength / 1000 meter och bredd och höjd minus väggar
  const innerHeight = (height - wall * 2) / 1000;
  const innerWidth = (width - wall * 2) / 1000;
  const innerDepth = hornLength / 1000;

  const innerVolumeM3 = innerHeight * innerWidth * innerDepth;

  // Materialvolym är yttermått minus inre volym
  const materialVolumeM3 = outerVolumeM3 - innerVolumeM3;

  // Densitet kg/m3
  const density = getMaterialDensity(material);

  // Vikt i kg
  const weight = materialVolumeM3 * density;

  const details = document.getElementById('hornDetails');
  details.innerHTML = `
    <p>Dimensioner (HxBxD): ${height} x ${width} x ${depth} mm</p>
    <p>Väggtjocklek: ${wall} mm</p>
    <p>Antal veck: ${folds}</p>
    <p>Hornets längd: ${hornLength} mm</p>
    <p>Materialvikt: ${weight.toFixed(2)} kg (${material.toUpperCase()})</p>
  `;
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const h = parseInt(document.getElementById("height").value);
  const w = parseInt(document.getElementById("width").value);
  const d = parseInt(document.getElementById("depth").value);
  const wall = parseInt(document.getElementById("wallThickness").value);
  const mat = document.getElementById("materialType").value;
  const woofer = parseInt(document.getElementById("wooferCount").value);
  const type = document.getElementById("cabinetType").value;

  const volume = ((h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000;
  const materialVol = ((h * w * d - (h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000).toFixed(1);
  const weight = (materialVol * materialDensities[mat]).toFixed(1);
  const freq = simulateStandardResponse(volume, type, 30);

  doc.text("Högtalarkabinett – Export", 10, 10);
  doc.text(`Typ: ${type}`, 10, 20);
  doc.text(`Mått: H=${h} mm, B=${w} mm, D=${d} mm`, 10, 30);
  doc.text(`Material: ${mat.toUpperCase()}, Tjocklek: ${wall} mm`, 10, 40);
  doc.text(`Volym: ${volume.toFixed(1)} liter`, 10, 50);
  doc.text(`Frekvensomfång: ${freq}`, 10, 60);

  doc.save("hogtalarkabinett.pdf");
}

function simulateHornResponse(hornLengthMm) {
  const L = hornLengthMm / 1000;
  const c = 343;
  const f1 = Math.round(c / (4 * L));
  return `~${f1} Hz – ${f1 * 5} Hz`;
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
