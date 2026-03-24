let players = [];

/* 페이지 전환 */
function showPage(id, el){
  document.querySelectorAll(".main > div").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";

  document.querySelectorAll(".menu-item").forEach(e=>e.classList.remove("active"));
  el.classList.add("active");
}

/* 데이터 불러오기 */
fetch("data/catdog_all_in_one.json")
.then(res=>res.json())
.then(data=>{
  players = data;
  initMain(data);
});

/* 메인 계산 */
function initMain(data){

  const dog = data.filter(p=>p.guild_name==="DOG").length;
  const cat = data.filter(p=>p.guild_name==="CAT").length;

  document.getElementById("dogCount").innerText = dog;
  document.getElementById("catCount").innerText = cat;
  document.getElementById("totalCount").innerText = dog+cat;

}

/* 통계 렌더 */
function renderBars(targetId, obj){
  const el = document.getElementById(targetId);
  el.innerHTML = "";

  Object.entries(obj).forEach(([name,val])=>{
    el.innerHTML += `
    <div class="bar-row">
      <span>${name}</span>
      <div class="bar"><div style="width:${val*5}%"></div></div>
      <b>${val}</b>
    </div>`;
  });
}
