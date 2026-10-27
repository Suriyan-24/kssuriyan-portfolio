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


/* Site-wide interactions: command palette, progress, theme, card previews. */
(function(){
 const body=document.body;
 const progress=document.createElement('div');
 progress.className='reading-progress';
 progress.setAttribute('aria-hidden','true');
 document.body.prepend(progress);
 const toolbar=document.createElement('div');
 toolbar.className='site-tools';
 toolbar.innerHTML='<button type="button" class="site-tool" id="open-command" aria-label="Open quick navigation" title="Quick navigation (Ctrl or Command + K)">⌘ K</button><button type="button" class="site-tool theme-toggle" id="theme-toggle" aria-label="Toggle contrast theme" title="Toggle theme">◐</button>';
 document.querySelector('.site-header')?.append(toolbar);
 const palette=document.createElement('dialog');
 palette.className='command-palette';
 palette.setAttribute('aria-label','Quick navigation');
 palette.innerHTML='<div class="palette-inner"><div class="palette-head"><span>QUICK NAVIGATION</span><button type="button" id="close-command" aria-label="Close">ESC ✕</button></div><input type="search" id="command-search" placeholder="Jump to a page or section…" autocomplete="off"><div class="command-results" id="command-results"></div><p class="palette-hint">↑ ↓ to browse · Enter to open · Esc to close</p></div>';
 document.body.append(palette);
 const commands=[
  {label:'Home',meta:'Page',url:'index.html'},{label:'Projects',meta:'Explore projects',url:'projects.html'},
  {label:'Experience & leadership',meta:'Roles and timeline',url:'experience.html'},
  {label:'LinkedIn posts',meta:'Featured writing',url:'posts.html'},
  {label:'Certifications',meta:'Courses and credentials',url:'certifications.html'},
  {label:'Contact Suriyan',meta:'Email',url:'mailto:suriyankumaresan@gmail.com'},
  {label:'GitHub profile',meta:'Code repositories',url:'https://github.com/Suriyan-24'},
  {label:'LinkedIn profile',meta:'Professional profile',url:'https://www.linkedin.com/in/suriyan-k-s/'}
 ];
 const input=palette.querySelector('#command-search'),results=palette.querySelector('#command-results');
 let selected=0;
 function drawCommands(){
  const q=(input.value||'').toLowerCase().trim();
  const matches=commands.filter(c=>(c.label+' '+c.meta).toLowerCase().includes(q));
  if(selected>=matches.length)selected=0;
  results.innerHTML=matches.map((c,i)=>'<button type="button" class="command-result '+(i===selected?'selected':'')+'" data-url="'+c.url.replace(/"/g,'&quot;')+'"><span><b>'+c.label+'</b><small>'+c.meta+'</small></span><span>↗</span></button>').join('')||'<p class="no-results">No matching destination. Try another search.</p>';
  results.querySelectorAll('[data-url]').forEach(b=>b.addEventListener('click',()=>{const url=b.dataset.url;if(url.startsWith('mailto:')||url.startsWith('https://'))window.open(url,'_blank','noopener');else window.location.href=url;}));
 }
 function openPalette(){if(!palette.open)palette.showModal();input.value='';selected=0;drawCommands();input.focus();}
 document.querySelector('#open-command')?.addEventListener('click',openPalette);
 document.querySelector('#close-command')?.addEventListener('click',()=>palette.close());
 palette.addEventListener('click',e=>{if(e.target===palette)palette.close();});
 input.addEventListener('input',()=>{selected=0;drawCommands();});
 input.addEventListener('keydown',e=>{
  const items=[...results.querySelectorAll('[data-url]')];
  if(e.key==='ArrowDown'){e.preventDefault();selected=Math.min(selected+1,items.length-1);drawCommands();}
  if(e.key==='ArrowUp'){e.preventDefault();selected=Math.max(0,selected-1);drawCommands();}
  if(e.key==='Enter'&&items[selected])items[selected].click();
 });
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();}});
 const themeButton=document.querySelector('#theme-toggle');
 if(themeButton){
  themeButton.addEventListener('click',()=>{
   const light=body.classList.toggle('soft-light');
   themeButton.textContent=light?'☼':'◐';
   themeButton.setAttribute('aria-label',light?'Switch to dark theme':'Switch to soft light theme');
  });
 }
 let scheduled=false;
 function updateProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?window.scrollY/max*100:0)+'%';
  scheduled=false;
 }
 window.addEventListener('scroll',()=>{if(!scheduled){window.requestAnimationFrame(updateProgress);scheduled=true;}},{passive:true});
 updateProgress();
 document.querySelectorAll('.project-card,.job,.lead-card,.cert-card,.post-card').forEach(card=>{
  card.setAttribute('tabindex','0');
  card.setAttribute('role','button');
  card.setAttribute('aria-label','Expand details: '+(card.querySelector('h3')?.textContent||'portfolio item'));
  const toggle=()=>{
   const expanded=card.classList.toggle('details-expanded');
   card.setAttribute('aria-expanded',String(expanded));
  };
  card.addEventListener('click',e=>{
   if(e.target.closest('a,button,input'))return;
   toggle();
  });
  card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===card){e.preventDefault();toggle();}});
 });
 document.querySelectorAll('.nav a,.button,.highlight-card,.project-links a,.social-row a').forEach(link=>{
  link.addEventListener('pointerdown',()=>link.classList.add('is-pressed'));
  ['pointerup','pointerleave','blur'].forEach(type=>link.addEventListener(type,()=>link.classList.remove('is-pressed')));
 });
})();
