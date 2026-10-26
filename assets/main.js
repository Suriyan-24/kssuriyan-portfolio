const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
if(menu&&nav){menu.setAttribute('aria-expanded','false');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
// Keep the hero visually complete when the local portrait cannot be loaded.
const portrait=document.querySelector('.portrait');
if(portrait){portrait.addEventListener('error',()=>{portrait.alt='Animated Suriyan K.S. monogram portrait';portrait.closest('.orbit')?.classList.add('portrait-fallback');},{once:true});if(portrait.complete&&portrait.naturalWidth===0){portrait.closest('.orbit')?.classList.add('portrait-fallback');}}
const io=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
