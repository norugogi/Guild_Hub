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

  document.getElementById("total").innerText = data.length;

  let dog = data.filter(p=>p.guild_name==="DOG").length;
  let cat = data.filter(p=>p.guild_name==="CAT").length;

  document.getElementById("dog").innerText = dog;
  document.getElementById("cat").innerText = cat;

  buildStats(data);
});

/* 통계 생성 */
function buildStats(data){

  let levelMap = {};
  let classMap2 = {};
  let gradeMap = {};

  data.forEach(p=>{
    add(levelMap, p.gc_level, p);
    add(classMap2, classMap[p.class] || p.class, p);
    add(gradeMap, p.grade, p);
  });

  render("levelStats", levelMap);
  render("classStats", classMap2);
  render("gradeStats", gradeMap);
}

/* 묶기 */
function add(map, key, player){
  if(!map[key]){
    map[key] = {count:0, players:[]};
  }
  map[key].count++;
  map[key].players.push(player);
}

/* 렌더 (Top7) */
function render(id, data){

  let entries = Object.entries(data);
  entries.sort((a,b)=>b[1].count - a[1].count);

  let top7 = entries.slice(0,7);

  let html="";

  top7.forEach(e=>{
    html += `
      <div class="chart-item" onclick="openModal('${id}','${e[0]}')">
        <span>${e[0]}</span>
        <span>${e[1].count}</span>
      </div>
    `;
  });

  document.getElementById(id).innerHTML = html;
}

/* 팝업 */
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
