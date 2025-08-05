// script.js

const canvas = document.getElementById("hornCanvas");
const ctx = canvas.getContext("2d");

function calculateMaterialWeight(width, height, depth, thickness) {
  const mm3ToM3 = 1e-9;
  const outerVolume = width * height * depth;
  const innerVolume = (width - 2 * thickness) * (height - 2 * thickness) * (depth - 2 * thickness);
  const panelVolume = (outerVolume - innerVolume) * mm3ToM3;
  const plywoodDensity = 700; // kg/m³
  return panelVolume * plywoodDensity;
}

function updateVisualization() {
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const depth = parseInt(document.getElementById("depth").value);
  const thickness = parseInt(document.getElementById("thickness").value);

  // Rensa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Skalning
  const scale = 0.5;
  const x = 50;
  const y = 50;

  // Rita yttermått
  ctx.fillStyle = "#ddd";
  ctx.fillRect(x, y, width * scale, height * scale);

  // Rita inre volym
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + thickness * scale, y + thickness * scale, (width - 2 * thickness) * scale, (height - 2 * thickness) * scale);

  // Rita måttlinjer
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + height * scale + 10);
  ctx.lineTo(x + width * scale, y + height * scale + 10);
  ctx.stroke();

  ctx.font = "14px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(`Bredd: ${width} mm`, x + width * scale / 2 - 40, y + height * scale + 30);
  ctx.fillText(`Höjd: ${height} mm`, x + width * scale + 10, y + height * scale / 2);

  // Beräkna och visa vikt
  const weight = calculateMaterialWeight(width, height, depth, thickness);
  document.getElementById("materialWeight").textContent = `Beräknad materialvikt: ${weight.toFixed(1)} kg`;
}

// Kör en första uppdatering
updateVisualization();
