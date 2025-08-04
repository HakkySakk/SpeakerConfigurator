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

  // ✅ Korrigerad volymberäkning (från mm³ till liter)
  const volume = ((h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000;
  const materialVol = ((h * w * d - (h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1_000_000).toFixed(1);
  const weight = (materialVol * materialDensities[mat]).toFixed(1); // i kg
  const freq = simulateStandardResponse(volume, type, 30);

  document.getElementById("results").innerHTML = `
    <p><strong>Inre volym:</strong> ${volume.toFixed(1)} liter</p>
    <p><strong>Materialvolym:</strong> ${materialVol} liter</p>
    <p><strong>Vikt:</strong> ${weight} kg</p>
    <p><strong>Simulerat frekvensomfång:</strong> ${freq}</p>
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

function updateHornInfo() {
  const woofers = parseInt(document.getElementById("wooferCountHorn").value);
  const portD = parseInt(document.getElementById("portDiameter").value);
  const portL = parseInt(document.getElementById("portLength").value);

  const portArea = Math.PI * Math.pow(portD / 2, 2) / 100; // cm²
  const portInfo = `Portyta: ${portArea.toFixed(1)} cm², Längd: ${portL} mm`;

  document.getElementById("hornDetails").innerHTML = `
    <p><strong>Element:</strong> ${woofers} st</p>
    <p><strong>Basreflexport:</strong> ${portInfo}</p>
  `;
}

function drawHorn() {
  const canvas = document.getElementById("hornCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const L = parseInt(document.getElementById("hornLength").value); // i mm
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
  drawPressureCurve();

  // Rita hornets väg
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

  // Rita trycknoder och bukar
  const f1 = simulateHornResponseFrequency(L);
  const lambda = 343 / f1; // våglängd i meter
  const hornLengthM = L / 1000;

  const totalPoints = 100;
  const points = [];

  for (let i = 0; i <= totalPoints; i++) {
    const x = i / totalPoints * canvas.width;
    const normX = i / totalPoints * hornLengthM;
    const amplitude = Math.sin((2 * Math.PI * normX) / lambda);
    const y = canvas.height / 2 - amplitude * 40; // amplituden visualiserad

    points.push({ x, y });
  }

  // Rita sinuskurva
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let pt of points) {
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.strokeStyle = "rgba(255, 100, 0, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Färgzoner för högt/lågt tryck
  for (let pt of points) {
    const pressure = (Math.sin((2 * Math.PI * pt.x / canvas.width * hornLengthM) / lambda));
    const alpha = Math.abs(pressure);
    ctx.beginPath();
    ctx.arc(pt.x, canvas.height - 10, 3, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 150, 255, ${alpha})`;
    ctx.fill();
  }

  // Rita punktmarkeringar i hornets väg
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
    <p><strong>Grundresonans:</strong> ~${f1} Hz, våglängd: ${lambda.toFixed(2)} m</p>
  `;
}

function simulateHornResponseFrequency(hornLengthMm) {
  const L = hornLengthMm / 1000;
  const c = 343;
  return Math.round(c / (4 * L));
}
