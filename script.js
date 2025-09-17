const canvas = document.getElementById("cake");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let candlesLit = [true, true, true, true, true];

function drawCake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // cake base
  ctx.fillStyle = "#ffcccb";
  ctx.fillRect(100, 250, 200, 100);
  ctx.fillStyle = "#ffe4b5";
  ctx.fillRect(100, 220, 200, 40);

  // candles
  const startX = 120;
  for (let i = 0; i < 5; i++) {
    const x = startX + i * 40;
    ctx.fillStyle = "#87cefa";
    ctx.fillRect(x, 180, 20, 40);

    if (candlesLit[i]) {
      ctx.beginPath();
      ctx.ellipse(x+10, 170, 8, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "orange";
      ctx.fill();
    }
  }
}

drawCake();

// microphone input
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const mic = audioContext.createMediaStreamSource(stream);
    mic.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(data);
      let values = 0;
      for (let i = 0; i < data.length; i++) values += data[i];
      let average = values / data.length;
      if (average > 30 && candlesLit.some(l => l)) {
        // blow out one candle at a time
        for (let i = 0; i < candlesLit.length; i++) {
          if (candlesLit[i]) {
            candlesLit[i] = false;
            break;
          }
        }
        drawCake();
        if (!candlesLit.some(l => l)) {
          launchConfetti();
        }
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  })
  .catch(function(err) {
    console.log("Mic not allowed", err);
  });
