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
  const weight = (materialVol * materialDensities[mat] / 10000).toFixed(1);
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
  const volume = ((h - 2 * wall) * (w - 2 * wall) * (d - 2 * wall)) / 1000;
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
  const foldW = canvas.width / folds;
  const margin = 20;

  ctx.beginPath();
  ctx.moveTo(margin, margin);
  for (let i = 0; i < folds; i++) {
    const x = (i + 1) * foldW;
    const y = i % 2 === 0 ? canvas.height - margin : margin;
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  for (let i = 0; i <= folds; i++) {
    const x = i * foldW + margin;
    const y = i % 2 === 0 ? margin : canvas.height - margin;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? '#007BFF' : '#FF0000';
    ctx.fill();
  }

  document.getElementById("hornRange").innerText = `Frekvensomfång: ${simulateHornResponse(L)}`;
}
