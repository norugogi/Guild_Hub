let players = [];
let rawData = [];
let rubyData = [];
let currentFilter = "ALL";
let originalMainContent = "";

const classMap = {
  AbyssRevenant:"심연추방자",
  Enforcer:"집행관",
  SolarSentinel:"태양감시자",
  RuneScribe:"주문각인사",
  MirageBlade:"환영검사",
  IncenseArcher:"향사수"
};

/* =====================
   페이지 전환
===================== */
function showPage(id, el){

  document.querySelectorAll(".page")
    .forEach(p=>p.style.display="none");

  document.getElementById(id).style.display="block";

  document.querySelectorAll(".menu-item")
    .forEach(m=>m.classList.remove("active"));

  if(el) el.classList.add("active");

  // 🔥 핵심 추가 (메인 복구)
  if(id==="mainPage"){
    setTimeout(()=>{
      renderAll();
    },50);
  }

  if(id==="guildListPage" && players.length){
    applyListFilter();
  }

  if(id==="guildStatPage" && players.length){
    buildGuildStat(players);
  }

  if(id==="rubyPage" && rubyData.length){
    renderRuby();
  }
}

/* =====================
   전체 렌더 (🔥 핵심 추가)
===================== */
function renderAll(){
  if(!rawData.length) return;

  updateSummary(rawData);
  buildStats(rawData);
  initClassFilter();
}

/* =====================
   초기 로딩
===================== */
document.addEventListener("DOMContentLoaded",()=>{

  fetch("data/catdog_all_in_one.json")
  .then(res=>res.json())
  .then(data=>{
    players = data;
    rawData = data;

    renderAll();
  });

  fetch("data/ruby_ranking.json")
  .then(res=>res.json())
  .then(data=>{
    rubyData = data;
  });

  document.querySelectorAll("input[name='guildFilter']")
    .forEach(r=>{
      r.addEventListener("change",function(){
        currentFilter = this.value;
        applyFilter();
      });
    });

  document.getElementById("guildFilterSelect")?.addEventListener("change",applyListFilter);
  document.getElementById("classFilterSelect")?.addEventListener("change",applyListFilter);
});

/* =====================
   요약
===================== */
function updateSummary(data){
  const total = document.getElementById("total");
  const dog = document.getElementById("dog");
  const cat = document.getElementById("cat");

  if(!total || !dog || !cat) return;

  total.innerText = data.length;
  dog.innerText = data.filter(p=>p.guild_name?.includes("DOG")).length;
  cat.innerText = data.filter(p=>p.guild_name?.includes("CAT")).length;
}

/* =====================
   메인 필터
===================== */
function applyFilter(){

  let filtered = rawData;

  if(currentFilter==="DOG"){
    filtered = rawData.filter(p=>p.guild_name==="DOG");
  }

  if(currentFilter==="CAT"){
    filtered = rawData.filter(p=>p.guild_name?.includes("CAT"));
  }

  updateSummary(filtered);
  buildStats(filtered);
}

/* =====================
   리스트 필터
===================== */
function applyListFilter(){

  let guild = document.getElementById("guildFilterSelect")?.value;
  let cls = document.getElementById("classFilterSelect")?.value;

  let filtered = rawData;

  if(guild === "DOG"){
    filtered = filtered.filter(p=>p.guild_name==="DOG");
  }

  if(guild === "CAT"){
    filtered = filtered.filter(p=>p.guild_name?.includes("CAT"));
  }

  if(cls !== "ALL"){
    filtered = filtered.filter(p=>
      (classMap[p.class] || p.class) === cls
    );
  }

  render(filtered);
}

/* =====================
   리스트 렌더
===================== */
function render(list){

  const el = document.getElementById("guildList");
  if(!el) return;

  let html="";

  list.forEach(p=>{
    html += `
      <tr>
        <td>${p.guild_name || ""}</td>
        <td>Lv.${p.gc_level}</td>
        <td>${p.gc_name}</td>
        <td>${p.grade || ""}</td>
        <td>${classMap[p.class] || p.class}</td>
      </tr>
    `;
  });

  el.innerHTML = html;
}

/* =====================
   직업 필터
===================== */
function initClassFilter(){

  const select = document.getElementById("classFilterSelect");
  if(!select) return;

  select.innerHTML = `<option value="ALL">전체</option>`;

  let classes = [...new Set(rawData.map(p=>classMap[p.class] || p.class))];

  classes.sort();

  classes.forEach(c=>{
    let opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

/* =====================
   통계 (그래프)
===================== */
function buildStats(data){

  let levelMap={}, classMap2={}, gradeMap={};

  data.forEach(p=>{
    add(levelMap,p.gc_level);
    add(classMap2,classMap[p.class]||p.class);
    add(gradeMap,p.grade);
  });

  renderChart("levelStats",levelMap);
  renderChart("classStats",classMap2);
  renderChart("gradeStats",gradeMap);
}

function add(map,key){
  map[key] = (map[key] || 0) + 1;
}

/* =====================
   그래프
===================== */
function renderChart(id,data){

  const box = document.getElementById(id);
  if(!box) return;

  box.innerHTML = `<canvas id="${id}Chart"></canvas>`;

  new Chart(document.getElementById(id+"Chart"),{
    type:'bar',
    data:{
      labels:Object.keys(data),
      datasets:[{
        data:Object.values(data),
        backgroundColor:"#4da6ff"
      }]
    },
    options:{
      plugins:{legend:{display:false}}
    }
  });
}

/* =====================
   규정집
===================== */
function loadRules(){

  const box = document.getElementById("mainContent");

  if(!originalMainContent){
    originalMainContent = box.innerHTML;
  }

  fetch("data/rules.json")
  .then(res=>res.json())
  .then(data=>{

    let html = "";

    Object.values(data).forEach(section=>{
      html += `<div class="card"><b>${section.title}</b><br>`;
      section.items.forEach(i=>{
        html += `✔ ${i}<br>`;
      });
      html += `</div>`;
    });

    box.innerHTML = html;
  });
}

/* =====================
   메인 복귀
===================== */
function goMain(){

  const box = document.getElementById("mainContent");

  if(originalMainContent){
    box.innerHTML = originalMainContent;
  }

  showPage('mainPage');

  // 🔥 핵심
  setTimeout(()=>{
    renderAll();
  },50);
}
