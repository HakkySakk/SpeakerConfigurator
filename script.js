const plywoodDensity = 700; // kg/m³

function updateVisualization() {
  const width = parseInt(document.getElementById("widthInput").value);
  const height = parseInt(document.getElementById("heightInput").value);
  const depth = parseInt(document.getElementById("depthInput").value);
  const wall = parseInt(document.getElementById("wallInput").value);
  const ctx = document.getElementById("hornCanvas").getContext("2d");

  // Rensa canvas
  ctx.clearRect(0, 0, 500, 500);

  // Skala så att 1 mm = 0.5 px (ungefär)
  const scale = 0.5;

  // Rita ytterlådan
  ctx.fillStyle = "#888";
  ctx.fillRect(50, 50, width * scale, depth * scale);

  // Rita innerlådan
  ctx.fillStyle = "#fff";
  ctx.fillRect(50 + wall * scale, 50 + wall * scale, (width - 2 * wall) * scale, (depth - 2 * wall) * scale);

  // Räkna ut vikt
  const outerVolume = width * height * depth;
  const innerVolume = (width - 2 * wall) * (height - 2 * wall) * (depth - 2 * wall);
  const panelVolume = (outerVolume - innerVolume) * 1e-9; // m³
  const weight = panelVolume * plywoodDensity;

  document.getElementById("materialWeight").textContent = `Materialvikt: ${weight.toFixed(1)} kg`;
}