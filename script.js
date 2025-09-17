document.addEventListener("DOMContentLoaded", function () {
// Ambil semua api lilin
const flames = document.querySelectorAll(".flame");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Generate confetti
let confettiPieces = [];
function createConfetti() {
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50,
      color: ["red","blue","yellow","white"].sort(() => 0.5 - Math.random())[0],
      tilt: Math.random() * 10 - 10
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.r, p.r);
    ctx.fill();
  });
  updateConfetti();
}

function updateConfetti() {
  confettiPieces.forEach(p => {
    p.y += Math.cos(p.d) + 1;
    p.x += Math.sin(p.d);
    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
  });
}

function startConfetti() {
  createConfetti();
  setInterval(drawConfetti, 20);
  setTimeout(() => {
    alert("Selamat Ulang Tahun yang ke-34 Sayang 🎉❤️");
  }, 2000);
}

// Mic detection super sensitif
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const mic = audioContext.createMediaStreamSource(stream);
  mic.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function detectBlow() {
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    if (volume > 20) { // super sensitif
      flames.forEach(f => f.style.display = "none");
      startConfetti();
    } else {
      requestAnimationFrame(detectBlow);
    }
  }
  detectBlow();
});

