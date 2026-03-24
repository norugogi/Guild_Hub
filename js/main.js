let players = [];

/* 페이지 전환 */
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
});

/* 메인 데이터 */
function initMain(data){
  const dog = data.filter(p=>p.guild_name==="DOG").length;
  const cat = data.filter(p=>p.guild_name==="CAT").length;

  document.getElementById("dog").innerText = dog;
  document.getElementById("cat").innerText = cat;
  document.getElementById("total").innerText = dog+cat;
}
