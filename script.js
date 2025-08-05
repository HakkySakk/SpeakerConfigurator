// Materialdensiteter i kg/m³
const materialDensities = {
  mdf: 750,
  plywood: 600,
  hdf: 850
};

function drawHorn() {
  const height = parseInt(document.getElementById("hornHeight").value);
  const width = parseInt(document.getElementById("hornWidth").value);
  const depth = parseInt(document.getElementById("hornDepth").value);
  const wall = parseInt(document.getElementById("hornWallThickness").value);
  const material = document.getElementById("hornMaterialType").value;
  const wooferCount = parseInt(document.getElementById("wooferCountHorn").value);
  const hornLength = parseInt(document.getElementById("hornLength").value);
  const folds = parseInt(document.getElementById("folds").value);

  const outerVolume = (height * width * depth) / 1_000_000;
  const innerVolume = ((height - 2 * wall) * (width - 2 * wall) * (depth - 2 * wall)) / 1_000_000;
  const materialVolume = outerVolume - innerVolume;
  const materialDensity = materialDensities[material];
  const weight = (materialVolume * materialDensity).toFixed(1);

  const L = hornLength / 1000;
  const c = 343;
  const f1 = Math.round(c / (4 * L));
  const freqRange = `~${f1} Hz – ${f1 * 5} Hz`;

  document.getElementById("hornDetails").innerHTML = `
    <p><strong>Inre volym:</strong> ${(innerVolume * 1000).toFixed(1)} liter</p>
    <p><strong>Materialvolym:</strong> ${(materialVolume * 1000).toFixed(1)} liter</p>
    <p><strong>Vikt:</strong> ${weight} kg</p>
    <p><strong>Frekvensomfång:</strong> ${freqRange}</p>
    <p><strong>Element:</strong> ${wooferCount} st</p>
    <p><strong>Hornlängd:</strong> ${hornLength} mm (${folds} veck)</p>
  `;

  draw2DVisual(width, height, depth, wall, folds);
}

function draw2DVisual(width, height, depth, wall, folds) {
  const canvas = document.getElementById("canvas2D");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 0.5;
  const w = width * scale;
  const h = height * scale;
  const d = depth * scale;
  const margin = 40;

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w, h);

  ctx.fillStyle = "#ccc";
  ctx.fillRect(margin + wall * scale, margin + wall * scale, w - 2 * wall * scale, h - 2 * wall * scale);

  const foldHeight = h / (folds + 1);
  ctx.strokeStyle = "blue";
  for (let i = 1; i <= folds; i++) {
    let y = margin + i * foldHeight;
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(margin + w, y);
    ctx.stroke();
  }

  ctx.fillStyle = "black";
  ctx.font = "12px sans-serif";
  ctx.fillText(`Bredd: ${width} mm`, margin, margin + h + 15);
  ctx.fillText(`Höjd: ${height} mm`, margin + w + 10, margin + h / 2);
}
