import {sounds} from './sounds.js';
import {load,save,clear,samples} from './storage.js';
import {videoChoices,gameChoices} from './resources.js';
const $=id=>document.getElementById(id);
let state=load(), sound=(sounds.some(item=>item.id===state.sound)||videoChoices.some(item=>item.id===state.sound))?state.sound:sounds[0].id, ctx, master, voices=[], last=0;
let recording=null;
const saved=()=>{$('saved').textContent=save(state)?'Saved in this browser • on this computer only':'Saving is unavailable in this browser. You can still play.';};
function show(){ $('start').hidden=true;$('studio').hidden=false;$('echo').textContent=state.message;$('reply').textContent=state.reply;showRecommendation(); }
if(typeof state.message==='string'&&typeof state.reply==='string')show();
for(const text of samples){const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{$('feeling').value=text;};$('samples').append(b);}
$('form').onsubmit=async e=>{e.preventDefault();const message=$('feeling').value.trim();if(!message)return;$('next').disabled=true;$('next').textContent='Thinking…';$('error').textContent='';try{const choices=[...sounds.map(({id,name,category})=>({id,name,type:'sound',category})),...videoChoices];const r=await fetch('/api/calm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,choices})});const data=await r.json();if(!r.ok){const detail=data.error||{};throw Error(detail.message||'The AI could not answer just now.');}state={message,reply:data.reply,sound:data.recommendation};sound=data.recommendation;saved();show();select();}catch(e){$('error').textContent=e.message.includes('fetch')?'Could not connect to the app. Please check that it is running, then try again.':e.message;}finally{$('next').disabled=false;$('next').textContent='Next →';}};
for(const item of sounds){const b=document.createElement('button');b.type='button';b.dataset.sound=item.id;b.textContent=item.icon+' '+item.name;b.title=item.category;document.querySelector('.sounds').append(b);}
function select(){$('peel-game').hidden=sound!=='peel';$('pad').hidden=sound==='peel'||videoChoices.some(x=>x.id===sound);document.querySelectorAll('[data-sound]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sound===sound)));}
function addResourceLink(container,item){const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.name+' ↗';container.append(a);}
function showRecommendation(){const chosen=sounds.find(x=>x.id===sound);const video=videoChoices.find(x=>x.id===sound);$('recommendation').replaceChildren();const label=document.createElement('strong');label.textContent=video?'AI pick: '+video.name:'AI pick: '+(chosen?.name||'a gentle sound');$('recommendation').append(label);if(video){const a=document.createElement('a');a.href=video.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Play recommended video ↗';$('recommendation').append(a);}else if(chosen){const b=document.createElement('button');b.type='button';b.className='primary';b.textContent='Play '+chosen.name;b.onclick=play;$('recommendation').append(b);}const videos=$('other-videos');videos.replaceChildren();for(const item of videoChoices.filter(x=>x.id!==sound))addResourceLink(videos,item);const games=$('other-games');games.replaceChildren();for(const item of gameChoices)addResourceLink(games,item);}
select();document.querySelectorAll('[data-sound]').forEach(b=>b.onclick=()=>{stop();sound=b.dataset.sound;state.sound=sound;if(state.reply)saved();select();showRecommendation();});
async function play(){try{const chosen=sounds.find(item=>item.id===sound);if(!chosen){$('sound-status').textContent='Open the recommended video with the link above.';return;}if(chosen.src){if(recording)return;const audio=new Audio(chosen.src);recording=audio;audio.volume=Math.min(1,Number($('volume').value)/100*(chosen.volumeBoost||1));audio.onended=()=>{if(recording===audio){recording=null;$('sound-status').textContent='Recording finished. Tap to play again.';}};audio.onerror=()=>{if(recording===audio){recording=null;$('sound-status').textContent='This recording could not play. Please try another sound.';}};$('sound-status').textContent='Loading '+chosen.name+'…';await audio.play();if(recording===audio)$('sound-status').textContent='Playing '+chosen.name+' • '+chosen.credit;return;}ctx ||= new AudioContext();await ctx.resume();if(!master){master=ctx.createGain();master.gain.value=Number($('volume').value)/100;master.connect(ctx.destination);}const now=ctx.currentTime;if(now-last<.10)return;last=now;const item=chosen;const duration=item.duration;const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate);const arr=buffer.getChannelData(0);let smooth=0;for(let i=0;i<arr.length;i++){const noise=Math.random()*2-1;smooth=.96*smooth+.04*noise;arr[i]=item.texture==='tap'?smooth*3:item.texture==='noise'?noise*.18:smooth*2;}const src=ctx.createBufferSource();src.buffer=buffer;const gain=ctx.createGain();gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.7,now+.025);gain.gain.exponentialRampToValueAtTime(.001,now+duration);src.connect(gain).connect(master);src.start();voices.push(src);src.onended=()=>{voices=voices.filter(v=>v!==src);src.disconnect();gain.disconnect();};$('sound-status').textContent='Making '+chosen.name+' • tap again or move across the pad.';}catch{$('sound-status').textContent='Sound could not start. Try another browser or check your device sound.';}}
function stop(){if(recording){recording.pause();recording.currentTime=0;recording=null;}voices.forEach(v=>{try{v.stop();}catch{}});voices=[];$('sound-status').textContent='Sound stopped. Start again whenever you like.';}
$('pad').onpointerdown=play;$('pad').onpointermove=e=>{if(e.pointerType==='mouse'||e.buttons)play();};$('pad').onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();play();}};
$('volume').oninput=()=>{if(recording)recording.volume=Number($('volume').value)/100;if(master)master.gain.setTargetAtTime(Number($('volume').value)/100,ctx.currentTime,.025);};$('stop').onclick=stop;
$('again').onclick=()=>{stop();$('studio').hidden=true;$('start').hidden=false;$('feeling').value='';$('feeling').focus();};
$('forget').onclick=()=>{if(clear()){state={};stop();$('studio').hidden=true;$('start').hidden=false;$('feeling').value='';$('saved').textContent='Saved check-in cleared.';}else $('saved').textContent='Could not clear browser storage.';};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});



// One small peel activity: movement reveals the surface and makes a short sound.
let peeled=0, peelDrag=null, peelStopped=false;
const film=$('peel-film'), surface=$('peel-surface');
function renderPeel(){
  film.style.clipPath=`polygon(${peeled}% 0,100% 0,100% 100%,${peeled}% 100%)`;
  $('peel-status').textContent=peeled>=100?'All peeled! Start again whenever you like.':`${Math.round(peeled)}% peeled • move slowly and enjoy the sound.`;
  $('peel-step').disabled=peeled>=100;
}
function advancePeel(value){if(peeled>=100)return;const next=Math.min(100,Math.max(peeled,value));if(next>peeled){peeled=next;renderPeel();play();}}
surface.onpointerdown=e=>{if(sound!=='peel'||peeled>=100)return;peelStopped=false;peelDrag={id:e.pointerId,x:e.clientX,start:peeled};surface.setPointerCapture(e.pointerId);};
surface.onpointermove=e=>{if(!peelDrag||e.pointerId!==peelDrag.id||peelStopped)return;advancePeel(peelDrag.start+Math.max(0,e.clientX-peelDrag.x)/surface.getBoundingClientRect().width*100);};
surface.onpointerup=surface.onpointercancel=()=>{peelDrag=null;};
$('peel-step').onclick=()=>{peelStopped=false;advancePeel(peeled+10);};
$('peel-reset').onclick=()=>{stop();peeled=0;renderPeel();};
const previousStop=$('stop').onclick;
$('stop').onclick=()=>{peelDrag=null;peelStopped=true;previousStop();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)peelDrag=null;});


