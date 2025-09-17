// script.js - draws a 3D-ish blackforest cake, 5 crossing candles, mic blow detection (very sensitive),
// candle animation and click fallback. When all candles out -> confetti launch + modal popup.

const canvas = document.getElementById('cakeCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width = 600;
const H = canvas.height = 420;

// candles state
let candles = [true, true, true, true, true]; // five candles
let candlePositions = []; // computed positions
let flameOffsets = new Array(candles.length).fill(0);
let sway = 0;

// modal and confetti
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', ()=> modal.classList.add('hidden'));

// draw cake (blackforest style)
function drawCakeScene(){
  ctx.clearRect(0,0,W,H);

  // background subtle spotlight
  const gBg = ctx.createRadialGradient(W/2, 120, 40, W/2, 120, 500);
  gBg.addColorStop(0,'rgba(255,255,255,0.03)');
  gBg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle = gBg;
  ctx.fillRect(0,0,W,H);

  // table
  ctx.fillStyle = '#2b1f1f';
  roundRect(ctx, 40, 320, W-80, 70, 12, true, false);

  // cake plate
  ctx.fillStyle = '#efe6da';
  ctx.beginPath();
  ctx.ellipse(W/2, 300, 180, 28, 0, 0, Math.PI*2);
  ctx.fill();

  // cake body (3 layers)
  const cakeX = W/2 - 150/2;
  const cakeW = 300;
  // bottom layer (dark chocolate)
  drawCakeLayer(120, 250, cakeW, 80, '#2f1b1b', '#5a2b2b');
  // middle cream
  drawCakeLayer(110, 205, cakeW, 60, '#5a2b2b', '#7b3a3a');
  // top layer (lighter)
  drawCakeLayer(90, 160, cakeW, 50, '#4b2e2e', '#6b3b3b');

  // cherries on top
  for(let i=0;i<5;i++){
    const cx = W/2 - 80 + i*40;
    drawCherry(cx+10, 150);
  }

  // compute candle positions (crossing/slanted across top)
  candlePositions = [];
  for(let i=0;i<5;i++){
    const x = W/2 - 80 + i*40 + (i%2?10:-10);
    const y = 140 - i*2;
    candlePositions.push({x,y});
  }

  // draw candles (crossing style)
  for(let i=0;i<5;i++){
    const pos = candlePositions[i];
    drawCandle(pos.x, pos.y, i, candles[i]);
  }

  // small text under cake
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HBD Cake — Blackforest edition', W/2, 390);
}

function drawCakeLayer(x,y,w,h,color1,color2){
  // body
  const g = ctx.createLinearGradient(0,y,0,y+h);
  g.addColorStop(0,color1);
  g.addColorStop(1,color2);
  roundRect(ctx, x, y, w, h, 18, true, false);
  // top gloss
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, x+6, y+6, w-12, 8, 6, true, false);
  // cream drip
  ctx.fillStyle = '#f6efe9';
  ctx.beginPath();
  ctx.moveTo(x+12,y+h-12);
  for(let i=0;i<6;i++){
    ctx.quadraticCurveTo(x+30+i*40, y+h+10 - ((i%2)*18), x+60+i*40, y+h-12);
  }
  ctx.lineTo(x+w-12,y+h-12);
  ctx.fill();
}

function drawCherry(cx,cy){
  // stem
  ctx.strokeStyle = '#4b2b17';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx,cy-12);
  ctx.quadraticCurveTo(cx-4,cy-28,cx-10,cy-34);
  ctx.stroke();
  // cherry body
  const rg = ctx.createRadialGradient(cx,cy,2,cx,cy,16);
  rg.addColorStop(0,'#ff6b6b');
  rg.addColorStop(1,'#b42d2d');
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.arc(cx,cy,12,0,Math.PI*2);
  ctx.fill();
}

function drawCandle(x,y,index,isLit){
  // candle body (slanted/rotated a bit to appear crossing)
  ctx.save();
  ctx.translate(x+10,y+20);
  const angle = (index-2)*0.12; // different angles to cross
  ctx.rotate(angle + Math.sin(performance.now()/700 + index)*0.02);
  // stripe body
  const grad = ctx.createLinearGradient(-10,-20,10,20);
  grad.addColorStop(0,'#fff');
  grad.addColorStop(1,'#f0f0f0');
  ctx.fillStyle = grad;
  roundRect(ctx, -10, -40, 20, 60, 6, true, false);
  // decorative stripes
  ctx.fillStyle = ['#ffd6d6','#d6f0ff','#fef3c7','#e8d8ff','#ffd7b5'][index%5];
  ctx.fillRect(-10, -40+10, 20, 8);
  // flame
  if(isLit){
    ctx.beginPath();
    const fx = 0 + Math.sin(performance.now()/200 + index)*1.2;
    const fy = -48 + flameOffsets[index];
    ctx.ellipse(fx, fy, 6, 12, 0, 0, Math.PI*2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(fx, fy-4, 3, 6, 0, 0, Math.PI*2);
    ctx.fillStyle = '#ffd86b';
    ctx.fill();
  }
  ctx.restore();
}

// helper roundRect
def_placeholder = True
// continuation of script.js
function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if (typeof r === 'undefined') r=5;
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

// draw loop
function loop(){
  drawCakeScene();
  requestAnimationFrame(loop);
}
loop();

// super-sensitive microphone detection
function initMic(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      function check(){
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for(let i=0;i<data.length;i++) sum += data[i];
        const avg = sum / data.length;
        // VERY sensitive threshold - small puff will trigger
        // debug log (commented): console.log('avg', avg);
        if(avg > 6 && candles.some(c=>c)){
          // extinguish one candle at a time
          for(let i=0;i<candles.length;i++){
            if(candles[i]){ candles[i]=false; break; }
          }
          // small delay to allow redraw & maybe more blows
          if(!candles.some(c=>c)){
            // all out -> confetti + modal
            window.launchConfetti();
            showModal();
          }
        }
        requestAnimationFrame(check);
      }
      check();
    })
    .catch(err=>{
      console.log('Mic not allowed or error', err);
    });
}

// click/tap to extinguish (fallback)
canvas.addEventListener('click', function(e){
  for(let i=0;i<candles.length;i++){
    if(candles[i]){ candles[i]=false; break; }
  }
  if(!candles.some(c=>c)){
    window.launchConfetti();
    showModal();
  }
});

// init mic on user gesture to help browsers allow autoplay
window.addEventListener('click', ()=>{
  if(!window._micStarted){ initMic(); window._micStarted=true; }
}, {once:true});

// small flame jitter offsets updated periodically (visual)
setInterval(()=>{
  for(let i=0;i<flameOffsets.length;i++){
    flameOffsets[i] = (Math.random()*6)-3;
  }
},150);
