const SUPABASE_URL="https://rzlywtntvxxifobdcyxl.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_4ExQliFJT4XznmguVkDT3Q_JH2V8g3g";
const ADMIN_EMAIL="180498829@qq.com",BUCKET="daily-photos";
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY),$=id=>document.getElementById(id);
let entries=[];
$("admin-open").onclick=()=>$("admin-modal").classList.remove("hidden");
$("modal-close").onclick=()=>$("admin-modal").classList.add("hidden");
$("admin-modal").onclick=e=>{if(e.target.id==="admin-modal")e.currentTarget.classList.add("hidden")};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=s=>s?new Date(s+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}).toUpperCase():"";
function render(){
 const q=$("search-input").value.toLowerCase(),y=$("year-filter").value;
 const rows=entries.filter(e=>`${e.title} ${e.city||""} ${e.content||""} ${e.entry_date}`.toLowerCase().includes(q)&&(y==="all"||e.entry_date.startsWith(y)));
 $("entries").innerHTML=rows.length?rows.map(e=>`<article class="entry-card"><div class="entry-meta"><span class="entry-date">${fmt(e.entry_date)}</span><span>✳ DAILY LOG</span></div><h3>${esc(e.title)}</h3>${e.city?`<div class="entry-city">⌖ ${esc(e.city)}</div>`:""}${e.content?`<div class="entry-content">${esc(e.content)}</div>`:""}${e.photos?.length?`<div class="entry-photos">${e.photos.map(u=>`<img src="${esc(u)}" loading="lazy" alt="Memory">`).join("")}</div>`:""}</article>`).join(""):`<div class="empty-state"><span>♡</span><h3>No memories found</h3><p>Try another keyword or come back later.</p></div>`;
 const pics=entries.flatMap(e=>e.photos||[]).slice(0,9);
 $("gallery").innerHTML=pics.length?pics.map(u=>`<img class="gallery-photo" src="${esc(u)}" loading="lazy" alt="Gallery memory">`).join(""):`<div class="gallery-note">Your favorite moments<br>will live here ♡</div><div class="gallery-note pale">A collection of<br>soft memories ✳</div><div class="gallery-note pink">Always cheering<br>for you ♡</div>`;
 manage();
}
async function load(){
 const {data,error}=await db.from("daily_entries").select("*").order("entry_date",{ascending:false}).order("created_at",{ascending:false});
 if(error){console.error(error);return}entries=data||[];
 const years=[...new Set(entries.map(e=>e.entry_date?.slice(0,4)).filter(Boolean))].sort().reverse();
 $("year-filter").innerHTML='<option value="all">ALL YEARS</option>'+years.map(y=>`<option>${y}</option>`).join("");render();
}
$("search-input").oninput=render;$("year-filter").onchange=render;
async function session(){
 const {data:{session}}=await db.auth.getSession(),ok=session?.user?.email?.toLowerCase()===ADMIN_EMAIL.toLowerCase();
 $("admin-panel").classList.toggle("hidden",!ok);
 if(ok)$("login-message").textContent=`Signed in as ${session.user.email}`;
 return ok;
}
$("login-form").onsubmit=async e=>{
 e.preventDefault();const email=$("admin-email").value.trim().toLowerCase();
 if(email!==ADMIN_EMAIL){$("login-message").textContent="This email is not authorized.";return}
 $("login-message").textContent="Sending secure sign-in link...";
 const {error}=await db.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
 $("login-message").textContent=error?error.message:"Magic link sent! Check your inbox and open it on this device.";
};
db.auth.onAuthStateChange(async()=>{await session();await load()});
$("logout-btn").onclick=async()=>{await db.auth.signOut();$("login-message").textContent="Signed out.";await session()};
async function upload(files){
 const urls=[];for(const f of files){if(!f.type.startsWith("image/"))continue;
 const name=f.name.replace(/[^a-zA-Z0-9._-]/g,"-"),path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}-${name}`;
 const {error}=await db.storage.from(BUCKET).upload(path,f,{contentType:f.type});if(error)throw error;
 urls.push(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl)}return urls;
}
$("entry-form").onsubmit=async e=>{
 e.preventDefault();$("entry-message").textContent="Publishing...";
 if(!await session()){$("entry-message").textContent="Please sign in first.";return}
 try{const id=$("entry-id").value,old=entries.find(x=>x.id===id),photos=[...(old?.photos||[]),...await upload([...$("entry-photos").files])];
 const payload={entry_date:$("entry-date").value,title:$("entry-title").value.trim(),city:$("entry-city").value.trim(),content:$("entry-content").value.trim(),photos};
 const result=id?await db.from("daily_entries").update(payload).eq("id",id):await db.from("daily_entries").insert(payload);
 if(result.error)throw result.error;$("entry-form").reset();$("entry-id").value="";$("entry-date").value=new Date().toISOString().slice(0,10);
 $("entry-message").textContent="Published successfully ♡";await load();
 }catch(err){$("entry-message").textContent="Could not publish: "+err.message}
};
function manage(){
 if($("admin-panel").classList.contains("hidden"))return;
 $("manage-list").innerHTML=entries.map(e=>`<div class="manage-item"><span>${esc(e.entry_date)} · ${esc(e.title)}</span><span><button data-edit="${esc(e.id)}">EDIT</button> <button data-del="${esc(e.id)}">DELETE</button></span></div>`).join("");
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{const e=entries.find(x=>x.id===b.dataset.edit);$("entry-id").value=e.id;$("entry-date").value=e.entry_date;$("entry-title").value=e.title;$("entry-city").value=e.city||"";$("entry-content").value=e.content||"";$("entry-message").textContent="Editing: selected new photos will be added.";});
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this memory?")){const {error}=await db.from("daily_entries").delete().eq("id",b.dataset.del);if(error)alert(error.message);else load()}});
}
$("entry-date").value=new Date().toISOString().slice(0,10);session().then(load);