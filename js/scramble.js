// Subtle text scramble reveal
(function(){
  const el = document.getElementById('scrambleText');
  if(!el) return;
  const final = el.dataset.final || '';
  const chars = 'アァカサタナハマヤャラワガザダバパ！？ツヅヌネΩΨΣЖБЖЊжЮΔΦΓξπЖ01<>█░▒▓#*&$%';
  const iterations = 24; // fewer for subtlety
  let frame = 0;
  let displayed = new Array(final.length).fill('');
  function tick(){
    let out = '';
    for(let i=0;i<final.length;i++){
      if(final[i]===' '){ out+=' '; continue; }
      if(frame < iterations){
        if(frame > iterations * 0.6 && Math.random() < 0.35){
          out += final[i];
        } else {
          out += chars[Math.floor(Math.random()*chars.length)];
        }
      } else {
        out += final[i];
      }
    }
    el.textContent = out;
    frame++;
    if(frame <= iterations+6) requestAnimationFrame(tick);
  }
  tick();
})();
