<script>
    // Navigation toggling between sections
    function showSection(section) {
      const btnStandard = document.getElementById('btnStandard');
      const btnHorn = document.getElementById('btnHorn');
      const standardSection = document.getElementById('standardSection');
      const hornSection = document.getElementById('hornSection');

      if (section === 'standard') {
        btnStandard.classList.add('active');
        btnHorn.classList.remove('active');
        standardSection.classList.remove('hidden');
        hornSection.classList.add('hidden');
      } else {
        btnHorn.classList.add('active');
        btnStandard.classList.remove('active');
        hornSection.classList.remove('hidden');
        standardSection.classList.add('hidden');
      }
    }

    // Standard volume calculation
    function calculateVolume() {
      const height = Number(document.getElementById('height').value);
      const width = Number(document.getElementById('width').value);
      const depth = Number(document.getElementById('depth').value);
      const wall = Number(document.getElementById('wallThickness').value);

      const innerHeight = height - wall * 2;
      const innerWidth = width - wall * 2;
      const innerDepth = depth - wall * 2;

      if (innerHeight <= 0 || innerWidth <= 0 || innerDepth <= 0) {
        alert('Väggtjockleken är för stor för dimensionerna.');
        return;
      }

      const volume = (innerHeight * innerWidth * innerDepth) / 1000000; // i liter

      const resultDiv = document.getElementById('results');
      resultDiv.textContent = `Inre volym: ${volume.toFixed(2)} liter`;
    }

    // Folded horn visualisering
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

      // Visa hornets dimensioner i text
      const details = document.getElementById('hornDetails');
      details.innerHTML = `
        <p>Dimensioner (HxBxD): ${height} x ${width} x ${depth} mm</p>
        <p>Väggtjocklek: ${wall} mm</p>
        <p>Antal veck: ${folds}</p>
        <p>Hornets längd: ${hornLength} mm</p>
      `;
    }

    // Export till PDF - placeholder
    function exportToPDF() {
      alert('Export till PDF är ännu inte implementerat.');
    }
  </script>
</body>
</html>
