let players = [];

/* 페이지 이동 */
function showPage(id, el){
  document.querySelectorAll(".main > div").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";

  document.querySelectorAll(".menu-item").forEach(e=>e.classList.remove("active"));
  el.classList.add("active");
}

/* 데이터 */
fetch("data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  players = data;
  initMain(data);
  renderGuild(data);
});

/* 메인 */
function initMain(data){
  const dog = data.filter(p=>p.guild_name==="DOG").length;
  const cat = data.filter(p=>p.guild_name==="CAT").length;

  document.getElementById("dog").innerText = dog;
  document.getElementById("cat").innerText = cat;
  document.getElementById("total").innerText = dog+cat;
}

/* 결사 리스트 */
function renderGuild(data){
  const el = document.getElementById("guildList");
  el.innerHTML = "";

  data.slice(0,50).forEach(p=>{
    el.innerHTML += `<tr>
      <td>${p.gc_name}</td>
      <td>${p.gc_level}</td>
    </tr>`;
  });
}

/* 너누구야 */
function searchPlayer(){
  const name = document.getElementById("searchName").value;
  const p = players.find(x=>x.gc_name===name);

  document.getElementById("whoResult").innerText =
    p ? `${p.gc_name} Lv.${p.gc_level}` : "없음";
}

/* 공지 */
fetch("data/notice.json")
.then(r=>r.json())
.then(d=>{
  document.getElementById("noticeBox").innerText = d.notice;
});

/* 루비 */
fetch("data/ruby_ranking.json")
.then(r=>r.json())
.then(d=>{
  const el = document.getElementById("rubyTable");
  d.forEach((r,i)=>{
    el.innerHTML += `<tr><td>${i+1}</td><td>${r.name}</td><td>${r.score}</td></tr>`;
  });
});
