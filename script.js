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
