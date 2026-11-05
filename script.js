const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let drawing = false, rainbow = true, erasing = false, hue = 0, lastPoint = null;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const old = document.createElement('canvas');
  old.width = canvas.width; old.height = canvas.height;
  old.getContext('2d').drawImage(canvas, 0, 0);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (old.width && old.height) ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, rect.width, rect.height);
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function pointFromEvent(e) {
  const r = canvas.getBoundingClientRect();
  return {x:e.clientX-r.left, y:e.clientY-r.top};
}
function startDraw(e) {
  drawing = true; canvas.setPointerCapture(e.pointerId);
  lastPoint = pointFromEvent(e); draw(e);
}
function draw(e) {
  if (!drawing) return;
  const p = pointFromEvent(e);
  ctx.beginPath(); ctx.moveTo(lastPoint.x,lastPoint.y); ctx.lineTo(p.x,p.y);
  ctx.lineWidth = Number(document.getElementById('brushSize').value);
  if (erasing) { ctx.globalCompositeOperation='destination-out'; }
  else {
    ctx.globalCompositeOperation='source-over';
    ctx.strokeStyle = rainbow ? `hsl(${hue}, 95%, 58%)` : '#9b7be8';
    hue = (hue + 3) % 360;
  }
  ctx.stroke(); lastPoint = p;
}
function stopDraw(){drawing=false;lastPoint=null;ctx.globalCompositeOperation='source-over';}
canvas.addEventListener('pointerdown',startDraw);
canvas.addEventListener('pointermove',draw);
canvas.addEventListener('pointerup',stopDraw);
canvas.addEventListener('pointercancel',stopDraw);
document.getElementById('rainbowBtn').addEventListener('click',()=>{
  rainbow=true;erasing=false;document.getElementById('rainbowBtn').classList.add('active');document.getElementById('eraserBtn').classList.remove('active');
});
document.getElementById('eraserBtn').addEventListener('click',()=>{
  erasing=true;document.getElementById('eraserBtn').classList.add('active');document.getElementById('rainbowBtn').classList.remove('active');
});
document.getElementById('clearBtn').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));
document.getElementById('saveBtn').addEventListener('click',()=>{
  const link=document.createElement('a');link.download='miy-malyunok.png';link.href=canvas.toDataURL('image/png');link.click();
});

const compliments=[
  'Ти важлива. Не забувай про це навіть у складні дні. 💗',
  'Твоя турбота робить світ навколо теплішим.',
  'Ти заслуговуєш на відпочинок, радість і добрі слова.',
  'Навіть маленькі твої кроки мають велике значення.',
  'Хтось дуже-дуже радий, що саме ти його мама. ❤️',
  'Тобі не потрібно бути ідеальною, щоб бути чудовою.'
];
const wishes=[
  'Бажаю тобі спокійного дня і приємної несподіванки. 🌷',
  'Нехай сьогодні буде більше приводів для усмішки.',
  'Бажаю чашку смачного чаю, затишку й часу для себе. ☕',
  'Нехай поруч будуть добрі люди, а думки трохи відпочинуть.',
  'Сьогодні дозволь собі зробити щось приємне саме для себе.'
];
function showRandom(id,items){document.getElementById(id).textContent=items[Math.floor(Math.random()*items.length)];}
document.getElementById('complimentBtn').addEventListener('click',()=>showRandom('compliment',compliments));
document.getElementById('wishBtn').addEventListener('click',()=>showRandom('wish',wishes));
document.getElementById('calmBtn').addEventListener('click',()=>showRandom('breathText',[
  'Влаштуйся зручніше, розслаб плечі й дозволь собі хвилинку тиші. 🌿',
  'Подивись у вікно, знайди три приємні дрібниці навколо себе.',
  'Зроби ковток води. Маленька турбота про себе теж важлива.',
  'Увімкни улюблену пісню й побудь кілька хвилин у своєму ритмі.'
]));

let score=0, starTimer=null;
const arena=document.getElementById('starArena');
function spawnStar(){
  arena.innerHTML='';
  const star=document.createElement('button');star.className='star-target';star.textContent='⭐';star.setAttribute('aria-label','Зібрати зірочку');
  star.style.left=`${5+Math.random()*82}%`;star.style.top=`${5+Math.random()*48}%`;
  star.addEventListener('click',()=>{score++;document.getElementById('score').textContent=score;spawnStar();});
  arena.appendChild(star);
}
document.getElementById('starBtn').addEventListener('click',()=>{
  score=0;document.getElementById('score').textContent=score;
  if(starTimer)clearInterval(starTimer);
  spawnStar();starTimer=setInterval(spawnStar,1700);
  setTimeout(()=>{clearInterval(starTimer);starTimer=null;arena.innerHTML='<span style="display:block;text-align:center;padding:30px;color:#d9ccef">Чудово! Ти зібрала '+score+' зірочок ✨</span>';},20000);
});