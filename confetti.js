// confetti.js - draws shapes: heart, square, circle, semicircle in requested colors
const c = document.getElementById('confettiCanvas');
const ctx = c.getContext('2d');
function resize(){
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let pieces = [];
let colors = ['#ff2d55','#0a84ff','#ffffff','#ffd60a']; // red, blue, white, yellow

function rand(min,max){ return Math.random()*(max-min)+min; }
function createPiece(){
  const x = rand(0, c.width);
  const y = -20;
  const vx = rand(-2,2);
  const vy = rand(2,6);
  const size = rand(6,18);
  const color = colors[Math.floor(Math.random()*colors.length)];
  const shape = ['heart','square','circle','semicircle'][Math.floor(Math.random()*4)];
  pieces.push({x,y,vx,vy,size,color,shape,rot:rand(0,Math.PI*2),rotspeed:rand(-0.1,0.1)});
}

function drawHeart(x,y,size,color){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(size/20,size/20);
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.bezierCurveTo(-8, -28, -44, -4, 0, 18);
  ctx.bezierCurveTo(44, -4, 8, -28, 0, -6);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawSemicircle(x,y,size,color){
  ctx.beginPath();
  ctx.arc(x,y,size,Math.PI,2*Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function draw(){
  ctx.clearRect(0,0,c.width,c.height);
  for(let i=pieces.length-1;i>=0;i--){
    const p = pieces[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.rot += p.rotspeed;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    if(p.shape==='circle'){
      ctx.beginPath();
      ctx.arc(0,0,p.size,0,Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else if(p.shape==='square'){
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
    } else if(p.shape==='heart'){
      drawHeart(0,0,p.size,p.color);
    } else if(p.shape==='semicircle'){
      drawSemicircle(0,0,p.size,p.color);
    }
    ctx.restore();
    if(p.y > c.height + 50) pieces.splice(i,1);
  }
  requestAnimationFrame(draw);
}
draw();

function launchConfetti(){
  for(let i=0;i<260;i++) createPiece();
}
window.launchConfetti = launchConfetti;
