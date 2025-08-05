// Materialdensiteter i kg/m³
const materialDensities = {
  mdf: 750,
  plywood: 600,
  hdf: 850
};

// Canvas och context för de tre vyerna
const frontCanvas = document.getElementById("canvasFront");
const sideCanvas = document.getElementById("canvasSide");
const topCanvas = document.getElementById("canvasTop");

const ctxFront = frontCanvas.getContext("2d");
const ctxSide = sideCanvas.getContext("2d");
const ctxTop = topCanvas.getContext("2d");

function updateVisualization() {
  // Läs värden
  const width = parseFloat(document.getElementById("boxWidth").value);
  const height = parseFloat(document.getElementById("boxHeight").value);
  const depth = parseFloat(document.getElementById("boxDepth").value);
  const wall = parseFloat(document.getElementById("wallThickness").value);
  const material = document.getElementById("materialType").value;

  // Volymer i m³
  const outerVolume = (width * height * depth) / 1e9; // mm³ till m³
  const innerWidth = width - 2 * wall;
  const innerHeight = height - 2 * wall;
  const innerDepth = depth - 2 * wall;

  const innerVol = (innerWidth > 0 && innerHeight > 0 && innerDepth > 0) ?
    (innerWidth * innerHeight * innerDepth) / 1e9 : 0;

  const materialVolume = outerVolume - innerVol; // m³
  const materialWeight = materialVolume * materialDensities[material]; // kg

  // Uppdatera text
  document.getElementById("volumeOutput").textContent =
    `Inre volym: ${(innerVol * 1000).toFixed(2)} liter`;
  document.getElementById("materialVolumeOutput").textContent =
    `Materialvolym: ${(materialVolume * 1000).toFixed(2)} liter`;
  document.getElementById("weightOutput").textContent =
    `Materialvikt: ${materialWeight.toFixed(2)} kg`;

  // Rita vyer
  drawFrontView(width, height, wall, ctxFront);
  drawSideView(depth, height, wall, ctxSide);
  drawTopView(width, depth, wall, ctxTop);
}

// Hjälpfunktion för att rita måttlinje med etikett
function drawDimensionLine(ctx, x1, y1, x2, y2, label, offset = 10) {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Pilor i ändarna
  const arrowSize = 5;
  function drawArrow(px, py, angle) {
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - arrowSize * Math.cos(angle - Math.PI / 6), py - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(px - arrowSize * Math.cos(angle + Math.PI / 6), py - arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
  }

  const angle = Math.atan2(y2 - y1, x2 - x1);
  drawArrow(x1, y1, angle + Math.PI);
  drawArrow(x2, y2, angle);

  // Text i mitten
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Offset text lite från linjen
  ctx.fillText(label, mx + offset, my - offset);
}

// Rita frontvy (bredd x höjd)
function drawFrontView(width, height, wall, ctx) {
  const marginTop = 40;  // Ökat avstånd för titel
  const padding = 50;    // Sidomarginal
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  // Skala för att få plats i canvas med marginal
  const margin = 40;
  const scaleX = (cw - 2 * margin) / width;
  const scaleY = (ch - 2 * margin) / height;
  const scale = Math.min(scaleX, scaleY);

  // Lådans yta (ytterstorlek)
  const w = width * scale;
  const h = height * scale;

  // Rita yttre rektangel
  ctx.fillStyle = "#0071e3"; // blå färg
  ctx.fillRect(margin, margin, w, h);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w, h);

  // Rita inre rektangel (innerstorlek)
  const iw = (width - 2 * wall) * scale;
  const ih = (height - 2 * wall) * scale;
  ctx.fillStyle = "#cce0ff"; // ljusare blå
  ctx.fillRect(margin + wall * scale, margin + wall * scale, iw, ih);
  ctx.strokeRect(margin + wall * scale, margin + wall * scale, iw, ih);

  // Måttlinjer
  drawDimensionLine(ctx, margin, margin - 15, margin + w, margin - 15, `${width} mm`, 0);
  drawDimensionLine(ctx, margin - 15, margin, margin - 15, margin + h, `${height} mm`, 0);

  // Tjocklek (horisontell)
  drawDimensionLine(ctx,
    margin + w, margin + 5,
    margin + w, margin + wall * scale + 5,
    `tjocklek ${wall} mm`, 5);

  // Titel
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Topvy (Bredd x Djup)", margin, 20);
}

// Rita sidovy (djup x höjd)
function drawSideView(depth, height, wall, ctx) {
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  const margin = 40;
  const scaleX = (cw - 2 * margin) / depth;
  const scaleY = (ch - 2 * margin) / height;
  const scale = Math.min(scaleX, scaleY);

  const w = depth * scale;
  const h = height * scale;

  // Yttre rektangel
  ctx.fillStyle = "#0071e3";
  ctx.fillRect(margin, margin, w, h);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w, h);

  // Inre rektangel
  const iw = (depth - 2 * wall) * scale;
  const ih = (height - 2 * wall) * scale;
  ctx.fillStyle = "#cce0ff";
  ctx.fillRect(margin + wall * scale, margin + wall * scale, iw, ih);
  ctx.strokeRect(margin + wall * scale, margin + wall * scale, iw, ih);

  // Måttlinjer
  drawDimensionLine(ctx, margin, margin - 15, margin + w, margin - 15, `${depth} mm`, 0);
  drawDimensionLine(ctx, margin - 15, margin, margin - 15, margin + h, `${height} mm`, 0);

  // Tjocklek (vertikal)
  drawDimensionLine(ctx,
    margin + w - 5, margin,
    margin + w - 5, margin + wall * scale,
    `tjocklek ${wall} mm`, 5);

   // Titel
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Topvy (Bredd x Djup)", margin, 20);
}

// Rita topvy (bredd x djup)
function drawTopView(width, depth, wall, ctx) {
  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;
  ctx.clearRect(0, 0, cw, ch);

  const margin = 40;
  const scaleX = (cw - 2 * margin) / width;
  const scaleY = (ch - 2 * margin) / depth;
  const scale = Math.min(scaleX, scaleY);

  const w = width * scale;
  const d = depth * scale;

  // Yttre rektangel
  ctx.fillStyle = "#0071e3";
  ctx.fillRect(margin, margin, w, d);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, w, d);

  // Inre rektangel
  const iw = (width - 2 * wall) * scale;
  const id = (depth - 2 * wall) * scale;
  ctx.fillStyle = "#cce0ff";
  ctx.fillRect(margin + wall * scale, margin + wall * scale, iw, id);
  ctx.strokeRect(margin + wall * scale, margin + wall * scale, iw, id);

  // Måttlinjer
  drawDimensionLine(ctx, margin, margin - 15, margin + w, margin - 15, `${width} mm`, 0);
  drawDimensionLine(ctx, margin - 15, margin, margin - 15, margin + d, `${depth} mm`, 0);

  // Tjocklek (horisontell)
  drawDimensionLine(ctx,
    margin + w, margin + 5,
    margin + w, margin + wall * scale + 5,
    `tjocklek ${wall} mm`, 5);

  // Titel
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Topvy (Bredd x Djup)", margin, 20);
}

// Initiera med att uppdatera visualisering vid sidladdning
updateVisualization();
