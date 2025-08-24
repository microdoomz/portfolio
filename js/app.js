// Performance-focused interactions & animations
// Uses requestAnimationFrame batching & passive listeners where helpful

(function(){
  const yearEl=document.getElementById('year'); if(yearEl) yearEl.textContent=new Date().getFullYear();

  /* Subtle scramble */
  const scrambleEl=document.getElementById('scramble');
  if(scrambleEl){
    const final=scrambleEl.dataset.final||scrambleEl.textContent.trim();
    const glyphs='ᚠᚢᚦᚨᚱᚲᛃᛇᛰΔΞΦΨΩЖЯ₿01<>#░▒▓';
    let frame=0;const total=22;function run(){
      let out='';
      for(let i=0;i<final.length;i++){
        const p=frame/total; if(final[i]===' '){out+=' ';continue;}
        if(p>0.7 && Math.random()<p){out+=final[i];}
        else if(frame>=total) out+=final[i];
        else out+=glyphs[(i+frame+Math.floor(Math.random()*glyphs.length))%glyphs.length];
      }
      scrambleEl.textContent=out; frame++; if(frame<=total+4) requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
  }

  /* Intersection reveal */
  const revealEls=[...document.querySelectorAll('.section .card,.project,.exp-item,.edu,.social,.contact-card,.tag,.skill')];
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}})},{threshold:0.12,rootMargin:'0px 0px -40px'});
  revealEls.forEach(el=>{el.classList.add('reveal');io.observe(el);});

  /* Email + phone (entire card clickable) */
  const emailCard=document.querySelector('.connect-card.email-card') || document.getElementById('emailCard');
  if(emailCard){emailCard.addEventListener('click',()=>{
    const email='junaidmohammad232@gmail.com';
    const subject=encodeURIComponent("Hello Mohammed! Let's connect");
    const body=encodeURIComponent('Hi Mohammed,\n\nI came across your portfolio and would love to discuss potential opportunities.\n\nBest regards,');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,'_blank','noopener');
  },{passive:true});}
  const phoneCard=document.querySelector('.connect-card.phone-card') || document.getElementById('phoneCard');
  const phoneMasked=document.getElementById('phoneMasked');
  const phoneReveal=document.getElementById('phoneReveal');
  if(phoneCard && phoneMasked && phoneReveal){
    phoneCard.addEventListener('click',()=>{
      if(phoneReveal.dataset.revealed) return; // already revealed
      phoneMasked.classList.add('revealed');
      phoneReveal.textContent='+91 7338008715';
      phoneReveal.classList.add('show');
      phoneReveal.dataset.revealed='1';
      phoneReveal.setAttribute('aria-hidden','false');
    },{passive:true});
  }

  /* Adaptive nav active state */
  const navLinks=[...document.querySelectorAll('.nav-link')];
  const sections=[...document.querySelectorAll('section[id],header#home')];
  function setActive(){
    const y=window.scrollY+140; let current;
    for(const s of sections){ if(y>=s.offsetTop && y < s.offsetTop + s.offsetHeight){ current=s.id; break;} }
    navLinks.forEach(l=>{l.classList.toggle('active', l.getAttribute('href') === '#' + current);});
  }
  window.addEventListener('scroll',()=>requestAnimationFrame(setActive),{passive:true});
  setActive();

  /* Space starfield with shooting stars responsive to cursor */
  const canvas=document.getElementById('fxCanvas');
  if(canvas){
    const ctx=canvas.getContext('2d');
    let w=canvas.width=window.innerWidth, h=canvas.height=window.innerHeight;
    window.addEventListener('resize',()=>{w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;initStars();},{passive:true});
    const starCount=320; let stars=[]; const shootingStars=[]; const pointer={x:w/2,y:h/2};
    window.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;},{passive:true});
    function initStars(){stars=new Array(starCount).fill(0).map(()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*w,px:0,py:0,s:0}));}
    function spawnShooter(){shootingStars.push({x:Math.random()*w,y:Math.random()*h*0.35,dx:-2-Math.random()*1.5,dy:0.4+Math.random()*0.8,len:100+Math.random()*80,life:0,max:240});}
    let lastSpawn=0; initStars();

    // Interactive satellite (simple sprite) in corner
  const sat={x:w-140,y:130,vx:0,vy:0,angle:0,spin:0.002,dragging:false,lastPX:0,lastPY:0};
  const sun={x:140,y:h-160,vx:0,vy:0,r:78,heat:0,dragging:false};
  function resetSatellitePosition(){sat.x=w-140; sat.y=130; if(!sun.dragging){sun.x=140; sun.y=h-160;} }
    window.addEventListener('resize',resetSatellitePosition,{passive:true});
    let pointerDown=false; let lastPointer={x:pointer.x,y:pointer.y};
  window.addEventListener('pointerdown',e=>{pointerDown=true; lastPointer.x=e.clientX; lastPointer.y=e.clientY; const dx=e.clientX-sat.x, dy=e.clientY-sat.y; const ds=e.clientX-sun.x, es=e.clientY-sun.y; if(Math.hypot(dx,dy)<90){sat.dragging=true; document.body.classList.add('dragging-interactive');} else if(Math.hypot(ds,es)<sun.r+10){sun.dragging=true; document.body.classList.add('dragging-interactive');}}
    ,{passive:true});
  window.addEventListener('pointerup',e=>{pointerDown=false; if(sat.dragging){sat.dragging=false;} if(sun.dragging){sun.dragging=false;} document.body.classList.remove('dragging-interactive'); lastPointer.x=e.clientX; lastPointer.y=e.clientY;}
    ,{passive:true});
  // Removed pointer velocity tracking; objects only move when dragged.

    function updateSatellite(){
      const anchorX=w-140, anchorY=130;
      if(sat.dragging){
        sat.x += (pointer.x - sat.x)*0.35;
        sat.y += (pointer.y - sat.y)*0.35;
        sat.angle += sat.spin * 24;
      } else {
        // smoothly return to anchor
        sat.x += (anchorX - sat.x)*0.08;
        sat.y += (anchorY - sat.y)*0.08;
        sat.angle += sat.spin * 4;
      }
    }

    function updateSun(){
      const anchorX=140, anchorY=h-160;
      if(sun.dragging){
        sun.x += (pointer.x - sun.x)*0.30;
        sun.y += (pointer.y - sun.y)*0.30;
        sun.heat = 1;
      } else {
        sun.x += (anchorX - sun.x)*0.07;
        sun.y += (anchorY - sun.y)*0.07;
        sun.heat *= 0.97;
      }
    }

    function drawSun(ctx){
      ctx.save(); ctx.translate(sun.x,sun.y);
      const grad=ctx.createRadialGradient(0,0,10,0,0,sun.r);
      grad.addColorStop(0,'rgba(255,160,90,1)');
      grad.addColorStop(0.5,'rgba(255,50,30,0.9)');
      grad.addColorStop(0.8,'rgba(180,0,0,0.55)');
      grad.addColorStop(1,'rgba(120,0,0,0)');
      ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,sun.r,0,Math.PI*2); ctx.fill();
      // flares
      const flareCount=6; const time=performance.now()*0.001; ctx.globalCompositeOperation='lighter';
      for(let i=0;i<flareCount;i++){
        const ang=time*0.2 + i*Math.PI*2/flareCount;
        const r=sun.r*(0.65 + 0.08*Math.sin(time*2 + i));
        ctx.beginPath(); ctx.ellipse(Math.cos(ang)*r*0.25,Math.sin(ang)*r*0.25,r*0.55,r*0.18,ang,0,Math.PI*2);
        ctx.fillStyle='rgba(255,'+(120+Math.sin(time+i)*80|0)+','+(70+Math.sin(time*1.5+i)*50|0)+',0.35)'; ctx.fill();
      }
      ctx.globalCompositeOperation='source-over';
      // highlight ring when dragging
      if(sun.dragging){ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,sun.r*0.7,0,Math.PI*2); ctx.stroke();}
      ctx.restore();
    }

    function drawSatellite(ctx){
      ctx.save();
      ctx.translate(sat.x, sat.y); ctx.rotate(sat.angle);
      // glow
      const gradient=ctx.createRadialGradient(0,0,10,0,0,70); gradient.addColorStop(0,'rgba(120,170,255,0.35)'); gradient.addColorStop(1,'rgba(120,170,255,0)');
      ctx.fillStyle=gradient; ctx.beginPath(); ctx.arc(0,0,60,0,Math.PI*2); ctx.fill();
      // body
      ctx.fillStyle='#1b2c46'; ctx.strokeStyle='#8ecbff'; ctx.lineWidth=2.2; ctx.beginPath(); ctx.roundRect(-26,-18,52,36,8); ctx.fill(); ctx.stroke();
      // window
      ctx.fillStyle='#2f4c72'; ctx.beginPath(); ctx.roundRect(-14,-10,28,20,6); ctx.fill();
      // solar panels
      ctx.fillStyle='#27405f'; ctx.strokeStyle='#6fb7ff';
      ctx.beginPath(); ctx.roundRect(-70,-14,32,28,4); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(38,-14,32,28,4); ctx.fill(); ctx.stroke();
      // panel lines
      ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1;
      for(let i=-56;i<=-42;i+=7){ctx.beginPath(); ctx.moveTo(i,-14); ctx.lineTo(i,14); ctx.stroke();}
      for(let i=56;i>=42;i-=7){ctx.beginPath(); ctx.moveTo(i,-14); ctx.lineTo(i,14); ctx.stroke();}
      // antenna
      ctx.strokeStyle='#9fd4ff'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,18); ctx.lineTo(0,36); ctx.stroke(); ctx.beginPath(); ctx.arc(0,42,6,0,Math.PI*2); ctx.fillStyle='#4da6ff'; ctx.fill();
      // highlight when dragging
      if(sat.dragging){ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(0,0,46,0,Math.PI*2); ctx.stroke();}
      ctx.restore();
    }
    // Light-mode floating dust & leaves
    const dust=[]; const dustCount=90; const leaves=[]; const leafCount=12; let dustInit=false;
    function initAtmos(){
      if(dustInit) return; dustInit=true;
      for(let i=0;i<dustCount;i++) dust.push({x:Math.random()*w,y:Math.random()*h,z:Math.random(),r:0.6+Math.random()*1.3,vy:0.1+Math.random()*0.25,vx:(Math.random()*0.2)-0.1,phase:Math.random()*Math.PI*2});
      for(let i=0;i<leafCount;i++) leaves.push({x:Math.random()*w,y:Math.random()*h*0.6,z:Math.random(),w:14+Math.random()*10,h:8+Math.random()*6,vy:0.3+Math.random()*0.4,rx:Math.random()*Math.PI*2,ry:Math.random()*Math.PI*2,spin:0.005+Math.random()*0.01,color:Math.random()>0.5?'#8fbf5a':'#d2b55b'});
    }
    function updateAtmos(){
      if(!document.body.classList.contains('light')) return; initAtmos();
      for(const p of dust){p.phase+=0.01;p.x+=p.vx + (pointer.x - w/2)*0.00002;p.y+=p.vy + Math.sin(p.phase)*0.05; if(p.y>h){p.y=-10; p.x=Math.random()*w;} if(p.x<-20) p.x=w+10; if(p.x>w+20) p.x=-10;}
      for(const l of leaves){l.ry+=l.spin; l.rx+=l.spin*0.6; l.x += (pointer.x - w/2)*0.00015 + Math.sin(l.ry)*0.3; l.y += l.vy + Math.sin(l.rx*2)*0.15; if(l.y>h+40){l.y=-20; l.x=Math.random()*w;}
        if(l.x<-40) l.x=w+30; if(l.x>w+40) l.x=-30;}
    }
    function drawAtmos(ctx){
      if(!document.body.classList.contains('light')) return; ctx.save();
      // dust
      for(const p of dust){ctx.globalAlpha=0.15 + p.z*0.35; ctx.fillStyle='#233d66'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(0.8+p.z*0.6),0,Math.PI*2); ctx.fill();}
      ctx.globalAlpha=1;
      // leaves
      for(const l of leaves){ctx.save(); ctx.translate(l.x,l.y); ctx.rotate(l.ry); const grad=ctx.createLinearGradient(-l.w/2,0,l.w/2,0); grad.addColorStop(0,l.color); grad.addColorStop(1,'#ffffff'); ctx.fillStyle=grad; ctx.beginPath(); ctx.ellipse(0,0,l.w,l.h*0.6,0,0,Math.PI*2); ctx.fill(); ctx.restore();}
      ctx.restore();
    }

    function frame(t){
      ctx.fillStyle='#04070f';ctx.fillRect(0,0,w,h);
      const cx=w/2, cy=h/2; // starfield warp center influenced by pointer
      const targetX = pointer.x; const targetY = pointer.y;
      for(const star of stars){
        star.z -= 2; if(star.z<=1){star.x=Math.random()*w;star.y=Math.random()*h;star.z=w;}
        const k=128/star.z;
        const depthFactor = (1 - star.z / w); // nearer stars respond more
        const sx=(star.x-cx)*k + cx + (targetX-cx)*0.07*(0.4 + depthFactor*0.9);
        const sy=(star.y-cy)*k + cy + (targetY-cy)*0.07*(0.4 + depthFactor*0.9);
        if(star.px!==0){
          ctx.strokeStyle='rgba(255,255,255,0.5)';
          ctx.lineWidth=star.s; ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(star.px,star.py); ctx.stroke();
        }
        star.px=sx; star.py=sy; star.s = (1 - star.z / w)*2.2;
      }
  // Shooting stars
      if(t-lastSpawn>3500+Math.random()*4000 && shootingStars.length<2){spawnShooter(); lastSpawn=t;}
      for(let i=shootingStars.length-1;i>=0;i--){const s=shootingStars[i];
        s.x+=s.dx; s.y+=s.dy; s.life++;
        ctx.strokeStyle='rgba(120,180,255,0.85)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.len,s.y-s.len*0.2); ctx.stroke();
        if(s.life> s.max || s.y>h+100 || s.x<-200) shootingStars.splice(i,1);
      }
      // If light mode: overlay sky gradient & particles
      if(document.body.classList.contains('light')){
        // soft blue overlay adjusting with sun position
        const skyGrad=ctx.createLinearGradient(0,0,0,h);
        skyGrad.addColorStop(0,'#dfe9f8');
        skyGrad.addColorStop(1,'#eef3fa');
        ctx.fillStyle=skyGrad; ctx.fillRect(0,0,w,h);
      }

  // Space objects update & render
  updateSatellite();
  updateSun();
  drawSun(ctx);
  drawSatellite(ctx);
  updateAtmos();
  drawAtmos(ctx);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Reduced hover scaling listener (CSS handles most) for accessibility optional scaling preference */
  const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq.matches){document.documentElement.classList.add('reduce-motion');}

  /* Theme Toggle */
  const themeBtn=document.getElementById('themeToggle');
  const storedTheme=localStorage.getItem('theme');
  if(storedTheme==='light'){document.body.classList.add('light'); if(themeBtn) themeBtn.textContent='🌑';}
  function toggleTheme(){
    const light=document.body.classList.toggle('light');
    themeBtn.textContent=light?'🌑':'🌙';
    if(light){document.body.classList.add('day-bg');} else {document.body.classList.remove('day-bg');}
    const starCanvas=document.getElementById('fxCanvas');
    if(starCanvas){starCanvas.style.display=light?'none':'block';}
    localStorage.setItem('theme',light?'light':'dark');
  }
  themeBtn&&themeBtn.addEventListener('click',toggleTheme);

})();
