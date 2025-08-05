
// script.js

// Materialdata för viktberäkning
const plywoodDensity = 700; // kg/m³ (typiskt för björkplywood)

function calculateMaterialWeight(width, height, depth, thickness) {
  const mm3ToM3 = 1e-9;
  const outerVolume = width * height * depth;
  const innerVolume = (width - 2 * thickness) * (height - 2 * thickness) * (depth - 2 * thickness);
  const panelVolume = (outerVolume - innerVolume) * mm3ToM3; // m³
  return panelVolume * plywoodDensity; // kg
}

function updateVisualization() {
  const width = parseInt(document.getElementById("hornWidth").value);
  const height = parseInt(document.getElementById("hornHeight").value);
  const depth = parseInt(document.getElementById("hornDepth").value);
  const thickness = parseInt(document.getElementById("hornWallThickness").value);

  const weight = calculateMaterialWeight(width, height, depth, thickness);
  document.getElementById("materialWeight").textContent = "Materialvikt: " + weight.toFixed(1) + " kg";

  draw2DBox(width, height, depth, thickness);
}

function draw2DBox(width, height, depth, thickness) {
  const canvas = document.getElementById("visualizationCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;

  const scale = 0.5;
  const x = 100;
  const y = 100;

  ctx.strokeRect(x, y, width * scale, height * scale);
  ctx.strokeRect(x + thickness * scale, y + thickness * scale, (width - 2 * thickness) * scale, (height - 2 * thickness) * scale);
}
