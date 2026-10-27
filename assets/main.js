const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
if(menu&&nav){menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
// Prefer the local headshot, then use the public repository copy before showing a fallback.
const portrait=document.querySelector('.portrait');
if(portrait){
 const handlePortraitError=()=>{
  if(portrait.dataset.remoteTried!=='1'&&portrait.dataset.remoteSrc){
   portrait.dataset.remoteTried='1';portrait.src=portrait.dataset.remoteSrc;return;
  }
  portrait.closest('.profile-visual')?.classList.add('photo-missing');
 };
 portrait.addEventListener('error',handlePortraitError);
 if(portrait.complete&&portrait.naturalWidth===0)handlePortraitError();
}
// Hero focus chips and pointer-reactive canvas.
const heroVisual=document.querySelector('#profile-visual'),heroCanvas=document.querySelector('#hero-particles');
const heroFocusLabel=document.querySelector('#focus-label');
const heroFocusModes={java:'JAVA & DSA',web:'FULL-STACK DEVELOPMENT',ai:'APPLIED AI / ML'};
function setHeroFocus(mode){
 if(!heroFocusModes[mode])return;
 if(heroFocusLabel)heroFocusLabel.textContent=heroFocusModes[mode];
 document.querySelectorAll('[data-hero-chip]').forEach(btn=>{
  const active=btn.dataset.heroChip===mode;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
 });
}
document.querySelectorAll('[data-hero-chip]').forEach(btn=>btn.addEventListener('click',()=>setHeroFocus(btn.dataset.heroChip)));
setHeroFocus('web');
if(heroVisual&&heroCanvas){
 const ctx=heroCanvas.getContext('2d');
 if(ctx){
  let w=1,h=1,dpr=1,raf=0,last=0,particles=[];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer={x:-1000,y:-1000,active:false};
  function resizeHeroCanvas(){
   const box=heroVisual.getBoundingClientRect();w=Math.max(1,box.width);h=Math.max(1,box.height);dpr=Math.min(window.devicePixelRatio||1,1.5);
   heroCanvas.width=Math.floor(w*dpr);heroCanvas.height=Math.floor(h*dpr);heroCanvas.style.width=w+'px';heroCanvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
   const amount=window.innerWidth<640?24:48;
   particles=Array.from({length:amount},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16,r:1+Math.random()*1.6,phase:Math.random()*Math.PI*2}));
   drawHeroCanvas(performance.now(),true);
  }
  function drawHeroCanvas(now,once=false){
   if(!ctx)return;
   const light=document.body.classList.contains('soft-light');
   const ink=light?'102,143,0':'200,255,61';
   ctx.clearRect(0,0,w,h);
   const glow=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,260);
   if(pointer.active){glow.addColorStop(0,light?'rgba(102,143,0,.09)':'rgba(200,255,61,.11)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);}
   for(let i=0;i<particles.length;i++){
    const p=particles[i];
    if(!once&&!reduced){
     p.x+=p.vx;p.y+=p.vy;p.phase+=.009;
     if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
     if(pointer.active){const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(dist<105&&dist>0){p.x+=(dx/dist)*.16;p.y+=(dy/dist)*.16;}}
    }
    const alpha=.25+.25*(Math.sin(p.phase)+1)/2;
    ctx.fillStyle='rgba('+ink+','+alpha+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    for(let j=i+1;j<particles.length;j++){
     const q=particles[j],distance=Math.hypot(p.x-q.x,p.y-q.y);
     if(distance<88){ctx.strokeStyle='rgba('+ink+','+((1-distance/88)*.12)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
    }
   }
   if(!once&&!reduced){raf=requestAnimationFrame(drawHeroCanvas);}
  }
  heroVisual.addEventListener('pointermove',e=>{const box=heroVisual.getBoundingClientRect();pointer.x=e.clientX-box.left;pointer.y=e.clientY-box.top;pointer.active=true;const px=(pointer.x/Math.max(1,w)-.5),py=(pointer.y/Math.max(1,h)-.5);heroVisual.style.setProperty('--hero-tilt-x',(px*4).toFixed(2)+'deg');heroVisual.style.setProperty('--hero-tilt-y',(-py*3).toFixed(2)+'deg');},{passive:true});
  heroVisual.addEventListener('pointerleave',()=>{pointer.active=false;pointer.x=-1000;pointer.y=-1000;heroVisual.style.setProperty('--hero-tilt-x','0deg');heroVisual.style.setProperty('--hero-tilt-y','0deg');},{passive:true});
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resizeHeroCanvas();if(!reduced)raf=requestAnimationFrame(drawHeroCanvas);},{passive:true});
  resizeHeroCanvas();
  if(!reduced)raf=requestAnimationFrame(drawHeroCanvas);
 }
}
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
 const savedTheme=(()=>{try{return localStorage.getItem('portfolio-theme');}catch(_){return null;}})();
 if(savedTheme==='light')body.classList.add('soft-light');
 function updateThemeButton(){if(themeButton){const light=body.classList.contains('soft-light');themeButton.textContent=light?'☼':'◐';themeButton.setAttribute('aria-label',light?'Switch to dark theme':'Switch to soft light theme');}}
 updateThemeButton();
 if(themeButton){
  themeButton.addEventListener('click',()=>{
   const light=body.classList.toggle('soft-light');
   try{localStorage.setItem('portfolio-theme',light?'light':'dark');}catch(_){}
   updateThemeButton();
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
 /* Rich case-study modal for cards across Projects, Experience, Posts, and Certifications. */
 const detailModal=document.createElement('dialog');
 detailModal.className='detail-modal';
 detailModal.setAttribute('aria-label','Portfolio item details');
 detailModal.innerHTML='<div class="detail-modal-inner"><div class="detail-modal-head"><span class="detail-eyebrow">PORTFOLIO / DETAILS</span><button type="button" class="detail-close" aria-label="Close details">ESC ✕</button></div><div class="detail-modal-content"></div></div>';
 document.body.append(detailModal);
 const detailContent=detailModal.querySelector('.detail-modal-content');
 function openCardDetails(card){
  detailContent.replaceChildren();
  const kicker=card.querySelector('.project-number,.post-meta,.job-date,.kicker');
  const title=card.querySelector('h3')||card.querySelector('strong')||card.querySelector('small');
  const org=card.querySelector('.org');
  if(kicker){const el=document.createElement('p');el.className='detail-kicker';el.textContent=kicker.textContent.trim();detailContent.append(el);}
  if(title){const el=document.createElement('h2');el.textContent=title.textContent.trim();detailContent.append(el);}
  if(org){const el=document.createElement('p');el.className='detail-org';el.textContent=org.textContent.trim();detailContent.append(el);}
  card.querySelectorAll('p').forEach(p=>{if(!p.closest('.detail-modal')&&!p.classList.contains('project-note')&&!p.classList.contains('job-type')){const el=document.createElement('p');el.className='detail-description';el.textContent=p.textContent.trim();detailContent.append(el);}});
  const tags=card.querySelector('.tags');
  if(tags){const clone=tags.cloneNode(true);clone.classList.add('detail-tags');detailContent.append(clone);}
  const links=[...card.querySelectorAll('a[href]')];
  if(links.length){const actions=document.createElement('div');actions.className='detail-actions';links.forEach(link=>{const a=link.cloneNode(true);a.target=link.target||'_blank';if(a.target==='_blank')a.rel='noreferrer';actions.append(a);});detailContent.append(actions);}
  if(!title&&!kicker){const text=document.createElement('p');text.textContent='Portfolio detail';detailContent.append(text);}
  detailModal.showModal();
 }
 document.querySelectorAll('.project-card,.job,.lead-card,.cert-card,.post-card,.highlight-card,.now-list>div').forEach(card=>{
  const title=card.querySelector('h3')?.textContent||card.querySelector('strong')?.textContent||'Portfolio item';
  card.setAttribute('tabindex','0');card.setAttribute('role','group');
  card.setAttribute('aria-label','Open details: '+title);
  card.classList.add('interactive-card');
  card.addEventListener('click',e=>{if(e.target.closest('a,button,input,select,textarea'))return;openCardDetails(card);});
  card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===card){e.preventDefault();openCardDetails(card);}});
 });
 detailModal.querySelector('.detail-close').addEventListener('click',()=>detailModal.close());
 detailModal.addEventListener('click',e=>{if(e.target===detailModal)detailModal.close();});
 document.querySelectorAll('.nav a,.button,.highlight-card,.project-links a,.social-row a').forEach(link=>{
  link.addEventListener('pointerdown',()=>link.classList.add('is-pressed'));
  ['pointerup','pointerleave','blur'].forEach(type=>link.addEventListener(type,()=>link.classList.remove('is-pressed')));
 });

 /* Scroll storytelling, counters, magnetic actions and 3D pointer-reactive cards. */
 const scrollRevealObserver=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('revealed');scrollRevealObserver.unobserve(entry.target);}
 }),{threshold:.12}):null;
 document.querySelectorAll('.reveal,.job,.lead-card,.cert-card,.post-card,.project-card,.highlight-card').forEach((el,i)=>{
  el.style.setProperty('--reveal-delay',(i%4)*65+'ms');
  if(scrollRevealObserver)scrollRevealObserver.observe(el);else el.classList.add('revealed');
 });
 const counters=[...document.querySelectorAll('.quick-stats b')];
 const animateCounter=(el)=>{
  if(el.dataset.counted)return;
  el.dataset.counted='true';
  const node=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
  if(!node)return;
  const original=node.textContent.trim();
  const match=original.match(/^([\d.]+)(K)?$/i);if(!match)return;
  const target=Number(match[1]);const suffix=match[2]?'K':'';
  const start=performance.now(),duration=1050;
  const tick=now=>{const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);node.textContent=(suffix?(target*ease).toFixed(target%1?1:0):Math.round(target*ease))+suffix;if(p<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
 };
 const counterObserver=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);counterObserver.unobserve(e.target);}}),{threshold:.65}):null;
 counters.forEach(el=>counterObserver?counterObserver.observe(el):animateCounter(el));
 const hoverTargets=document.querySelectorAll('.project-card,.job,.lead-card,.cert-card,.post-card,.highlight-card,.now-list>div,.quick-stats>div,.contact-band,.hero-art .profile-panel,.cert-group');
 const finePointerForCards=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
 if(finePointerForCards&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  hoverTargets.forEach(card=>{
   card.classList.add('pointer-reactive');
   card.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'&&e.pointerType!=='pen')return;
    const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    const px=(x/r.width-.5),py=(y/r.height-.5);
    card.style.setProperty('--glow-x',x+'px');card.style.setProperty('--glow-y',y+'px');
    if(card.matches('.project-card,.lead-card,.highlight-card')){
     card.style.setProperty('--tilt-x',(-py*3.2).toFixed(2)+'deg');
     card.style.setProperty('--tilt-y',(px*3.8).toFixed(2)+'deg');
    }
   },{passive:true});
   card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
  });
  document.querySelectorAll('.button.primary,.button.dark-button,.nav-cta,.site-tool,.contact-row .button').forEach(button=>{
   if(button.matches('input'))return;
   button.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse')return;
    const r=button.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    button.style.translate=(dx*.10).toFixed(1)+'px '+(dy*.13).toFixed(1)+'px';
   },{passive:true});
   button.addEventListener('pointerleave',()=>{button.style.translate='0px 0px';});
  });
 }
 /* Short, graceful transitions between the site's HTML pages. */
 const pageCurtain=document.createElement('div');pageCurtain.className='page-curtain';pageCurtain.setAttribute('aria-hidden','true');document.body.append(pageCurtain);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
  let url;try{url=new URL(link.href,window.location.href);}catch(_){return;}
  if(url.origin!==window.location.origin||!(/\.html$/i.test(url.pathname))||url.href===window.location.href)return;
  event.preventDefault();document.body.classList.add('page-leaving');
  window.setTimeout(()=>window.location.assign(url.href),200);
 });
 /* Theme-matched cursor with a glowing aura and lightweight fading trail. */
 const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(finePointer&&!reduceMotion){
  const aura=document.createElement('div');aura.className='cursor-aura';aura.setAttribute('aria-hidden','true');document.body.append(aura);
  let lastTrail=0,mouseX=-100,mouseY=-100;
  document.addEventListener('pointermove',e=>{
   if(e.pointerType==='touch')return;
   mouseX=e.clientX;mouseY=e.clientY;
   document.body.style.setProperty('--pointer-x',mouseX+'px');
   document.body.style.setProperty('--pointer-y',mouseY+'px');
   document.body.classList.add('pointer-active');
   aura.style.transform='translate('+mouseX+'px,'+mouseY+'px) translate(-50%,-50%)';
   const now=performance.now();
   if(now-lastTrail>34){
    const dot=document.createElement('span');dot.className='cursor-trail';
    dot.style.left=mouseX+'px';dot.style.top=mouseY+'px';
    const size=2+Math.random()*4;dot.style.width=size+'px';dot.style.height=size+'px';
    document.body.append(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true});lastTrail=now;
   }
  },{passive:true});
  document.addEventListener('pointerover',e=>{
   if(e.target.closest('a,button,[role=button],input,textarea,select,.project-card,.job,.lead-card,.cert-card,.post-card,.highlight-card'))document.body.classList.add('cursor-hover');
  });
  document.addEventListener('pointerout',e=>{
   if(e.target.closest('a,button,[role=button],input,textarea,select,.project-card,.job,.lead-card,.cert-card,.post-card,.highlight-card')&&!e.relatedTarget?.closest('a,button,[role=button],input,textarea,select,.project-card,.job,.lead-card,.cert-card,.post-card,.highlight-card'))document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('pointerleave',()=>document.body.classList.remove('pointer-active','cursor-hover'));
  document.addEventListener('pointerenter',()=>document.body.classList.add('pointer-active'));
 }

 /* Page-specific discovery: searchable experience, writing, and certifications. */
 function installCollectionTools({cards,insertBefore,title,placeholder,filters,categoryFor,afterFilter}){
  if(!cards||!cards.length||!insertBefore)return null;
  const tools=document.createElement('section');tools.className='collection-tools';
  const label=document.createElement('label');label.className='collection-label';label.textContent=title;label.htmlFor='collection-search-'+Math.random().toString(36).slice(2,7);
  const input=document.createElement('input');input.type='search';input.id=label.htmlFor;input.className='collection-search';input.placeholder=placeholder;input.autocomplete='off';
  const filterRow=document.createElement('div');filterRow.className='collection-filter-row';filterRow.setAttribute('role','group');filterRow.setAttribute('aria-label',title+' filters');
  const count=document.createElement('p');count.className='collection-count';count.setAttribute('aria-live','polite');
  const filterButtons=[];
  filters.forEach((filter,i)=>{
   const button=document.createElement('button');button.type='button';button.className='collection-filter'+(i===0?' active':'');button.dataset.filter=filter.value;button.textContent=filter.label;button.setAttribute('aria-pressed',String(i===0));filterRow.append(button);filterButtons.push(button);
  });
  tools.append(label,input,filterRow,count);insertBefore.before(tools);
  cards.forEach(card=>{card.dataset.collectionCategory=categoryFor(card)||'other';});
  let chosen='all';
  const apply=()=>{
   const query=input.value.trim().toLowerCase();let visible=0;
   cards.forEach(card=>{
    const matchesCategory=chosen==='all'||card.dataset.collectionCategory===chosen;
    const matchesText=!query||card.textContent.toLowerCase().includes(query);
    const show=matchesCategory&&matchesText;card.hidden=!show;if(show)visible++;
   });
   count.textContent=visible+' item'+(visible===1?'':'s')+' shown';
   filterButtons.forEach(button=>{const active=button.dataset.filter===chosen;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
   if(afterFilter)afterFilter(cards);
  };
  filterButtons.forEach(button=>button.addEventListener('click',()=>{chosen=button.dataset.filter||'all';apply();}));
  input.addEventListener('input',apply);apply();
  return {tools,input,apply};
 }
 const experienceCards=[...document.querySelectorAll('.job,.lead-card')];
 const timeline=document.querySelector('.timeline');
 if(timeline&&experienceCards.length){
  installCollectionTools({
   cards:experienceCards,insertBefore:timeline,title:'EXPLORE EXPERIENCE & LEADERSHIP',
   placeholder:'Search roles, organisations or responsibilities…',
   filters:[{value:'all',label:'Everything'},{value:'internships',label:'Internships'},{value:'community',label:'Community'},{value:'leadership',label:'Campus leadership'}],
   categoryFor:card=>{
    if(card.classList.contains('lead-card'))return 'leadership';
    const type=(card.querySelector('.job-type')?.textContent||'').toLowerCase();
    if(type.includes('intern'))return 'internships';
    if(type.includes('community'))return 'community';
    return 'leadership';
   },
   afterFilter:cards=>{
    document.querySelectorAll('.timeline,.lead-grid').forEach(group=>{
     const children=[...group.querySelectorAll('.job,.lead-card')];
     if(children.length)group.hidden=children.every(card=>card.hidden);
    });
   }
  });
 }
 const postCards=[...document.querySelectorAll('.post-card')];
 const postGrid=document.querySelector('.post-grid');
 if(postGrid&&postCards.length){
  installCollectionTools({
   cards:postCards,insertBefore:postGrid,title:'FIND A POST',
   placeholder:'Search themes, projects or event reflections…',
   filters:[{value:'all',label:'All writing'},{value:'projects',label:'Projects'},{value:'leadership',label:'Leadership'},{value:'community',label:'Community'},{value:'learning',label:'Learning'}],
   categoryFor:card=>{
    const meta=(card.querySelector('.post-meta')?.textContent||'').toLowerCase();
    if(meta.includes('project'))return 'projects';
    if(meta.includes('leadership'))return 'leadership';
    if(meta.includes('community'))return 'community';
    return 'learning';
   },
   afterFilter:cards=>{postGrid.hidden=cards.every(card=>card.hidden);}
  });
 }
 const certCards=[...document.querySelectorAll('.cert-card')];
 const firstCertHeading=document.querySelector('.cert-group');
 if(firstCertHeading&&certCards.length){
  const certGroups=[];
  document.querySelectorAll('.cert-group').forEach(heading=>{
   const grid=heading.nextElementSibling;
   if(!grid?.classList.contains('cert-grid'))return;
   const category=heading.textContent.replace(/^\s*\d+\s*\/\s*/,'').trim().toLowerCase();
   grid.dataset.certGroup=category;
   grid.querySelectorAll('.cert-card').forEach(card=>{card.dataset.certGroup=category;});
   certGroups.push({heading,grid});
  });
  const uniqueCategories=[...new Set(certCards.map(card=>card.dataset.certGroup).filter(Boolean))];
  const certFilters=[{value:'all',label:'All credentials'},...uniqueCategories.map(value=>({value,label:value.replace(/\b\w/g,c=>c.toUpperCase())}))];
  installCollectionTools({
   cards:certCards,insertBefore:firstCertHeading,title:'SEARCH & FILTER CERTIFICATIONS',
   placeholder:'Search a course, provider or skill…',filters:certFilters,
   categoryFor:card=>card.dataset.certGroup||'other',
   afterFilter:cards=>certGroups.forEach(({heading,grid})=>{
    const empty=[...grid.querySelectorAll('.cert-card')].every(card=>card.hidden);
    grid.hidden=empty;heading.hidden=empty;
   })
  });
 }

 /* Useful site-wide utilities: copy contact, back-to-top, and active section awareness. */
 const topButton=document.createElement('button');
 topButton.type='button';topButton.className='back-to-top';topButton.innerHTML='<span>↑</span><span>TOP</span>';topButton.setAttribute('aria-label','Scroll back to top');
 document.body.append(topButton);
 const toast=document.createElement('div');toast.className='site-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.append(toast);
 let toastTimer=0;
 function showToast(message){toast.textContent=message;toast.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>toast.classList.remove('show'),2200);}
 const copyEmailButton=document.createElement('button');copyEmailButton.type='button';copyEmailButton.className='copy-email';copyEmailButton.textContent='COPY EMAIL ↗';copyEmailButton.setAttribute('aria-label','Copy email address');
 document.querySelectorAll('.social-row').forEach(row=>{if(!row.querySelector('.copy-email'))row.append(copyEmailButton.cloneNode(true));});
 async function copyEmail(button){
  const email='suriyankumaresan@gmail.com';
  try{await navigator.clipboard.writeText(email);showToast('Email copied — '+email);button.textContent='COPIED ✓';}
  catch(_){
   const field=document.createElement('textarea');field.value=email;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();
   let ok=false;try{ok=document.execCommand('copy');}catch(__){}
   field.remove();showToast(ok?'Email copied — '+email:'Email: '+email);button.textContent=ok?'COPIED ✓':'EMAIL SHOWN';
  }
  window.setTimeout(()=>{button.textContent='COPY EMAIL ↗';},1800);
 }
 document.querySelectorAll('.copy-email').forEach(button=>button.addEventListener('click',()=>copyEmail(button)));
 let topShown=false;
 function syncFloatingUtilities(){
  const show=window.scrollY>420;
  if(show!==topShown){topShown=show;topButton.classList.toggle('shown',show);}
 }
 topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
 window.addEventListener('scroll',syncFloatingUtilities,{passive:true});syncFloatingUtilities();
 const sections=[...document.querySelectorAll('main section[id]')];
 if(sections.length&&'IntersectionObserver'in window){
  const sectionObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     const id=entry.target.id;
     document.querySelectorAll('.nav a[href^="#"]').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
    }
   });
  },{rootMargin:'-25% 0px -60% 0px',threshold:0});
  sections.forEach(section=>sectionObserver.observe(section));
 }
})();
