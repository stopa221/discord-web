function dopasujTekstRozciagany(ctx, text, xStart, y, maxWidth, maxFontSize, fontName) {
  let fontSize = maxFontSize;
  ctx.font = `${fontSize}px ${fontName}`;
  
  // Dopasuj wielkość fontu do dostępnej szerokości
  while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${fontName}`;
  }

  // Wycentruj tekst w podanej szerokości
  const textWidth = ctx.measureText(text).width;
  const x = xStart + (maxWidth - textWidth) / 2;

  ctx.fillText(text, x, y);
}

function generujKarte() {
  const imie = document.getElementById('imie').value;
  const ksywka = document.getElementById('ksywka').value;
  const input = document.getElementById('zdjecie');
  const file = input.files[0];

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Ustawienia canvas
  canvas.width = 600;
  canvas.height = 750;

  // Ukrywamy canvas przed wygenerowaniem obrazu
  canvas.style.display = 'none';

  const szablon = new Image();
  szablon.src = 'img/szablon.png';

  szablon.onload = () => {
    ctx.drawImage(szablon, 0, 0, canvas.width, canvas.height);

    // Neonowy styl
    ctx.fillStyle = "000000";
    ctx.shadowColor = "000000";
    ctx.shadowBlur = 8;

    // Teksty dopasowane symetrycznie w 500px przestrzeni od x=135
    dopasujTekstRozciagany(ctx, imie, 5, 464, 278, 17, "Orbitron");
    dopasujTekstRozciagany(ctx, ksywka, 5, 553, 278, 17, "Orbitron");

    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = () => {
          const x = 48;
          const y = 100;
          const width = 230;
          const height = 280;
          const radius = 30;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(img, x, y, width, height);
          ctx.restore();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    // Po wygenerowaniu obrazu, pokaż canvas i przycisk powrotu
    canvas.style.display = 'block';
    document.getElementById('generatedCardContainer').style.display = 'block';
    document.getElementById('inputForm').style.display = 'none';
  };
}

function resetForm() {
// Ukryj wygenerowaną kartę i pokaż formularz do generowania nowej
document.getElementById('generatedCardContainer').style.display = 'none';
document.getElementById('inputForm').style.display = 'block';
document.getElementById('imie').value = '';
document.getElementById('ksywka').value = '';
document.getElementById('zdjecie').value = '';
}
