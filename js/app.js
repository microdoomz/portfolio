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
    const starCount=320; let stars=[]; const shootingStars=[]; const pointer={x:w/2,y:h/2,vx:0,vy:0,speed:0};
    let lastMoveT=performance.now();
    window.addEventListener('pointermove',e=>{
      const now=performance.now();
      const dt=Math.max(16, now-lastMoveT);
      const nx=e.clientX, ny=e.clientY;
      pointer.vx=(nx-pointer.x)/(dt/16);
      pointer.vy=(ny-pointer.y)/(dt/16);
      pointer.speed=Math.hypot(pointer.vx,pointer.vy);
      pointer.x=nx; pointer.y=ny; lastMoveT=now;
    },{passive:true});
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
      const light=document.body.classList.contains('light');
      // In light mode airplane (sat) sits bottom-left; dark mode satellite top-right
      const anchorX= light ? 140 : w-140;
      const anchorY= light ? h-160 : 130;
      if(sat.dragging){
        sat.x += (pointer.x - sat.x)*0.35;
        sat.y += (pointer.y - sat.y)*0.35;
        sat.angle += sat.spin * 24;
      } else {
        const ease=0.045;
        sat.x += (anchorX - sat.x)*ease;
        sat.y += (anchorY - sat.y)*ease;
        sat.angle += sat.spin * 4;
      }
    }

    function updateSun(){
      const light=document.body.classList.contains('light');
      // In light mode sun sits top-right; dark mode bottom-left
      const anchorX= light ? w-160 : 140;
      const anchorY= light ? 140 : h-160;
      if(sun.dragging){
        sun.x += (pointer.x - sun.x)*0.30;
        sun.y += (pointer.y - sun.y)*0.30;
        sun.heat = 1;
      } else {
        const ease=0.05;
        sun.x += (anchorX - sun.x)*ease;
        sun.y += (anchorY - sun.y)*ease;
        sun.heat *= 0.97;
      }
    }

    function drawSun(ctx){
      ctx.save(); ctx.translate(sun.x,sun.y);
      const isLight=document.body.classList.contains('light');
      const baseR=sun.r*(isLight?0.85:1);
      if(isLight){
        // Round yellow sun with soft radial rays (no sharp spikes)
        const grad=ctx.createRadialGradient(0,0,8,0,0,baseR);
        grad.addColorStop(0,'#fff7c2');
        grad.addColorStop(0.4,'#ffe380');
        grad.addColorStop(0.7,'rgba(255,190,40,0.85)');
        grad.addColorStop(1,'rgba(255,170,0,0)');
        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,baseR,0,Math.PI*2); ctx.fill();
        const time=performance.now()*0.001;
        ctx.globalCompositeOperation='lighter';
        // layered soft ring rays + subtle directional spikes
        for(let ring=0; ring<3; ring++){
          const ringR = baseR* (1.05 + ring*0.22 + Math.sin(time*1.3 + ring)*0.02);
          const alpha = 0.28 - ring*0.085 + sun.heat*0.16;
          const ringGrad=ctx.createRadialGradient(0,0, baseR*0.25, 0,0, ringR);
          ringGrad.addColorStop(0,'rgba(255,248,205,'+ (alpha+0.15) +')');
          ringGrad.addColorStop(0.55,'rgba(255,235,160,'+ alpha*0.7 +')');
          ringGrad.addColorStop(1,'rgba(255,215,100,0)');
          ctx.beginPath(); ctx.fillStyle=ringGrad; ctx.arc(0,0,ringR,0,Math.PI*2); ctx.fill();
        }
        ctx.globalCompositeOperation='source-over';
      } else {
        const grad=ctx.createRadialGradient(0,0,10,0,0,sun.r);
        grad.addColorStop(0,'rgba(255,160,90,1)');
        grad.addColorStop(0.5,'rgba(255,50,30,0.9)');
        grad.addColorStop(0.8,'rgba(180,0,0,0.55)');
        grad.addColorStop(1,'rgba(120,0,0,0)');
        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,sun.r,0,Math.PI*2); ctx.fill();
        const flareCount=6; const time=performance.now()*0.001; ctx.globalCompositeOperation='lighter';
        for(let i=0;i<flareCount;i++){
          const ang=time*0.2 + i*Math.PI*2/flareCount;
            const r=sun.r*(0.65 + 0.08*Math.sin(time*2 + i));
            ctx.beginPath(); ctx.ellipse(Math.cos(ang)*r*0.25,Math.sin(ang)*r*0.25,r*0.55,r*0.18,ang,0,Math.PI*2);
            ctx.fillStyle='rgba(255,'+(120+Math.sin(time+i)*80|0)+','+(70+Math.sin(time*1.5+i)*50|0)+',0.35)'; ctx.fill();
        }
        ctx.globalCompositeOperation='source-over';
      }
      if(sun.dragging){ctx.strokeStyle='rgba(255,255,255,0.8)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,baseR*0.8,0,Math.PI*2); ctx.stroke();}
      ctx.restore();
      // Update CSS vars for glass reflection in light mode
      if(document.body.classList.contains('light')){
        const sx=(sun.x/window.innerWidth).toFixed(4);
        const sy=(sun.y/window.innerHeight).toFixed(4);
        document.documentElement.style.setProperty('--sun-x',sx);
        document.documentElement.style.setProperty('--sun-y',sy);
      }
    }

  function drawSatellite(ctx){
      if(document.body.classList.contains('light')){
  // Fighter jet side profile (light mode)
  ctx.save();
  ctx.translate(sat.x, sat.y);
  // slight bob for life
  const t = performance.now()*0.001;
  const bob = Math.sin(t*2.2)*2.2;
  ctx.translate(0,bob);
  // base upward angle + small oscillation
  const pitchBase = -0.18; // nose up
  const pitchOsc = sat.dragging ? Math.sin(t*6)*0.07 : 0.02*Math.sin(t*1.3);
  ctx.rotate(pitchBase + pitchOsc);
  const scale=0.6; ctx.scale(scale,scale); // further reduced size
  // shadow ellipse
  ctx.globalAlpha=0.22; ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(10,38,74,14,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  // main fuselage silhouette path (stylized modern jet)
  ctx.beginPath();
  ctx.moveTo(-140,0);              // tail start
  ctx.lineTo(-118,-10);            // tail upper
  ctx.lineTo(-70,-14);             // aft upper
  ctx.lineTo(40,-20);              // spine forward
  ctx.quadraticCurveTo(96,-24,130,-12); // nose upper curve
  ctx.quadraticCurveTo(108,-4,106,0);   // nose tip slight indent
  ctx.quadraticCurveTo(108,4,130,12);   // nose lower curve
  ctx.quadraticCurveTo(92,4,38,10);     // lower forward fuselage
  ctx.lineTo(-66,18);             // aft lower
  ctx.lineTo(-118,12);            // tail lower
  ctx.closePath();
  const bodyGrad=ctx.createLinearGradient(-140,0,140,0);
  bodyGrad.addColorStop(0,'#3b4b5a');
  bodyGrad.addColorStop(0.5,'#60727f');
  bodyGrad.addColorStop(1,'#2d3a45');
  ctx.fillStyle=bodyGrad; ctx.fill();
  // canopy
  ctx.beginPath();
  ctx.moveTo(10,-12);
  ctx.quadraticCurveTo(32,-26,56,-14);
  ctx.quadraticCurveTo(36,-8,10,-8);
  ctx.closePath();
  const canopyGrad=ctx.createLinearGradient(10,-20,60,-4);
  canopyGrad.addColorStop(0,'#9fc7e9');
  canopyGrad.addColorStop(1,'#e5f5ff');
  ctx.fillStyle=canopyGrad; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1; ctx.stroke();
  // cockpit frame line
  ctx.beginPath(); ctx.moveTo(10,-8); ctx.lineTo(56,-12); ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.stroke();
  // intake (simple dark ellipse near nose underside)
  ctx.beginPath(); ctx.fillStyle='#1e272d'; ctx.ellipse(82,4,12,6,0,0,Math.PI*2); ctx.fill();
  // wings (top view projection simplified as side swept polygons)
  ctx.beginPath();
  ctx.moveTo(-30,-6);
  ctx.lineTo(-8,-42);
  ctx.lineTo(34,-38);
  ctx.lineTo(8,-6);
  ctx.closePath();
  const wingGrad=ctx.createLinearGradient(-30,-42,34,-6);
  wingGrad.addColorStop(0,'#2f3d49');
  wingGrad.addColorStop(1,'#4f626f');
  ctx.fillStyle=wingGrad; ctx.fill();
  // ventral wing (shadowed)
  ctx.beginPath();
  ctx.moveTo(-24,4);
  ctx.lineTo(6,32);
  ctx.lineTo(44,30);
  ctx.lineTo(14,4);
  ctx.closePath();
  const wingBotGrad=ctx.createLinearGradient(-24,4,44,32);
  wingBotGrad.addColorStop(0,'#24323d');
  wingBotGrad.addColorStop(1,'#41525e');
  ctx.fillStyle=wingBotGrad; ctx.fill();
  // tail planes
  ctx.beginPath();
  ctx.moveTo(-118,-10);
  ctx.lineTo(-146,-28);
  ctx.lineTo(-130,-6);
  ctx.closePath(); ctx.fillStyle='#384751'; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-118,12);
  ctx.lineTo(-146,30);
  ctx.lineTo(-130,8);
  ctx.closePath(); ctx.fillStyle='#2b3943'; ctx.fill();
  // afterburner glow subtle
  ctx.save(); ctx.globalCompositeOperation='lighter';
  const burnGrad=ctx.createRadialGradient(-138,0,2,-138,0,24);
  burnGrad.addColorStop(0,'rgba(255,150,60,0.55)');
  burnGrad.addColorStop(0.4,'rgba(255,90,30,0.28)');
  burnGrad.addColorStop(1,'rgba(255,40,0,0)');
  ctx.fillStyle=burnGrad; ctx.beginPath(); ctx.arc(-138,0,24,0,Math.PI*2); ctx.fill(); ctx.restore();
  // accent stripe
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(-70,-6); ctx.lineTo(90,-2); ctx.stroke();
  // drag indicator ring
  if(sat.dragging){ctx.strokeStyle='#ffb300'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,130,0,Math.PI*2); ctx.stroke();}
  ctx.restore();
  return;
      }
      // dark mode satellite (unchanged)
      ctx.save(); ctx.translate(sat.x, sat.y); ctx.rotate(sat.angle);
      const gradient=ctx.createRadialGradient(0,0,10,0,0,70); gradient.addColorStop(0,'rgba(120,170,255,0.35)'); gradient.addColorStop(1,'rgba(120,170,255,0)');
      ctx.fillStyle=gradient; ctx.beginPath(); ctx.arc(0,0,60,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1b2c46'; ctx.strokeStyle='#8ecbff'; ctx.lineWidth=2.2; ctx.beginPath(); ctx.roundRect(-26,-18,52,36,8); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#2f4c72'; ctx.beginPath(); ctx.roundRect(-14,-10,28,20,6); ctx.fill();
      ctx.fillStyle='#27405f'; ctx.strokeStyle='#6fb7ff'; ctx.beginPath(); ctx.roundRect(-70,-14,32,28,4); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(38,-14,32,28,4); ctx.fill(); ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1; for(let i=-56;i<=-42;i+=7){ctx.beginPath(); ctx.moveTo(i,-14); ctx.lineTo(i,14); ctx.stroke();} for(let i=56;i>=42;i-=7){ctx.beginPath(); ctx.moveTo(i,-14); ctx.lineTo(i,14); ctx.stroke();}
      ctx.strokeStyle='#9fd4ff'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,18); ctx.lineTo(0,36); ctx.stroke(); ctx.beginPath(); ctx.arc(0,42,6,0,Math.PI*2); ctx.fillStyle='#4da6ff'; ctx.fill();
      if(sat.dragging){ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(0,0,46,0,Math.PI*2); ctx.stroke();}
      ctx.restore();
    }
  // Light mode dust + snow
  const dust=[]; const dustCount=70; const snow=[]; const snowCount=350; let atmosInit=false; let wind={x:0,y:0};
  function initAtmos(){
    if(atmosInit) return; atmosInit=true;
    for(let i=0;i<dustCount;i++) dust.push({x:Math.random()*w,y:Math.random()*h,z:Math.random(),r:0.5+Math.random()*1.1,vy:0.05+Math.random()*0.18,vx:(Math.random()*0.18)-0.09,phase:Math.random()*Math.PI*2});
  for(let i=0;i<snowCount;i++) snow.push({x:Math.random()*w,y:Math.random()*h,vy:0.6+Math.random()*1.4,vx:(Math.random()*0.7)-0.35,r:1.6+Math.random()*3.2,spin:Math.random()*Math.PI*2,drift:0.2+Math.random()*0.45,life:0});
  }
  function updateAtmos(){
    if(!document.body.classList.contains('light')) return; initAtmos();
    // Smooth wind tends toward pointer velocity (blizzard chase effect)
    wind.x += (pointer.vx*0.35 - wind.x)*0.04;
    wind.y += ((pointer.vy*0.15 + 0.4) - wind.y)*0.04;
    for(const p of dust){p.phase+=0.01;p.x+=p.vx + wind.x*0.01 + (pointer.x - w/2)*0.00001;p.y+=p.vy + wind.y*0.01 + Math.sin(p.phase)*0.05; if(p.y>h){p.y=-10; p.x=Math.random()*w;} if(p.x<-20) p.x=w+10; if(p.x>w+20) p.x=-10;}
    const spawnExtra = pointer.speed>18 ? Math.min(8, Math.floor(pointer.speed/25)) : 0;
    for(let i=0;i<spawnExtra;i++){
      // trail spawn behind cursor
      snow.push({x:pointer.x + (Math.random()*40-20), y:pointer.y + (Math.random()*40-20), vy:0.8+Math.random()*1.4, vx:(Math.random()*0.6-0.3)+wind.x*0.05, r:1.4+Math.random()*2.6, spin:Math.random()*Math.PI*2, drift:0.25+Math.random()*0.4, life:0});
      if(snow.length>snowCount+120) snow.splice(0, snow.length-(snowCount+120));
    }
    for(const s of snow){
      const dx=pointer.x - s.x; const dy=pointer.y - s.y; const dist=Math.hypot(dx,dy)||1;
      const attract = Math.min(1/dist,0.02);
      s.vx += dx*attract*0.02 + wind.x*0.015;
      s.vy += dy*attract*0.008 + wind.y*0.02;
      s.spin += 0.02 + pointer.speed*0.0004;
      s.x += s.vx + Math.sin(s.spin)*s.drift;
      s.y += s.vy + Math.cos(s.spin*0.6)*0.12;
      // friction
      s.vx *= 0.988; s.vy = Math.min(s.vy*0.991 + 0.01, 4.2);
      if(s.y>h+16){s.y=-14; s.x=Math.random()*w; s.vy=0.6+Math.random()*1.2; s.vx=(Math.random()*0.7)-0.35;}
      if(s.x<-30) s.x=w+25; if(s.x>w+30) s.x=-25;
    }
  }
  function drawAtmos(ctx){
    if(!document.body.classList.contains('light')) return; ctx.save();
    for(const p of dust){ctx.globalAlpha=0.12 + p.z*0.32; ctx.fillStyle='#1f4d80'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*(0.7+p.z*0.5),0,Math.PI*2); ctx.fill();}
    ctx.globalAlpha=1;
  for(const s of snow){ctx.globalAlpha=0.55 + (s.r/4)*0.35; ctx.fillStyle='rgba(255,255,255,0.97)'; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();}
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
        const sy = (sun.y|| (h-160))/h;
        const skyGrad=ctx.createLinearGradient(0,0,0,h);
        skyGrad.addColorStop(0,'#b9e2ff');
        skyGrad.addColorStop(Math.min(0.55+ (sy*0.15),0.9),'#d8efff');
        skyGrad.addColorStop(1,'#f2f9ff');
        ctx.fillStyle=skyGrad; ctx.fillRect(0,0,w,h);
        ctx.save();
        const radial=ctx.createRadialGradient(sun.x,sun.y,8,sun.x,sun.y,sun.r*2.1);
        radial.addColorStop(0,'rgba(255,235,160,0.75)');
        radial.addColorStop(0.55,'rgba(255,220,120,0.25)');
        radial.addColorStop(1,'rgba(255,210,100,0)');
        ctx.fillStyle=radial; ctx.beginPath(); ctx.arc(sun.x,sun.y,sun.r*2.1,0,Math.PI*2); ctx.fill();
        ctx.restore();
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
  /* Mobile nav toggle */
  const navToggle=document.getElementById('navToggle');
  const navLinksWrap=document.getElementById('navLinks');
  if(navToggle && navLinksWrap){
    navToggle.addEventListener('click',()=>{
      const open=navLinksWrap.classList.toggle('open');
      navToggle.setAttribute('aria-expanded',open?'true':'false');
    });
    navLinksWrap.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      if(window.innerWidth<780 && navLinksWrap.classList.contains('open')){
        navLinksWrap.classList.remove('open'); navToggle.setAttribute('aria-expanded','false');
      }
    }));
    window.addEventListener('resize',()=>{ if(window.innerWidth>=780){navLinksWrap.classList.remove('open'); navToggle.setAttribute('aria-expanded','false');}} ,{passive:true});
  }
  // Adjust CSS var for viewport height to fix mobile browser chrome collapse
  function setVh(){ document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px'); }
  setVh(); window.addEventListener('resize',()=>setVh(),{passive:true}); window.addEventListener('orientationchange',()=>setTimeout(setVh,120));
  function toggleTheme(){
    const light=document.body.classList.toggle('light');
    themeBtn.textContent=light?'🌑':'🌙';
    if(light){document.body.classList.add('day-bg');} else {document.body.classList.remove('day-bg');}
    const starCanvas=document.getElementById('fxCanvas');
    if(starCanvas){starCanvas.style.display='block';}
    localStorage.setItem('theme',light?'light':'dark');
    window.dispatchEvent(new CustomEvent('theme-change',{detail:{light}}));
  }
  themeBtn&&themeBtn.addEventListener('click',toggleTheme);

  window.addEventListener('theme-change',e=>{
    // Force reposition quickly (objects will ease into anchors)
    if(e.detail.light){
      sun.x=window.innerWidth-160; sun.y=140;
      sat.x=140; sat.y=window.innerHeight-160;
    } else {
      sun.x=140; sun.y=window.innerHeight-160;
      sat.x=window.innerWidth-140; sat.y=130;
    }
  });
  // Initial adjust if starting in light mode
  if(document.body.classList.contains('light')){
    window.dispatchEvent(new CustomEvent('theme-change',{detail:{light:true}}));
  }

})();
