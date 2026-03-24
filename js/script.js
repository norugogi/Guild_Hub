let players = [];

const classMap = {
  AbyssRevenant:"심연추방자",
  Enforcer:"집행관",
  SolarSentinel:"태양감시자",
  RuneScribe:"주문각인사",
  MirageBlade:"환영검사",
  IncenseArcher:"향사수"
};

fetch("all_servers_ranking.json")
.then(res => res.json())
.then(data => {
  players = data;
  showAll();
});

function showMainPage(){
  const main = document.getElementById("mainPage");
  const ruby = document.getElementById("rubyPage");

  if(main) main.style.display = "block";
  if(ruby) ruby.style.display = "none";
}

function render(list){
  const el = document.getElementById("playerList");
  if(!el) return; // 안전장치

  let html = "";

  list.forEach(p => {
    let guild = p.guild_name || "";
    let name = p.gc_name || "";
    let level = p.gc_level || "";
    let grade = p.grade || "";
    let job = classMap[p.class] || p.class;

    html += `
    <tr>
      <td>${guild}</td>
      <td>${name}</td>
      <td>${level}</td>
      <td>${job}</td>
      <td>${grade}</td>
    </tr>`;
  });

  el.innerHTML = html;
}

function showAll(){
  showMainPage();
  render(players);
}

function showDOG(){
  showMainPage();
  render(players.filter(p => p.guild_name === "DOG"));
}

function showCAT(){
  showMainPage();
  render(players.filter(p => p.guild_name === "CATT"));
}

function openStats(){
  window.open(
    "stats.html",
    "statsPopup",
    "width=1000,height=750,top=120,left=250,resizable=yes,scrollbars=yes"
  );
}
