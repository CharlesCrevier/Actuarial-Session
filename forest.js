(() => {
  const canvas = document.getElementById('nature-bg');
  const ctx = canvas.getContext('2d', { alpha: false });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, dpr, mist = [], leaves = [], drops = [], last = 0;

  const rand = (a,b) => a + Math.random() * (b-a);
  function reset(){
    const box = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = canvas.width = Math.round(box.width*dpr); h = canvas.height = Math.round(box.height*dpr);
    mist = Array.from({length:16},()=>({x:rand(-w,w),y:rand(h*.1,h*.9),r:rand(w*.08,w*.24),s:rand(.03,.11),a:rand(.018,.055)}));
    leaves = Array.from({length:85},()=>({x:rand(0,w),y:rand(0,h),r:rand(2,9)*dpr,s:rand(.05,.22),p:rand(0,Math.PI*2),a:rand(.08,.33)}));
    drops = Array.from({length:120},()=>({x:rand(w*.62,w*.79),y:rand(h*.22,h*.96),l:rand(5,26)*dpr,s:rand(2.5,7)*dpr,a:rand(.08,.36)}));
  }
  function tree(x, base, scale, sway, color){
    ctx.save(); ctx.translate(x,base); ctx.rotate(sway); ctx.fillStyle=color;
    ctx.beginPath(); ctx.moveTo(-scale*.055,0); ctx.quadraticCurveTo(-scale*.02,-scale*.45,0,-scale); ctx.quadraticCurveTo(scale*.05,-scale*.46,scale*.07,0); ctx.closePath(); ctx.fill();
    for(let i=0;i<7;i++){ const y=-scale*(.28+i*.105), side=i%2?-1:1; ctx.beginPath(); ctx.ellipse(side*scale*.11,y,scale*.2,scale*.06,side*.35,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
  function frame(t){
    const dt=Math.min(32,t-last||16); last=t; const time=t*.00012;
    let g=ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,'#091e28');g.addColorStop(.45,'#0b2b27');g.addColorStop(1,'#020a0c');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    const light=ctx.createRadialGradient(w*.68,h*.08,0,w*.68,h*.08,w*.48); light.addColorStop(0,'rgba(193,255,217,.32)');light.addColorStop(.32,'rgba(83,190,151,.10)');light.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=light;ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=.38; for(let i=0;i<15;i++) tree((i-1)*w/13,h*1.04,h*rand(.48,.82),Math.sin(time*4+i)*.012,'#071814'); ctx.globalAlpha=1;
    const cliff=ctx.createLinearGradient(w*.58,0,w*.88,0);cliff.addColorStop(0,'#10261f');cliff.addColorStop(.55,'#06130f');cliff.addColorStop(1,'#020706');ctx.fillStyle=cliff;ctx.beginPath();ctx.moveTo(w*.56,h*.18);ctx.bezierCurveTo(w*.68,h*.12,w*.82,h*.19,w*.91,0);ctx.lineTo(w,h);ctx.lineTo(w*.51,h);ctx.closePath();ctx.fill();
    const fallX=w*.705+Math.sin(time*2)*w*.003; const wg=ctx.createLinearGradient(fallX-w*.06,0,fallX+w*.07,0);wg.addColorStop(0,'rgba(210,255,245,0)');wg.addColorStop(.35,'rgba(197,245,239,.48)');wg.addColorStop(.52,'rgba(255,255,255,.88)');wg.addColorStop(.75,'rgba(117,218,213,.30)');wg.addColorStop(1,'rgba(210,255,245,0)');ctx.fillStyle=wg;ctx.beginPath();ctx.moveTo(fallX-w*.025,h*.18);ctx.bezierCurveTo(fallX+w*.05,h*.42,fallX-w*.055,h*.67,fallX+w*.03,h);ctx.lineTo(fallX+w*.12,h);ctx.bezierCurveTo(fallX+w*.02,h*.7,fallX+w*.11,h*.45,fallX+w*.065,h*.18);ctx.closePath();ctx.fill();
    ctx.lineWidth=1*dpr; for(const d of drops){d.y+=d.s*dt/16;if(d.y>h){d.y=h*.2;d.x=rand(w*.63,w*.8)}ctx.strokeStyle=`rgba(220,255,250,${d.a})`;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+Math.sin(time*20+d.x)*2*dpr,d.y+d.l);ctx.stroke()}
    for(const m of mist){m.x+=m.s*dt*dpr;if(m.x-m.r>w)m.x=-m.r;const mg=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r);mg.addColorStop(0,`rgba(210,255,239,${m.a})`);mg.addColorStop(1,'rgba(210,255,239,0)');ctx.fillStyle=mg;ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,Math.PI*2);ctx.fill()}
    for(const l of leaves){l.x+=Math.sin(time*8+l.p)*l.s*dt;l.y+=l.s*dt*.18;if(l.y>h){l.y=-10;l.x=rand(0,w)}ctx.fillStyle=`rgba(145,226,164,${l.a})`;ctx.beginPath();ctx.ellipse(l.x,l.y,l.r,l.r*.38,time*9+l.p,0,Math.PI*2);ctx.fill()}
    const shade=ctx.createLinearGradient(0,0,w,0);shade.addColorStop(0,'rgba(0,5,10,.88)');shade.addColorStop(.5,'rgba(0,7,9,.34)');shade.addColorStop(1,'rgba(0,3,5,.24)');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
    if(!reduce) requestAnimationFrame(frame);
  }
  addEventListener('resize',reset); reset(); requestAnimationFrame(frame);
})();
