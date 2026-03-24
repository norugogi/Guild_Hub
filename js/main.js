let players = [];
let rawData = [];
let rubyData = [];
let currentFilter = "ALL";

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

  document.querySelectorAll(".page, #mainPage")
    .forEach(p=>p.style.display="none");

  document.getElementById(id).style.display="block";

  document.querySelectorAll(".menu-item")
    .forEach(m=>m.classList.remove("active"));

  if(el) el.classList.add("active");

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
   초기 로딩
===================== */
document.addEventListener("DOMContentLoaded",()=>{

  // 결사 데이터
  fetch("data/catdog_all_in_one.json")
  .then(res=>res.json())
  .then(data=>{
    players = data;
    rawData = data;

    updateSummary(data);
    buildStats(data);
    initClassFilter();

    if(document.getElementById("guildStatPage")?.style.display === "block"){
      buildGuildStat(players);
    }
  });

  // 루비 데이터
  fetch("data/ruby_ranking.json")
  .then(res=>res.json())
  .then(data=>{
    rubyData = data;

    if(document.getElementById("rubyPage")?.style.display === "block"){
      renderRuby();
    }
  });

  // 필터 이벤트
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
      <td>${p.guild_name}</td>
      <td>${p.gc_level}</td>
      <td>${p.gc_name}</td>
      <td>${p.grade}</td>
      <td>${classMap[p.class] || p.class}</td>
    </tr>`;
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

  let entries = Object.entries(data)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,7);

  let labels = entries.map(e=>e[0]);
  let values = entries.map(e=>e[1]);

  box.innerHTML = `<canvas id="${id}Chart"></canvas>`;

  new Chart(document.getElementById(id+"Chart"),{
    type:'bar',
    data:{
      labels,
      datasets:[{
        data:values,
        backgroundColor:["#4da6ff","#ffaa00","#33cc99","#9966ff","#ff6699","#ff9933","#66ccff"],
        borderRadius:8
      }]
    },
    options:{
      indexAxis:'y',
      plugins:{legend:{display:false}}
    }
  });
}

/* =====================
   결사 통계 (단 하나만 존재)
===================== */
function buildGuildStat(data){

  const box = document.getElementById("guildStatBox");
  if(!box) return;

  let levelMap = {};
  let classMap2 = {};
  let gradeMap = {};

  data.forEach(p=>{
    add(levelMap,p.gc_level);
    add(classMap2,classMap[p.class]||p.class);
    add(gradeMap,p.grade);
  });

  box.innerHTML = `
    <div class="stat-wrap">
      ${makeStatCard("레벨 통계", levelMap)}
      ${makeStatCard("직업 통계", classMap2)}
      ${makeStatCard("토벌 통계", gradeMap)}
    </div>
  `;
}

/* =====================
   루비
===================== */
function renderRuby(){

  const table = document.getElementById("rubyTable");
  if(!table || !rubyData.length) return;

  let html="";

  rubyData
    .sort((a,b)=>b.score-a.score)
    .forEach((p,i)=>{
      html += `
      <tr>
        <td>${i+1}</td>
        <td>${p.name}</td>
        <td>${p.guild}</td>
        <td>${p.score.toLocaleString()}</td>
      </tr>`;
    });

  table.innerHTML = html;
}
