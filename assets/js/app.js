
const $ = (s)=>document.querySelector(s);
const fmtDate = (iso)=> new Date(iso+"T00:00:00").toLocaleDateString('es-AR',{year:'numeric',month:'short',day:'numeric'});
const readingTime = (txt)=>{
  const words = (txt||'').replace(/[#>*`]/g,'').split(/\s+/).filter(Boolean).length;
  const min = Math.max(1, Math.round(words / 220));
  return `${min} min`;
};
function miniMarkdown(s=''){
  return s
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code>$1</code>')
    .replace(/^- (.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>')
    .replace(/\n{2,}/g,'</p><p>')
    .replace(/\n/g,'<br>')
    .replace(/^(.+)$/,'<p>$1</p>');
}
function openReader(p){
  $('#reader-title').textContent = p.title;
  $('#reader-date').textContent = fmtDate(p.date);
  $('#reader-read').textContent = readingTime(p.content || p.body || '');
  $('#reader-tags').innerHTML = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join(' ');
  const rc = $('#reader-cover');
  if(p.cover){ rc.style.display='block'; rc.style.backgroundImage = `url('${p.cover}')`; }
  else { rc.style.display='none'; rc.style.backgroundImage=''; }
  $('#reader-content').innerHTML = miniMarkdown(p.content || p.body || '');
  const bd = $('#reader'); bd.style.display='flex'; bd.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeReader(){ const bd = $('#reader'); bd.style.display='none'; bd.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeReader(); });


async function fetchWithFallback(url, fallbackId){
  try{
    const r = await fetch(url, {cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    return await r.json();
  }catch(e){
    const el = document.getElementById(fallbackId);
    if(el){
      try{ return JSON.parse(el.textContent); }catch(parseErr){ console.error('Fallback parse error', parseErr); }
    }
    console.error('fetchWithFallback failed', e);
    return null;
  }
}
