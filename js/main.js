const classMap = {
  AbyssRevenant:"심연추방자",
  Enforcer:"집행관",
  SolarSentinel:"태양감시자",
  RuneScribe:"주문각인사",
  MirageBlade:"환영검사",
  IncenseArcher:"향사수"
};

let rawData = [];

/* 페이지 전환 */
function showPage(id, el){
  document.querySelectorAll(".page, #mainPage")
    .forEach(p=>p.style.display="none");

  document.getElementById(id).style.display="block";

  document.querySelectorAll(".menu-item")
    .forEach(m=>m.classList.remove("active"));

  if(el) el.classList.add("active");
}

/* 데이터 로드 */
fetch("Guild_Hub/data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  rawData = data;

  // 요약
  document.getElementById("total").innerText = data.length;

  let dog = data.filter(p=>p.guild_name==="DOG").length;
  let cat = data.filter(p=>p.guild_name==="CAT").length;

  document.getElementById("dog").innerText = dog;
  document.getElementById("cat").innerText = cat;

  buildStats(data);
  buildGuildList(data);
  buildGuildStat(data);
});

/* =====================
   통계 + 그래프
===================== */
function buildStats(data){

  let levelMap = {};
  let classMap2 = {};
  let gradeMap = {};

  data.forEach(p=>{
    add(levelMap, p.gc_level, p);
    add(classMap2, classMap[p.class] || p.class, p);
    add(gradeMap, p.grade, p);
  });

  renderChart("levelStats", levelMap);
  renderChart("classStats", classMap2);
  renderChart("gradeStats", gradeMap);
}

function add(map, key, player){
  if(!map[key]){
    map[key] = {count:0, players:[]};
  }
  map[key].count++;
  map[key].players.push(player);
}

function renderChart(id, data){

  let entries = Object.entries(data);
  entries.sort((a,b)=>b[1].count - a[1].count);

  let top7 = entries.slice(0,7);

  let labels = top7.map(e=>e[0]);
  let values = top7.map(e=>e[1].count);

  document.getElementById(id).innerHTML = `<canvas id="${id}Chart"></canvas>`;

  new Chart(document.getElementById(id+"Chart"),{
    type:'bar',
    data:{
      labels:labels,
      datasets:[{
        data:values
      }]
    },
    options:{
      onClick:(e,el)=>{
        if(el.length){
          let index = el[0].index;
          openModal(id, labels[index]);
        }
      },
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:"white"}},
        y:{ticks:{color:"white"}}
      }
    }
  });
}

/* =====================
   결사원 리스트
===================== */
function buildGuildList(data){

  let sorted = [...data].sort((a,b)=>b.gc_level - a.gc_level);

  let html = `
  <tr>
    <th>레벨</th>
    <th>닉네임</th>
    <th>직업</th>
    <th>결사</th>
  </tr>`;

  sorted.forEach(p=>{
    html += `
    <tr>
      <td>${p.gc_level}</td>
      <td>${p.gc_name}</td>
      <td>${classMap[p.class] || p.class}</td>
      <td>${p.guild_name}</td>
    </tr>`;
  });

  document.getElementById("guildList").innerHTML = html;
}

/* =====================
   결사 통계 (전체)
===================== */
function buildGuildStat(data){

  let levelMap = {};
  let classMap2 = {};
  let gradeMap = {};

  data.forEach(p=>{
    levelMap[p.gc_level] = (levelMap[p.gc_level]||0)+1;
    classMap2[classMap[p.class] || p.class] =
      (classMap2[classMap[p.class] || p.class]||0)+1;
    gradeMap[p.grade] = (gradeMap[p.grade]||0)+1;
  });

  let html = `
  <h3>레벨</h3>${makeTable(levelMap)}
  <h3>직업</h3>${makeTable(classMap2)}
  <h3>토벌</h3>${makeTable(gradeMap)}
  `;

  document.getElementById("guildStatBox").innerHTML = html;
}

function makeTable(map){

  let total = Object.values(map).reduce((a,b)=>a+b,0);

  let entries = Object.entries(map)
    .sort((a,b)=>b[1]-a[1]);

  let html = `<table class="table-hover">
  <tr><th>구분</th><th>인원</th><th>비율</th></tr>`;

  entries.forEach(e=>{
    let percent = ((e[1]/total)*100).toFixed(1);
    html += `<tr>
      <td>${e[0]}</td>
      <td>${e[1]}</td>
      <td>${percent}%</td>
    </tr>`;
  });

  html += "</table>";
  return html;
}

/* =====================
   팝업
===================== */
function openModal(type, key){

  let filtered = rawData.filter(p=>{
    if(type==="classStats"){
      return (classMap[p.class] || p.class) === key;
    }
    if(type==="levelStats") return p.gc_level == key;
    if(type==="gradeStats") return p.grade == key;
  });

  filtered.sort((a,b)=>b.gc_level - a.gc_level);

  let html="";
  filtered.forEach(p=>{
    html += `Lv.${p.gc_level} ${p.gc_name}<br>`;
  });

  document.getElementById("modalTitle").innerText =
    `${key} (${filtered.length}명)`;

  document.getElementById("modalList").innerHTML = html;
  document.getElementById("modal").style.display="flex";
}

function closeModal(){
  document.getElementById("modal").style.display="none";
}

window.onclick = function(e){
  if(e.target.id==="modal") closeModal();
}
