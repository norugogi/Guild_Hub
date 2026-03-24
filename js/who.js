let whoData = [];

const classMap = {
  AbyssRevenant:"심연추방자",
  Enforcer:"집행관",
  SolarSentinel:"태양감시자",
  RuneScribe:"주문각인사",
  MirageBlade:"환영검사",
  IncenseArcher:"향사수"
};

/***************************************
 * 초기 로딩
 ***************************************/
window.onload = function(){

  fetch("/Guild_Hub/data/Who_are_you.json")
  .then(res => res.json())
  .then(data => {
    whoData = data;
    renderTable(whoData); // 초기 전체 출력
  });
};

/***************************************
 * 검색
 ***************************************/
function searchPlayer(){

  const f_rank  = document.getElementById("f_rank").value;
  const f_level = document.getElementById("f_level").value;
  const f_grade = document.getElementById("f_grade").value;
  const f_class = document.getElementById("f_class").value;
  const f_name  = document.getElementById("f_name").value.toLowerCase();

  let filtered = whoData.filter(p => {

    if(f_rank && p.ranking != f_rank) return false;
    if(f_level && p.gc_level != f_level) return false;
    if(f_grade && p.string_map.grade != f_grade) return false;
    if(f_class && p.class != f_class) return false;
    if(f_name && !p.gc_name.toLowerCase().includes(f_name)) return false;

    return true;
  });

  renderTable(filtered);
}

/***************************************
 * 테이블 렌더링
 ***************************************/
function renderTable(list){

  const tbody = document.getElementById("whoBody");

  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="7">검색 결과 없음</td></tr>`;
    return;
  }

  let html = "";

  list.forEach(p => {

    html += `
    <tr>
      <td>${p.world_id.replace("LIVE_","")}</td>
      <td>${p.ranking}</td>
      <td>${p.guild_name || "-"}</td>
      <td>${p.gc_name}</td>
      <td>${p.string_map.grade}</td>
      <td>${classMap[p.class] || p.class}</td>
      <td>-</td>
    </tr>
    `;
  });

  tbody.innerHTML = html;
}

/***************************************
 * 엔터키 검색
 ***************************************/
document.addEventListener("keydown", e => {
  if(e.key === "Enter") searchPlayer();
});
