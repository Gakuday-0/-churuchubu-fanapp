const members=[
  ["01","一ノ瀬まりん","MARIN"],
  ["02","小泉おと","OTO"],
  ["03","東雲かれん","KAREN"],
  ["04","泣久那くな","KUNA"],
  ["05","椿木あのん","ANON"]
];

const setlists=[
  // ここに過去セトリを追加: {date:"2026.09.03",title:"公演名",songs:["曲名","曲名"]}
];

const liveList=document.getElementById("liveList");
liveList.innerHTML=`<article class="live-card">
  <div class="live-date">LATEST / OFFICIAL ANNOUNCEMENT</div>
  <h3>次回ライブ情報</h3>
  <div class="live-meta">開催日・会場・出演時間は公式Xの最新告知をご確認ください。</div>
  <div class="live-actions"><a class="mini-btn" href="https://x.com/tulle_tube2025" target="_blank" rel="noopener">公式X ↗</a></div>
</article>`;

document.getElementById("memberGrid").innerHTML=members.map(([n,j,e])=>`
  <article class="member-card"><span class="member-num">${n}</span>
    <div class="member-name">${j}</div><div class="member-en">${e}</div>
  </article>`).join("");

const setlistEl=document.getElementById("setlistList");
const search=document.getElementById("setlistSearch");
function renderSetlists(q=""){
  const rows=setlists.filter(x=>(x.title+x.date+x.songs.join(" ")).toLowerCase().includes(q.toLowerCase()));
  setlistEl.innerHTML=rows.length?rows.map(x=>`<article class="set-card"><b>${x.title}</b><span>${x.date}　${x.songs.join(" / ")}</span></article>`).join("")
  :`<div class="empty">まだセトリデータを登録していません。<br>追加したデータはここで検索できます。</div>`;
}
renderSetlists(); search.addEventListener("input",e=>renderSetlists(e.target.value));

const drawer=document.getElementById("drawer"),back=document.getElementById("drawerBackdrop");
function closeMenu(){drawer.classList.remove("open");back.classList.remove("open");document.getElementById("menuBtn").setAttribute("aria-expanded","false")}
document.getElementById("menuBtn").addEventListener("click",()=>{drawer.classList.toggle("open");back.classList.toggle("open");document.getElementById("menuBtn").setAttribute("aria-expanded",drawer.classList.contains("open"))});
document.getElementById("drawerClose").addEventListener("click",closeMenu);back.addEventListener("click",closeMenu);
document.querySelectorAll(".drawer a").forEach(a=>a.addEventListener("click",closeMenu));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{
  const id=a.getAttribute("href").slice(1),el=document.getElementById(id);
  if(el) setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"start"}),0);
}));
