// Materialdensiteter i kg/m³
const materialDensities = {
  mdf: 750,
  plywood: 600,
  hdf: 850
};

const canvas = document.getElementById("hornCanvas");
const ctx = canvas.getContext("2d");

let rotationAngle = 0; // i grader
let isDragging = false;
let lastX = 0;

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  lastX = e.clientX;
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    let deltaX = e.clientX - lastX;
    rotationAngle += deltaX * 0.5; // justera känslighet
    rotationAngle %= 360;
    lastX = e.clientX;
    drawVisualization();
  }
});

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

  // Skydda mot negativa värden vid för stor väggtjocklek
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

  drawVisualization();
}

// Enkel 2D-visualisering i canvas med rotation (vridning horisontellt)
function drawVisualization() {
  const width = parseFloat(document.getElementById("boxWidth").value);
  const height = parseFloat(document.getElementById("boxHeight").value);
  const depth = parseFloat(document.getElementById("boxDepth").value);

  // Rensa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  // Flytta origo till mitten av canvas (för rotation)
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Rotera efter vinkeln
  ctx.rotate((rotationAngle * Math.PI) / 180);

  // Skala ner storleken för att passa canvas, max 300px i bredd/höjd ungefär
  const scale = Math.min(300 / width, 300 / height);

  ctx.scale(scale, scale);

  // Rita "låda" som rektangel: bredd x höjd, och djup indikeras med skuggning på höger sida
  // Djup ritas som parallellogram bredvid rektangeln

  // Basrektangel (frontal vy)
  ctx.fillStyle = "#0071e3"; // Apple-blå
  ctx.strokeStyle = "#004a9f";
  ctx.lineWidth = 0.005; // tunn linje (skalad)

  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  // Djup parallellogram till höger (lite lutande för 3D-känsla)
  const depthOffsetX = depth * 0.6;
  const depthOffsetY = depth * 0.3;

  ctx.beginPath();
  ctx.moveTo(width / 2, -height / 2);
  ctx.lineTo(width / 2 + depthOffsetX, -height / 2 - depthOffsetY);
  ctx.lineTo(width / 2 + depthOffsetX, height / 2 - depthOffsetY);
  ctx.lineTo(width / 2, height / 2);
  ctx.closePath();

  ctx.fillStyle = "#004a9f";
  ctx.fill();
  ctx.stroke();

  // Återställ transformationer
  ctx.restore();
}

// Initial körning för att visa något direkt
updateVisualization();
