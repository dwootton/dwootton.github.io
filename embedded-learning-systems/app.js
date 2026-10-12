'use strict';
document.documentElement.classList.add('enhanced');
const byId = id => document.getElementById(id);
const format = n => new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(n);
const originals={a:'made good progress on the new screens',b:'expect to ship soon',c:'a few open questions'};
const fixed={a:'finished 4 of the 6 new screens, and the last 2 are in design review',b:'plan to ship on October 24'};
const vague=/\b(good|great|solid|nice|lots|lot|some|hard|progress|well|soon|few|various|several|stuff|things)\b/i;
const rules={
 a:{specific:/\d|\b(one|two|three|four|five|six|all|finished|shipped|merged|launched|completed|approved|signed off|tested|in review|reviewed)\b/i,
  good:'Now Priya can see what’s done and what’s left. That’s the move: swap a judgment for something she could check.',
  vague:'That’s still a judgment. Priya can’t tell where the work stands. What’s finished, and what isn’t?',
  close:'Closer. Could Priya check it? A count, a name, or a date usually does it.'},
 b:{specific:/\d|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b|\b(monday|tuesday|wednesday|thursday|friday|next week|end of|by the|after|once|when)\b/i,
  good:'Yes.',
  vague:'“Soon” is still doing the work. When, or after what?',
  close:'Could Priya put it on a calendar?'},
 c:{specific:/\d|\b(whether|about|if|consent|privacy|data|terms|retention|policy|review|approval|sign-off)\b/i,
  good:'You caught that one without a prompt. That’s the part that carries over to next Thursday.',
  vague:'Fair try. Which questions, though?',
  close:'Fair try. Which questions, though?'}
};
const state={stage:'a',fixedIt:false,done:{a:false,b:false,c:false}};
const anchor=s=>byId('anchor-'+s);
function text(s){return anchor(s).textContent.replace(/\s+/g,' ').trim();}
function setEditable(s,on){
 const el=anchor(s);
 if(on){el.contentEditable='true';el.setAttribute('role','textbox');el.setAttribute('aria-label','Your revision');el.spellcheck=true;el.classList.add('editing-now');el.focus();
  const range=document.createRange();range.selectNodeContents(el);const sel=getSelection();sel.removeAllRanges();sel.addRange(range);}
 else{el.removeAttribute('contenteditable');el.removeAttribute('role');el.removeAttribute('aria-label');el.classList.remove('editing-now');}
}
function reply(s,message,ok){const r=byId('reply-'+s);r.textContent=message;r.hidden=false;r.classList.toggle('ok',!!ok);}
function evaluate(s,value){
 const rule=rules[s];
 if(value.toLowerCase()===originals[s])return{ok:false,msg:'That’s the same phrase. Try changing it in the doc.'};
 if(rule.specific.test(value))return{ok:true,msg:rule.good};
 if(vague.test(value))return{ok:false,msg:rule.vague};
 return{ok:false,msg:rule.close};
}
function resolve(s){
 state.done[s]=true;setEditable(s,false);anchor(s).blur();getSelection().removeAllRanges();
 anchor(s).classList.remove('active','noticed','focus');anchor(s).classList.add('resolved');
 byId('comment-'+s).classList.add('is-resolved');
 for(const id of ['comment-'+s+'-actions','editing-'+s,'hint-'+s]){const el=byId(id);if(el)el.hidden=true;}
 byId('track-'+s).classList.add('reached');
 if(s==='a'){state.stage='b';byId('comment-b').hidden=false;anchor('b').classList.add('active');}
 if(s==='b'){state.stage='c';byId('comment-c').hidden=false;anchor('c').classList.add('noticed');}
 if(s==='c'){byId('doc-status').textContent='Ready to send';}
 layout();
}
function check(s){
 const value=text(s);
 if(!value){anchor(s).textContent=originals[s];reply(s,'The phrase is empty. Try writing a replacement.');layout();return;}
 const result=evaluate(s,value);reply(s,result.msg,result.ok);
 if(result.ok)resolve(s);else{setEditable(s,true);layout();}
}
function startEdit(s){
 byId('editing-'+s).hidden=false;
 byId('comment-'+s+'-actions').hidden=true;
 setEditable(s,true);layout();
}
byId('doc-margin').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.edit)startEdit(b.dataset.edit);
 else if(b.dataset.hint){const h=byId('hint-'+b.dataset.hint);h.hidden=!h.hidden;layout();}
 else if(b.dataset.check)check(b.dataset.check);
 else if(b.dataset.choice){
  const s=b.dataset.choice;anchor(s).textContent=b.dataset.text;
  for(const c of b.parentElement.children)c.setAttribute('aria-pressed',String(c===b));
  const result=evaluate(s,b.dataset.text);reply(s,result.msg,result.ok);
  if(result.ok)resolve(s);else layout();
 }
});
byId('fix-it').addEventListener('click',()=>{
 state.fixedIt=true;
 for(const s of ['a','b']){anchor(s).textContent=fixed[s];anchor(s).classList.add('rewritten');anchor(s).classList.remove('active');setEditable(s,false);}
 byId('comment-a-actions').hidden=true;byId('hint-a').hidden=true;byId('editing-a').hidden=true;
 byId('comment-a').classList.add('is-resolved');
 reply('a','Done. I rewrote two phrases. The update is better, but you didn’t practice anything, so next Thursday I’ll have to do this again.');
 byId('reply-a').insertAdjacentHTML('beforeend',' <button type="button" class="quiet inline" id="try-coached">Try it the coached way</button>');
 byId('try-coached').addEventListener('click',reset);
 byId('tracker').classList.add('stalled');
 byId('doc-status').textContent='Rewritten for you';
 layout();
});
byId('doc-body').addEventListener('keydown',e=>{
 const a=e.target.closest('.anchor');if(!a||a.contentEditable!=='true')return;
 if(e.key==='Enter'){e.preventDefault();check(a.dataset.step);}
});
byId('doc-body').addEventListener('paste',e=>{
 const a=e.target.closest('.anchor');if(!a||a.contentEditable!=='true')return;
 e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain').replace(/\s+/g,' '));
});
byId('doc-body').addEventListener('input',layout);
for(const s of ['a','b','c'])byId('comment-'+s).addEventListener('focusin',()=>focusPair(s));
function focusPair(s){for(const t of ['a','b','c']){anchor(t).classList.toggle('focus',t===s);byId('comment-'+t).classList.toggle('focus',t===s);}}
function layout(){
 const margin=byId('doc-margin');
 const stacked=getComputedStyle(margin).position!=='relative';
 const m=margin.getBoundingClientRect();
 let floor=0;
 for(const s of ['a','b','c']){
  const c=byId('comment-'+s);
  if(stacked||c.hidden){c.style.top='';continue;}
  const top=Math.max(anchor(s).getBoundingClientRect().top-m.top-12,floor);
  c.style.top=top+'px';floor=top+c.offsetHeight+12;
 }
 margin.style.minHeight=stacked?'':floor+'px';
}
function reset(){
 Object.assign(state,{stage:'a',fixedIt:false,done:{a:false,b:false,c:false}});
 for(const s of ['a','b','c']){
  const a=anchor(s);setEditable(s,false);a.textContent=originals[s];a.className='anchor';
  const r=byId('reply-'+s);r.hidden=true;r.textContent='';r.classList.remove('ok');
  byId('comment-'+s).classList.remove('is-resolved','focus');
  byId('comment-'+s+'-actions').hidden=false;byId('editing-'+s).hidden=true;
  const h=byId('hint-'+s);if(h)h.hidden=true;
  byId('track-'+s).classList.remove('reached');
 }
 for(const c of document.querySelectorAll('.choice'))c.removeAttribute('aria-pressed');
 anchor('a').classList.add('active');
 byId('comment-b').hidden=true;byId('comment-c').hidden=true;
 byId('tracker').classList.remove('stalled');byId('doc-status').textContent='Draft';
 layout();
}
byId('core-reset').addEventListener('click',reset);
reset();
let layoutFrame;
window.addEventListener('resize',()=>{if(layoutFrame)cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(layout);},{passive:true});
function renderContext(){
 const doc=byId('context-doc').checked,tracker=byId('context-tracker').checked,slack=byId('context-slack').checked;
 let response;
 if(!doc)response=(tracker||slack?'I can see what’s true about the project, but not what you wrote about it. ':'I can’t see anything. ')+'Without the draft, I have nothing to comment on.';
 else if(tracker&&slack)response='Your tracker shows 4 of 6 screens done and 2 in review; your draft says “good progress.” And the legal thread is about one question, data retention, which needs a decision by Friday. Which of those does Priya most need to hear from you?';
 else if(tracker)response='Your tracker shows 4 of 6 screens done and 2 in review. Your draft says “good progress.” What would Priya learn from the tracker that she can’t learn from your update?';
 else if(slack)response='The legal thread is about one question, data retention, and it needs a decision by Friday. “A few open questions” hides the thing Priya might need to act on.';
 else response='“Good progress” and “soon” are hard for Priya to act on. I can ask what changed, but I can’t tell whether what you wrote is accurate.';
 byId('context-reply').textContent=response;
 const list=byId('context-evidence');list.replaceChildren();
 const lines=[doc?'Sees: your draft':'Missing: your draft',tracker?'Sees: the project tracker':'Missing: what’s actually done',slack?'Sees: the #legal thread':'Missing: what legal is asking'];
 for(const text of lines){const li=document.createElement('li');li.textContent=text;list.append(li);}
}
for(const id of ['context-doc','context-tracker','context-slack'])byId(id).addEventListener('change',renderContext);
renderContext();

// Figure 3: Renatta's notebook
const observations=[
 ['Arroyo',1,55000,7],['Basin',2,180000,32],['Cedar',4,92000,21],['Divide',8,41000,11],['Elk',15,110000,34],['Flats',30,68000,24],
 ['Granite',60,34000,13],['Harbor',120,220000,103],['Ironwood',240,78000,39],['Juniper',480,43000,25],['Kettle',800,99000,57],['Lariat',1000,135000,88],
 ['Mesa',1.5,5000,3],['Notch',6,8000,5],['Oxbow',18,6500,1],['Pine',70,9000,1],['Quarry',350,4000,1]
].map(([name,x,pop,cases])=>({name,x,pop,cases,y:cases/pop*100000}));
const nb={rate:false,ran:false,simpleBridge:false};
function renderNbBars(){
 const rows=observations.map(o=>({...o,value:nb.rate?o.y:o.cases})).sort((a,b)=>b.value-a.value).slice(0,6);
 const max=rows[0].value,chart=byId('nb-bars');chart.replaceChildren();
 byId('nb-bars-title').textContent=nb.rate?'Reported cases per 100,000 people · top 6 counties':'Reported cases (count) · top 6 counties';
 chart.setAttribute('aria-label',byId('nb-bars-title').textContent);
 for(const row of rows){
  const li=document.createElement('li');
  const name=document.createElement('span');name.className='bar-name';name.textContent=row.name;
  const track=document.createElement('span');track.className='bar-track';track.setAttribute('aria-hidden','true');
  const fill=document.createElement('span');fill.className='bar-fill';fill.style.width=(row.value/max*100)+'%';track.append(fill);
  const value=document.createElement('span');value.className='bar-value';value.textContent=format(Math.round(row.value*10)/10);
  if(nb.rate&&row.pop<10000){li.classList.add('small');value.title=format(row.pop)+' people';}
  li.append(name,track,value);chart.append(li);
 }
}
const bridges={
 excel:['· based on: you know Excel','This line is a pivot table. <b>Rows:</b> county. <b>Values:</b> sum of cases.','I don’t really use pivot tables'],
 plain:['· updated: you told me','This line makes one row per county and adds up the cases in each. <code>groupby</code> means “sort into groups”; <code>.sum()</code> adds up each group.','Pivot tables do make sense to me']
};
function renderBridge(){const b=nb.simpleBridge?bridges.plain:bridges.excel;byId('nb-bridge-basis').textContent=b[0];byId('nb-bridge-text').innerHTML=b[1];byId('nb-bridge-toggle').textContent=b[2];}
byId('nb-bridge-toggle').addEventListener('click',()=>{nb.simpleBridge=!nb.simpleBridge;renderBridge();});
function nbReply(message,ok){const r=byId('nb-suggest-reply');r.textContent=message;r.hidden=false;r.classList.toggle('ok',!!ok);}
function openEditor(){byId('nb-edit').hidden=false;byId('nb-code2').classList.add('editing');const t=byId('nb-input');t.focus();t.setSelectionRange(t.value.length,t.value.length);}
byId('nb-try').addEventListener('click',()=>{openEditor();nbReply('Hint: a rate divides each county’s cases by its population. The data has a population column.');});
byId('nb-show').addEventListener('click',()=>{const d=byId('nb-diff');d.hidden=!d.hidden;byId('nb-show').textContent=d.hidden?'Show the alternative':'Hide the alternative';if(!d.hidden)openEditor();});
byId('nb-keep').addEventListener('click',()=>{byId('nb-suggest-actions').hidden=true;nbReply('Fine. Counts are the right measure for some questions, like planning how many staff each county needs. I won’t bring this up again on this chart.');byId('nb-suggest').classList.add('is-resolved');});
function runCell(){
 const code=byId('nb-input').value.trim();nb.ran=true;
 const usesPop=/population/.test(code),divides=/\//.test(code);
 byId('nb-expr').textContent=code.replace(/^by_county\s*=\s*/,'');
 byId('nb-prompt2').textContent='In [4]:';byId('nb-outprompt2').textContent='Out[4]:';
 if(usesPop&&divides){
  nb.rate=true;renderNbBars();
  byId('nb-edit').hidden=true;byId('nb-diff').hidden=true;byId('nb-code2').classList.remove('editing');byId('nb-suggest-actions').hidden=true;
  byId('nb-suggest').classList.add('is-resolved');
  nbReply('Now Lariat is first, and Harbor drops off the list. Notice Notch and Mesa: very small counties with 5 and 3 cases. Rates for small places jump around. Counts answer “where are the most cases?” Rates answer “where is it most common?” Which question is the board asking?',true);
 }else{
  nb.rate=false;renderNbBars();
  nbReply(usesPop?'Close. You’re using population, but the cases need to be divided by it.':'That ran, but it’s still counting cases. Try dividing by the population column.');
 }
}
byId('nb-run').addEventListener('click',runCell);
byId('nb-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.shiftKey||e.metaKey||e.ctrlKey)){e.preventDefault();runCell();}});

const svg=byId('scatter-chart');
const svgNS='http://www.w3.org/2000/svg';
function element(name,attrs={},text){const node=document.createElementNS(svgNS,name);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,String(value));if(text!==undefined)node.textContent=text;return node;}
function renderScatter(){
 const log=byId('scatter-log').checked,filter=byId('scatter-filter').checked;
 const selected=observations.filter(p=>!filter||p.pop>=10000);
 const width=Math.max(240,Math.round(svg.parentElement.clientWidth||640));
 const height=width<420?280:310;
 const margin={left:43,right:18,top:36,bottom:50},plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
 const xPos=x=>margin.left+(log?Math.log10(x)/3:(x-1)/999)*plotW;
 const yPos=y=>margin.top+(1-y/80)*plotH;
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.replaceChildren();
 svg.append(element('title',{id:'scatter-svg-title'},`County data on a ${log?'logarithmic':'linear'} x-axis`));
 svg.append(element('desc',{id:'scatter-svg-desc'},`${selected.length} of ${observations.length} counties shown. ${filter?'Counties with fewer than 10,000 people are excluded.':'All counties are included.'}`));
 svg.append(element('text',{x:margin.left,y:18},'rate (cases / 100,000)'));
 for(const value of [0,20,40,60,80]){
  const y=yPos(value);svg.append(element('line',{x1:margin.left,y1:y,x2:width-margin.right,y2:y,stroke:'#e6e6e2'}));
  svg.append(element('text',{x:margin.left-9,y:y+5,'text-anchor':'end'},String(value)));
 }
 const ticks=log?[1,10,100,1000]:(width<400?[1,500,1000]:[1,250,500,750,1000]);
 for(const value of ticks){const x=xPos(value);svg.append(element('line',{x1:x,y1:height-margin.bottom,x2:x,y2:height-margin.bottom+5,stroke:'#999994'}));svg.append(element('text',{x,y:height-margin.bottom+23,'text-anchor':value===1?'start':value===1000?'end':'middle'},format(value)));}
 svg.append(element('line',{x1:margin.left,y1:height-margin.bottom,x2:width-margin.right,y2:height-margin.bottom,stroke:'#999994'}));
 svg.append(element('text',{x:margin.left+plotW/2,y:height-7,'text-anchor':'middle'},`exposure${log?' (log scale)':''}`));
 for(const p of selected){
  const circle=element('circle',{cx:xPos(p.x),cy:yPos(p.y),r:5,fill:p.pop<10000?'#fff':'#47636b',stroke:p.pop<10000?'#777772':'#47636b','stroke-width':1.5});
  circle.append(element('title',{},`${p.name}: exposure ${p.x}, rate ${format(Math.round(p.y))}, population ${format(p.pop)}`));svg.append(circle);
 }
 byId('scatter-count').textContent=`${selected.length} of ${observations.length} counties shown · ${filter?'5 small counties dropped':'hollow points are counties under 10,000 people'}`;
 byId('scatter-explanation').textContent=(log?'A log axis gives equal space to each tenfold step: 1 to 10, 10 to 100, 100 to 1,000. The points spread out and a trend appears. ':'On a linear axis, most counties are squeezed against the left edge. ')+(filter?'Dropping five small counties makes the pattern look tidier, but those places are no longer in the analysis.':'The hollow points are small counties. Their rates are noisy, but they are real places.');
 const body=byId('scatter-data');body.replaceChildren();
 for(const p of observations){const row=document.createElement('tr');const name=document.createElement('th');name.scope='row';name.textContent=p.name;row.append(name);for(const value of [p.x,p.cases,p.pop,Math.round(p.y*10)/10]){const cell=document.createElement('td');cell.textContent=format(value);row.append(cell);}body.append(row);}
}
for(const id of ['scatter-log','scatter-filter'])byId(id).addEventListener('change',renderScatter);
byId('nb-why-done').addEventListener('click',()=>{
 const t=byId('nb-why-input').value.trim(),r=byId('nb-why-reply');r.hidden=false;
 const reasons=/because|since|so that|so |otherwise|but |noisy|small|few|represent|spread|ratio|tenfold|skew/i.test(t);
 if(t.length<15){r.classList.remove('ok');r.textContent='A sentence or two is enough. What would you tell the board?';return;}
 r.classList.toggle('ok',reasons);
 r.textContent=reasons?'Good. That note is for the board, and for you the next time a chart looks too clean. Now go ahead and change your cell, or don’t.':'That’s a decision. Can you add the reason, the “because”?';
});
function resetNotebook(){
 Object.assign(nb,{rate:false,ran:false,simpleBridge:false});
 const original='by_county = df.groupby("county")["cases"].sum()';
 byId('nb-input').value=original;byId('nb-expr').textContent=original.replace(/^by_county\s*=\s*/,'');
 byId('nb-prompt2').textContent='In [2]:';byId('nb-outprompt2').textContent='Out[2]:';
 for(const id of ['nb-edit','nb-diff','nb-suggest-reply','nb-why-reply'])byId(id).hidden=true;
 byId('nb-suggest-actions').hidden=false;byId('nb-suggest').classList.remove('is-resolved');byId('nb-show').textContent='Show the alternative';
 byId('nb-code2').classList.remove('editing');
 byId('scatter-log').checked=false;byId('scatter-filter').checked=false;byId('nb-why-input').value='';
 renderBridge();renderNbBars();renderScatter();
}
byId('nb-reset').addEventListener('click',resetNotebook);
resetNotebook();
let resizeFrame;
window.addEventListener('resize',()=>{if(resizeFrame)cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(renderScatter);},{passive:true});
function updateProgress(){const distance=document.documentElement.scrollHeight-window.innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,window.scrollY/distance)):0})`;}
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
