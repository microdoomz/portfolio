// Main interactivity
(function(){
  document.getElementById('year').textContent = new Date().getFullYear();
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn.addEventListener('click',()=>{
    // Replace resume.pdf with actual file name you place in assets
    window.open('assets/resume.pdf','_blank');
  });
  const emailBtn=document.getElementById('emailBtn');
  emailBtn.addEventListener('click',()=>{
    const email='youremail@example.com'; // replace with your email
    const subject=encodeURIComponent('Opportunity | Connecting');
    const body=encodeURIComponent('Hi Junaid,');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,'_blank');
  });
  const phoneBtn=document.getElementById('phoneBtn');
  const popup=document.getElementById('phonePopup');
  const close=document.getElementById('closePhone');
  phoneBtn.addEventListener('click',()=>{popup.hidden=false;});
  close.addEventListener('click',()=>{popup.hidden=true;});
  // Scroll reveal
  const observer = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}})},{threshold:.12});
  document.querySelectorAll('.section, .project-card, .pill, .timeline-item').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
})();

// Dynamic add projects example (extendable)
const moreProjectsData = [
  // Add objects like below to extend
  // { title:'New Project', desc:'Description', img:'assets/new.png', url:'https://example.com' }
];
(function(){
  const container=document.getElementById('moreProjects');
  if(!container) return;
  moreProjectsData.forEach(p=>{
    const card=document.createElement('div');card.className='project-card glass-block reveal';
    card.innerHTML=`<img src="${p.img}" alt="${p.title}" class="project-img"/><div class="project-body"><h3>${p.title}</h3><p>${p.desc}</p><a class='btn glass project-link' target='_blank' href='${p.url}'>Visit Project</a></div>`;
    container.appendChild(card);
  });
})();
