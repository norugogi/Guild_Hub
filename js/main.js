let players = [];
let rawData = [];

const classMap = {
  AbyssRevenant:"심연추방자",
  Enforcer:"집행관",
  SolarSentinel:"태양감시자",
  RuneScribe:"주문각인사",
  MirageBlade:"환영검사",
  IncenseArcher:"향사수"
};

/* =====================
   데이터 로드
===================== */
fetch("Guild_Hub/data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  players = data;
  rawData = data;

  showAll();
  buildStats(data);
});

/* =====================
   결사원 리스트 (기존 유지)
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

function showAll(){
  render(players);
}

function showDOG(){
  render(players.filter(p => p.guild_name === "DOG"));
}

function showCAT(){
  render(players.filter(p => p.guild_name === "CAT"));
}

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

  let entries = Object.entries(data)
    .sort((a,b)=>b[1].count - a[1].count)
    .slice(0,7);

  let labels = entries.map(e=>e[0]);
  let values = entries.map(e=>e[1].count);

  document.getElementById(id).innerHTML = `<canvas id="${id}Chart"></canvas>`;

  new Chart(document.getElementById(id+"Chart"),{
    type:'bar',
    data:{labels:labels, datasets:[{data:values}]},
    options:{
      onClick:(e,el)=>{
        if(el.length){
          openModal(id, labels[el[0].index]);
        }
      },
      plugins:{legend:{display:false}}
    }
  });
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

window.onclick = e=>{
  if(e.target.id==="modal") closeModal();
};
