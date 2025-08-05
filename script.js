document.addEventListener("DOMContentLoaded", () => {
  const densities = {
    plywood: 700,
    mdf: 750,
    hdf: 850
  };

  document.getElementById("calculateBtn").onclick = updateVisualization;

  function updateVisualization() {
    const width = parseInt(document.getElementById("hornWidth").value);
    const height = parseInt(document.getElementById("hornHeight").value);
    const depth = parseInt(document.getElementById("hornDepth").value);
    const thickness = parseInt(document.getElementById("hornThickness").value);
    const material = document.getElementById("hornMaterial").value;

    const outerVolume = width * height * depth;
    const innerVolume = (width - 2 * thickness) * (height - 2 * thickness) * (depth - 2 * thickness);
    const panelVolume = (outerVolume - innerVolume) * 1e-9;
    const weight = panelVolume * densities[material];

    document.getElementById("output").innerHTML = `
      <p><strong>Materialvolym:</strong> ${(panelVolume * 1000).toFixed(1)} liter</p>
      <p><strong>Beräknad vikt:</strong> ${weight.toFixed(1)} kg</p>
    `;

    draw2DBox(width, height, thickness);
  }

  function draw2DBox(width, height, thickness) {
    const canvas = document.getElementById("hornCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 0.5;
    const offsetX = 50;
    const offsetY = 50;

    // Yttre rektangel
    ctx.strokeStyle = "#000";
    ctx.strokeRect(offsetX, offsetY, width * scale, height * scale);

    // Inre rektangel (visar väggtjocklek)
    ctx.strokeStyle = "#888";
    ctx.strokeRect(offsetX + thickness * scale, offsetY + thickness * scale,
                   (width - 2 * thickness) * scale, (height - 2 * thickness) * scale);
  }
});
