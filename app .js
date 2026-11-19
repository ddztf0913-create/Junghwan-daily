const SUPABASE_URL="https://rzlywtntvxxifobdcyxl.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_4ExQliFJT4XznmguVkDT3Q_JH2V8g3g";
const ADMIN_EMAIL="180498829@qq.com",BUCKET="daily-photos",GALLERY_TAG="__GALLERY_ONLY__";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY),$=id=>document.getElementById(id);
let entries=[],viewMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1),selectedDate=localISO(new Date()),activeCategory='text',lightboxImages=[],lightboxIndex=0;
function localISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=s=>s?new Date(s+"T00:00:00").toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"}):"";
const dailyEntries=()=>entries.filter(e=>e.city!==GALLERY_TAG);
const galleryEntries=()=>entries.filter(e=>e.city===GALLERY_TAG);
const openAdmin=()=>$('admin-modal').classList.remove('hidden');
$('admin-open').onclick=openAdmin;$('nav-admin').onclick=openAdmin;
$('modal-close').onclick=()=>$('admin-modal').classList.add('hidden');
$('admin-modal').onclick=e=>{if(e.target.id==='admin-modal')e.currentTarget.classList.add('hidden')};
$('month-prev').onclick=()=>{viewMonth=new Date(viewMonth.getFullYear(),viewMonth.getMonth()-1,1);renderCalendar()};
$('month-next').onclick=()=>{viewMonth=new Date(viewMonth.getFullYear(),viewMonth.getMonth()+1,1);renderCalendar()};
function renderCalendar(){
 const y=viewMonth.getFullYear(),m=viewMonth.getMonth(),first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
 $('month-label').textContent=`${y}年 ${String(m+1).padStart(2,'0')}月`;
 const byDate=new Map();dailyEntries().forEach(e=>{if(!byDate.has(e.entry_date))byDate.set(e.entry_date,[]);byDate.get(e.entry_date).push(e)});
 let html='';for(let i=0;i<first;i++)html+='<span class="calendar-blank"></span>';
 for(let d=1;d<=days;d++){const date=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,items=byDate.get(date)||[],dot=items.length?(items.some(x=>x.photos?.length)?'photo-dot':items.some(x=>x.videos?.length)?'video-dot':items.some(x=>x.content||x.stickers?.length)?'story-dot':'plain-dot'):'';html+=`<button class="calendar-day ${date===selectedDate?'selected':''} ${date===localISO(new Date())?'today':''}" data-date="${date}"><span>${d}</span>${dot?`<i class="${dot}"></i>`:''}</button>`}
 $('calendar-days').innerHTML=html;
 document.querySelectorAll('.calendar-day').forEach(b=>b.onclick=()=>{selectedDate=b.dataset.date;renderCalendar();renderSelectedDay()});
 renderSelectedDay();
}
function renderSelectedDay(){
 $('selected-date-title').textContent=fmt(selectedDate);
 const rows=dailyEntries().filter(e=>e.entry_date===selectedDate).sort((a,b)=>(b.created_at||'').localeCompare(a.created_at||''));
 const texts=rows.filter(e=>(e.title||e.content||'').trim()).map(e=>({title:e.title,city:e.city,content:e.content,date:e.entry_date}));
 const images=rows.flatMap(e=>(e.photos||[]).map(url=>({url,date:e.entry_date,title:e.title})));
 const videos=rows.flatMap(e=>(e.videos||[]).map(url=>({url,date:e.entry_date,title:e.title})));
 const stickers=rows.flatMap(e=>(e.stickers||[]).map(value=>({value,date:e.entry_date,title:e.title})));
 const numOf=e=>Number.parseInt(String(e.content||e.title||"").replace(/[^0-9-]/g,""),10)||0;
 const textCount=texts.reduce((s,e)=>s+numOf(e),0);
 $('count-text').textContent=textCount;$('count-stickers').textContent=stickers.length;$('count-images').textContent=images.length;$('count-videos').textContent=videos.length;
 const data={text:texts,stickers,images,videos}[activeCategory];
 if(activeCategory==='text'){
  $('daily-category-content').innerHTML=data.length?data.map(e=>`<article class="entry-card"><div class="entry-meta"><span class="entry-date">${esc(fmt(e.date))}</span><span>✳ DAILY LOG</span></div><h3>${esc(e.title)}</h3></article>`).join(''):`<div class="category-empty">还没有文字记录 ♡</div>`;
 }else if(activeCategory==='images'){
  lightboxImages=images.map(x=>x.url);
  $('daily-category-content').innerHTML=data.length?`<div class="day-image-grid">${data.map((e,i)=>`<button class="day-image-button" data-image-index="${i}" aria-label="查看图片"><img src="${esc(e.url)}" loading="lazy" alt="Daily photo"><span>${esc(e.title||e.date)}</span></button>`).join('')}</div>`:`<div class="category-empty">这一天还没有图片 ♡</div>`;
  document.querySelectorAll('[data-image-index]').forEach(b=>b.onclick=()=>openLightbox(Number(b.dataset.imageIndex)));
 }else if(activeCategory==='videos'){
  $('daily-category-content').innerHTML=data.length?`<div class="day-video-list">${data.map(e=>`<article class="day-video-card"><video src="${esc(e.url)}" controls playsinline preload="metadata"></video><p>${esc(e.title||e.date)}</p></article>`).join('')}</div>`:`<div class="category-empty">这一天还没有视频 ♡</div>`;
 }else{
  $('daily-category-content').innerHTML=data.length?`<div class="sticker-wall">${data.map(e=>`<div class="sticker-tile"><span>${esc(e.value)}</span><small>${esc(e.title||e.date)}</small></div>`).join('')}</div>`:`<div class="category-empty">这一天还没有表情包 ♡</div>`;
 }
 document.querySelectorAll('.daily-category').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));
}
function openLightbox(index){lightboxIndex=index;$('lightbox-image').src=lightboxImages[lightboxIndex];$('lightbox-caption').textContent=`${lightboxIndex+1} / ${lightboxImages.length}`;$('image-lightbox').classList.remove('hidden')}
function moveLightbox(delta){if(!lightboxImages.length)return;lightboxIndex=(lightboxIndex+delta+lightboxImages.length)%lightboxImages.length;openLightbox(lightboxIndex)}
$('lightbox-close').onclick=()=>$('image-lightbox').classList.add('hidden');$('lightbox-prev').onclick=()=>moveLightbox(-1);$('lightbox-next').onclick=()=>moveLightbox(1);$('image-lightbox').onclick=e=>{if(e.target.id==='image-lightbox')e.currentTarget.classList.add('hidden')};
document.querySelectorAll('.daily-category').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.category;renderSelectedDay()});
function renderGallery(){const pics=galleryEntries().flatMap(e=>(e.photos||[]).map(url=>({url,date:e.entry_date}))).concat(dailyEntries().flatMap(e=>(e.photos||[]).map(url=>({url,date:e.entry_date}))));
 lightboxImages=pics.map(p=>p.url);$('gallery').innerHTML=pics.length?pics.map((p,i)=>`<figure class="gallery-item"><button class="gallery-open-photo" data-gallery-index="${i}" aria-label="查看照片"><img class="gallery-photo" src="${esc(p.url)}" loading="lazy" alt="Gallery memory"></button><figcaption>${esc(p.date||'JUNG HWAN DAILY')}</figcaption></figure>`).join(''):`<div class="gallery-note">Your favorite moments<br>will live here ♡</div><div class="gallery-note pale">A collection of<br>soft memories ✳</div><div class="gallery-note pink">Always cheering<br>for you ♡</div>`;document.querySelectorAll('[data-gallery-index]').forEach(b=>b.onclick=()=>openLightbox(Number(b.dataset.galleryIndex)));
}
function render(){renderCalendar();renderGallery();manage()}
async function load(){const {data,error}=await db.from('daily_entries').select('*').order('entry_date',{ascending:false}).order('created_at',{ascending:false});if(error){console.error(error);$('daily-category-content').innerHTML='<div class="empty-state">暂时无法读取记录，请稍后刷新。</div>';return}entries=data||[];render()}
async function session(){const {data:{session}}=await db.auth.getSession(),ok=session?.user?.email?.toLowerCase()===ADMIN_EMAIL.toLowerCase();$('admin-panel').classList.toggle('hidden',!ok);if(ok)$('login-message').textContent=`Signed in as ${session.user.email}`;return ok}
$('login-form').onsubmit=async e=>{e.preventDefault();const email=$('admin-email').value.trim().toLowerCase();if(email!==ADMIN_EMAIL){$('login-message').textContent='This email is not authorized.';return}$('login-message').textContent='Sending secure sign-in link...';const {error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});$('login-message').textContent=error?error.message:'Magic link sent! Check your inbox and open it on this device.'};
db.auth.onAuthStateChange(async()=>{await session();await load()});
$('logout-btn').onclick=async()=>{await db.auth.signOut();$('login-message').textContent='Signed out.';await session()};
async function upload(files){const urls=[];for(const f of files){if(!f.type.startsWith('image/')&&!f.type.startsWith('video/'))continue;const name=f.name.replace(/[^a-zA-Z0-9._-]/g,'-'),path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}-${name}`;const {error}=await db.storage.from(BUCKET).upload(path,f,{contentType:f.type});if(error)throw error;urls.push(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)}return urls}
$('entry-form').onsubmit=async e=>{e.preventDefault();$('entry-message').textContent='Publishing...';if(!await session()){$('entry-message').textContent='Please sign in first.';return}try{const id=$('entry-id').value,old=entries.find(x=>x.id===id),photos=[...(old?.photos||[]),...await upload([...$('entry-photos').files])],videos=[...(old?.videos||[]),...await upload([...$('entry-videos').files])],stickers=$('entry-stickers').value.split(/[\s,，]+/).map(x=>x.trim()).filter(Boolean),payload={entry_date:$('entry-date').value,title:$('entry-title').value.trim(),city:$('entry-city').value.trim(),content:$('entry-content').value.trim(),photos,videos,stickers};const result=id?await db.from('daily_entries').update(payload).eq('id',id):await db.from('daily_entries').insert(payload);if(result.error)throw result.error;$('entry-form').reset();$('entry-id').value='';$('entry-date').value=localISO(new Date());$('entry-message').textContent='Published successfully ♡';await load()}catch(err){$('entry-message').textContent='Could not publish: '+err.message}};
$('gallery-upload-form').onsubmit=async e=>{e.preventDefault();$('gallery-upload-message').textContent='Uploading photos...';if(!await session()){$('gallery-upload-message').textContent='Please sign in first.';return}try{const urls=await upload([...$('gallery-photo-files').files]);if(!urls.length)throw new Error('请选择图片');const payload={entry_date:$('gallery-photo-date').value,title:'PHOTO GALLERY',city:GALLERY_TAG,content:'',photos:urls};const {error}=await db.from('daily_entries').insert(payload);if(error)throw error;$('gallery-upload-form').reset();$('gallery-photo-date').value=localISO(new Date());$('gallery-upload-message').textContent=`Uploaded ${urls.length} photo(s) ♡`;await load()}catch(err){$('gallery-upload-message').textContent='Upload failed: '+err.message}};
function manage(){if($('admin-panel').classList.contains('hidden'))return;$('manage-list').innerHTML=entries.map(e=>`<div class="manage-item"><span>${esc(e.entry_date)} · ${esc(e.city===GALLERY_TAG?'PHOTO GALLERY':e.title)}</span><span>${e.city===GALLERY_TAG?'PHOTO':''} <button data-del="${esc(e.id)}">DELETE</button></span></div>`).join('');document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const e=entries.find(x=>x.id===b.dataset.edit);$('entry-id').value=e.id;$('entry-date').value=e.entry_date;$('entry-title').value=e.title;$('entry-city').value=e.city||'';$('entry-content').value=e.content||'';$('entry-message').textContent='Editing: selected new photos will be added.'});document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(confirm('Delete this record?')){const {error}=await db.from('daily_entries').delete().eq('id',b.dataset.del);if(error)alert(error.message);else load()}})}
$('entry-date').value=localISO(new Date());$('gallery-photo-date').value=localISO(new Date());session().then(load);
//（注：内容由AI生成）
