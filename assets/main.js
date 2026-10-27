const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
if(menu&&nav){menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
// Keep the hero visually complete when the local portrait cannot be loaded.
const portrait=document.querySelector('.portrait');
if(portrait){portrait.addEventListener('error',()=>{portrait.alt='Animated Suriyan K.S. monogram portrait';portrait.closest('.orbit')?.classList.add('portrait-fallback');},{once:true});if(portrait.complete&&portrait.naturalWidth===0){portrait.closest('.orbit')?.classList.add('portrait-fallback');}}
const io=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));

const projectCards=[...document.querySelectorAll('.project-card')];
const projectSearch=document.querySelector('#project-search');
const filterButtons=[...document.querySelectorAll('.filter-chip')];
const projectCount=document.querySelector('.project-count');
let selectedProjectFilter='all';
function applyProjectFilter(){
 const query=(projectSearch?.value||'').trim().toLowerCase();
 let count=0;
 projectCards.forEach(card=>{
  const category=card.dataset.category||'all';
  const visible=(selectedProjectFilter==='all'||category===selectedProjectFilter)&&(!query||card.textContent.toLowerCase().includes(query));
  card.hidden=!visible;
  if(visible)count++;
 });
 if(projectCount)projectCount.textContent=count+' project'+(count===1?'':'s')+' shown';
}
filterButtons.forEach(button=>button.addEventListener('click',()=>{
 selectedProjectFilter=button.dataset.filter||'all';
 filterButtons.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
 applyProjectFilter();
}));
projectSearch?.addEventListener('input',applyProjectFilter);

/* Interactive portfolio lab */
const terminalOutput=document.querySelector('#terminal-output');
const terminalResponses={
 about:['Suriyan K.S.','CSE student at KPRIET · Aspiring full-stack developer · AI enthusiast.','I learn by building, testing, and improving.'],
 skills:['Current focus:','Java & DSA · HTML/CSS/JavaScript · Python · SQL · React fundamentals.','I am actively growing these skills through practice and projects.'],
 projects:['Selected work:','M.E.R.I.D.I.A.N — MTC validation · Multi Agri Rover — embedded systems · Student Performance Analysis — Python.','Use the Projects page to explore each project and its available source/demo.'],
 leadership:['Community & leadership:','Ignitrron Treasurer · IEEE CS documentation · student communities and event execution.','I enjoy turning coordination into tangible outcomes.'],
 contact:['Let’s connect:','Email: suriyankumaresan@gmail.com','LinkedIn: linkedin.com/in/suriyan-k-s']
};
document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>{
 if(!terminalOutput)return;
 const cmd=button.dataset.command;
 terminalOutput.innerHTML='<p><span class="terminal-prompt">suriyan@portfolio:~$</span> '+cmd+'</p>'+terminalResponses[cmd].map(line=>'<p>'+line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>').join('');
}));
document.querySelector('#terminal-clear')?.addEventListener('click',()=>{if(terminalOutput)terminalOutput.innerHTML='<p>Terminal cleared. Choose a command to explore.</p>';});
const skillData={
 web:{n:'01 / 04',symbol:'</>',title:'Web development',desc:'Building responsive interfaces and connecting frontends to APIs.',tags:'HTML · CSS · JavaScript · React',meter:72},
 java:{n:'02 / 04',symbol:'J',title:'Java & problem solving',desc:'Strengthening core programming, DSA patterns and placement problem-solving.',tags:'Java · DSA · Algorithms',meter:48},
 ai:{n:'03 / 04',symbol:'AI',title:'AI / machine learning',desc:'Exploring practical AI workflows, data preparation and intelligent applications.',tags:'Python · NumPy · Pandas · AI',meter:42},
 systems:{n:'04 / 04',symbol:'{ }',title:'Systems & embedded',desc:'Connecting software logic with sensors, microcontrollers and network fundamentals.',tags:'Arduino · C · Networking',meter:55}
};
document.querySelectorAll('[data-skill]').forEach(button=>button.addEventListener('click',()=>{
 const d=skillData[button.dataset.skill];if(!d)return;
 document.querySelectorAll('[data-skill]').forEach(b=>b.classList.toggle('active',b===button));
 const set=(id,value)=>{const el=document.querySelector(id);if(el)el.textContent=value;};
 set('#skill-level',d.n);set('#skill-symbol',d.symbol);set('#skill-title',d.title);set('#skill-description',d.desc);set('#skill-caption',d.tags);
 const fill=document.querySelector('#skill-meter-fill');if(fill)fill.style.width=d.meter+'%';
}));
const spotlights=[
 {type:'AUTOMATION / OCR',title:'M.E.R.I.D.I.A.N',desc:'A rule-based compliance engine for Material Test Certificate validation using OCR and structured data processing.',tags:['Python','OCR','Rule engine']},
 {type:'AI / LEARNING',title:'MINDCRAFT',desc:'A gamified learning concept exploring focus, habit-building and personalised progress.',tags:['Learning','Gamification','AI concept']},
 {type:'AGRI / EMBEDDED',title:'MULTI AGRI ROVER',desc:'A student engineering project combining a rover platform, solar power and embedded control; automation was a later phase.',tags:['Arduino','Sensors','Automation']},
 {type:'DATA / PYTHON',title:'STUDENT PERFORMANCE',desc:'Exploratory analysis of student performance using Python data tools to uncover patterns and communicate findings.',tags:['Python','Pandas','NumPy']}
];
let activeSpotlight=0;
function renderSpotlight(i){
 activeSpotlight=(i+spotlights.length)%spotlights.length;const d=spotlights[activeSpotlight];
 const set=(id,value)=>{const el=document.querySelector(id);if(el)el.textContent=value;};
 set('#spotlight-index',String(activeSpotlight+1).padStart(2,'0')+' / '+String(spotlights.length).padStart(2,'0'));
 set('#spotlight-type',d.type);set('#spotlight-title',d.title);set('#spotlight-description',d.desc);
 const tags=document.querySelector('#spotlight-tags');if(tags)tags.innerHTML=d.tags.map(t=>'<span>'+t+'</span>').join('');
 document.querySelectorAll('[data-spotlight]').forEach(b=>b.classList.toggle('active',Number(b.dataset.spotlight)===activeSpotlight));
}
document.querySelector('#spotlight-prev')?.addEventListener('click',()=>renderSpotlight(activeSpotlight-1));
document.querySelector('#spotlight-next')?.addEventListener('click',()=>renderSpotlight(activeSpotlight+1));
document.querySelectorAll('[data-spotlight]').forEach(b=>b.addEventListener('click',()=>renderSpotlight(Number(b.dataset.spotlight))));
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
 const n=button.dataset.step;
 document.querySelectorAll('[data-step]').forEach(b=>b.classList.toggle('active',b===button));
 document.querySelectorAll('[data-detail]').forEach(d=>d.classList.toggle('open',d.dataset.detail===n));
}));
