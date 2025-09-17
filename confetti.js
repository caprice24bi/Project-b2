const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiPieces = [];

function ConfettiPiece(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = Math.random() * 6 + 4;
  this.speedY = Math.random() * 3 + 2;
  this.speedX = (Math.random() - 0.5) * 2;
}

function launchConfetti() {
  for (let i = 0; i < 200; i++) {
    let x = Math.random() * confettiCanvas.width;
    let y = -10;
    let colors = ["#ff4081", "#ffb347", "#87cefa", "#77dd77", "#cba6f7"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    confettiPieces.push(new ConfettiPiece(x, y, color));
  }
}

function drawConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (let i = 0; i < confettiPieces.length; i++) {
    let p = confettiPieces[i];
    confettiCtx.beginPath();
    confettiCtx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fill();
    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y > confettiCanvas.height) {
      confettiPieces.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(drawConfetti);
}
drawConfetti();
