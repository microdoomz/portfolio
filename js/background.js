// Dynamic flowing glassy particle field using canvas
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w,h,particles=[];const COUNT=120;
function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight}
window.addEventListener('resize',resize);resize();
function init(){particles=[];for(let i=0;i<COUNT;i++){particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.6,dx:(Math.random()-.5)*0.25,dy:(Math.random()-.5)*0.25,alpha:Math.random()*0.6+0.2})}}
init();
function gradient(){const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#0a1931');g.addColorStop(1,'#04101d');return g}
let tick=0;
function animate(){ctx.clearRect(0,0,w,h);ctx.fillStyle=gradient();ctx.globalAlpha=0.55;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
  // subtle blobs
  for(let i=0;i<7;i++){
    const t=(tick/600)+(i*9);
    const x=(Math.sin(t*1.3+i)*0.5+0.5)*w;
    const y=(Math.cos(t*1.1+i*1.7)*0.5+0.5)*h;
    const r=180+Math.sin(t*2.2+i)*90;
    const grd=ctx.createRadialGradient(x,y,0,x,y,r);
    grd.addColorStop(0,'rgba(70,160,255,0.17)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grd;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  // particles
  particles.forEach(p=>{p.x+=p.dx;p.y+=p.dy;if(p.x<0)p.x=w;else if(p.x>w)p.x=0;if(p.y<0)p.y=h;else if(p.y>h)p.y=0;ctx.beginPath();ctx.fillStyle='rgba(140,200,255,'+p.alpha+')';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();});
  tick++;requestAnimationFrame(animate);
}
animate();
