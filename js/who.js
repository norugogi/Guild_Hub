/***************************************
 * 전역 데이터
 ***************************************/
let whoData = [];

/***************************************
 * 직업 한글 변환
 ***************************************/
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

  console.log("who.js 로드됨");

  fetch("data/Who_are_you.json")
  .then(res => res.json())
  .then(data => {

    console.log("데이터 로드:", data);

    // 🔥 배열 확인
    if(!Array.isArray(data)){
      console.error("JSON이 배열이 아님!", data);
      return;
    }

    whoData = data;

    renderTable(whoData);
  })
  .catch(err => {
    console.error("데이터 로드 실패:", err);
  });
};

/***************************************
 * 검색 (전역 함수 필수)
 ***************************************/
function searchPlayer(){

  const f_rank  = document.getElementById("f_rank").value;
  const f_level = document.getElementById("f_level").value;
  const f_grade = document.getElementById("f_grade").value;
  const f_class = document.getElementById("f_class").value;
  const f_name  = document.getElementById("f_name").value.toLowerCase();

  let filtered = whoData.filter(p => {

    if(f_rank && p.ranking != f_rank) return false;
    if(f_level && p.level != f_level) return false;
    if(f_grade && p.grade != f_grade) return false;
    if(f_class && p.class != f_class) return false;
    if(f_name && !p.name.toLowerCase().includes(f_name)) return false;

    return true;
  });

  // 🔥 순위 기준 정렬 (자동)
  filtered.sort((a, b) => a.ranking - b.ranking);

  renderTable(filtered);
}

/***************************************
 * 테이블 렌더링
 ***************************************/
function renderTable(list){

  const tbody = document.getElementById("whoBody");

  // 🔥 안전 처리
  if(!Array.isArray(list)){
    console.error("renderTable: 배열 아님", list);
    return;
  }

  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="7">검색 결과 없음</td></tr>`;
    return;
  }

  let html = "";

  list.forEach(p => {

    html += `
    <tr>
      <td>${p.world}</td>
      <td>${p.ranking}</td>
      <td>${p.guild || "-"}</td>
      <td>${p.name}</td>
      <td>${p.grade}</td>
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
  if(e.key === "Enter"){
    searchPlayer();
  }
});
