const slides=[...document.querySelectorAll('.slide')];
const progress=document.getElementById('progress');
const counter=document.getElementById('counter');
const help=document.getElementById('help');
let index=0;

function fragments(){return [...slides[index].querySelectorAll('.fragment')]}
function update(){
  slides.forEach((s,i)=>s.classList.toggle('active',i===index));
  progress.style.width=`${((index+1)/slides.length)*100}%`;
  counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  document.title=`${slides[index].dataset.title} · Travail actuariel`;
}
function forward(){
  const next=fragments().find(f=>!f.classList.contains('visible'));
  if(next){next.classList.add('visible');return}
  if(index<slides.length-1){slides[index].classList.remove('active');index++;update()}
}
function back(){
  const shown=fragments().filter(f=>f.classList.contains('visible'));
  if(shown.length){shown.at(-1).classList.remove('visible');return}
  if(index>0){slides[index].classList.remove('active');index--;fragments().forEach(f=>f.classList.add('visible'));update()}
}
function fullscreen(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
function overview(){document.body.classList.toggle('overview')}
document.addEventListener('keydown',e=>{
  if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();forward()}
  else if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){e.preventDefault();back()}
  else if(e.key.toLowerCase()==='f')fullscreen();
  else if(e.key.toLowerCase()==='o')overview();
  else if(e.key==='Escape'&&document.body.classList.contains('overview'))overview();
});
document.addEventListener('click',e=>{
  if(e.target.closest('button,dialog'))return;
  if(document.body.classList.contains('overview')){
    const slide=e.target.closest('.slide');if(slide){index=slides.indexOf(slide);overview();update()}return;
  }
  forward();
});
document.getElementById('helpBtn').onclick=()=>help.showModal();
help.querySelector('button').onclick=()=>help.close();
update();
