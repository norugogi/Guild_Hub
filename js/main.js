let players = [];
let rawData = [];
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

  if(id==="guildListPage") render(players);
  if(id==="guildStatPage") buildGuildStat(players);
}

/* =====================
   데이터 로드
===================== */
fetch("data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  players = data;
  rawData = data;

  updateSummary(data);
  buildStats(data);
});

/* =====================
   요약
===================== */
function updateSummary(data){
  document.getElementById("total").innerText = data.length;

  let dog = data.filter(p=>p.guild_name==="DOG").length;
  let cat = data.filter(p=>p.guild_name==="CATT").length;

  document.getElementById("dog").innerText = dog;
  document.getElementById("cat").innerText = cat;
}

/* =====================
   필터
===================== */

function applyFilter(){

  let filtered = rawData;

  if(currentFilter==="DOG"){
    filtered = rawData.filter(p=>p.guild_name==="DOG");
  }

  if(currentFilter==="CAT"){
    filtered = rawData.filter(p=>p.guild_name==="CAT" || p.guild_name==="CATT");
  }

  // 🔥 핵심 (그래프 다시 그림)
  updateSummary(filtered);
  buildStats(filtered);
}

/* =====================
   리스트
===================== */
function render(list){

  const el = document.getElementById("guildList");
  if(!el) return;

  let html="";

  list.forEach(p=>{
    html += `
    <tr>
      <td>${p.gc_level}</td>
      <td>${p.gc_name}</td>
      <td>${classMap[p.class] || p.class}</td>
      <td>${p.guild_name}</td>
    </tr>`;
  });

  el.innerHTML = html;
}

/* =====================
   통계
===================== */
function buildStats(data){

  let levelMap={}, classMap2={}, gradeMap={};

  data.forEach(p=>{
    add(levelMap,p.gc_level,p);
    add(classMap2,classMap[p.class]||p.class,p);
    add(gradeMap,p.grade,p);
  });

  renderChart("levelStats",levelMap);
  renderChart("classStats",classMap2);
  renderChart("gradeStats",gradeMap);
}

function add(map,key,p){
  if(!map[key]) map[key]={count:0,players:[]};
  map[key].count++;
  map[key].players.push(p);
}

/* =====================
   그래프
===================== */
function renderChart(id,data){

  let entries = Object.entries(data)
    .sort((a,b)=>b[1].count-a[1].count)
    .slice(0,7);

  let labels = entries.map(e=>e[0]);
  let values = entries.map(e=>e[1].count);

  document.getElementById(id).innerHTML =
    `<canvas id="${id}Chart"></canvas>`;

  new Chart(document.getElementById(id+"Chart"),{
    type:'bar',
    data:{
      labels,
      datasets:[{
        data:values,
        backgroundColor:[
          "#4da6ff","#ffaa00","#33cc99",
          "#9966ff","#ff6699","#ff9933","#66ccff"
        ],
        borderRadius:8
      }]
    },
    options:{
      indexAxis:'y',
      plugins:{legend:{display:false}},
      onClick:(e,el)=>{
        if(el.length){
          openModal(id, labels[el[0].index]);
        }
      }
    }
  });
}

/* =====================
   결사 통계
===================== */
function buildGuildStat(data){

  let map={};

  data.forEach(p=>{
    map[p.gc_level]=(map[p.gc_level]||0)+1;
  });

  let html="<table><tr><th>레벨</th><th>인원</th></tr>";

  Object.entries(map)
    .sort((a,b)=>b[1]-a[1])
    .forEach(e=>{
      html+=`<tr><td>${e[0]}</td><td>${e[1]}</td></tr>`;
    });

  html+="</table>";

  document.getElementById("guildStatBox").innerHTML=html;
}

/* =====================
   팝업
===================== */
function openModal(type,key){

  let filtered = rawData.filter(p=>{
    if(type==="classStats"){
      return (classMap[p.class]||p.class)===key;
    }
    if(type==="levelStats") return p.gc_level==key;
    if(type==="gradeStats") return p.grade==key;
  });

  filtered.sort((a,b)=>b.gc_level-a.gc_level);

  let html="";
  filtered.forEach(p=>{
    html+=`Lv.${p.gc_level} ${p.gc_name}<br>`;
  });

  document.getElementById("modalTitle").innerText =
    `${key} (${filtered.length}명)`;

  document.getElementById("modalList").innerHTML = html;
  document.getElementById("modal").style.display="flex";
}

function closeModal(){
  document.getElementById("modal").style.display="none";
}

window.onclick=e=>{
  if(e.target.id==="modal") closeModal();
};
function initFilter(){

  const radios = document.querySelectorAll("input[name='guildFilter']");

  radios.forEach(r=>{
    r.addEventListener("change",function(){

      currentFilter = this.value;

      applyFilter();
    });
  });
}

// 🔥 데이터 로드 이후 실행
fetch("data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  players = data;
  rawData = data;

  updateSummary(data);
  buildStats(data);

  initFilter(); // 🔥 여기서 실행
});
