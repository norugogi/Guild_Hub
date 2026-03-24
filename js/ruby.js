/***************************************
 * 🔥 루비 전용 데이터
 ***************************************/
let rubyData = [];

/***************************************
 * 🔥 루비 JSON fetch
 ***************************************/
fetch("https://raw.githubusercontent.com/norugogi/dogcat-ranking/main/ruby_ranking.json")
.then(res => res.json())
.then(data => {
  rubyData = data.data;
  console.log("루비 데이터 로드 완료", rubyData);

  initRubyFilters();
  renderRuby();
});


/***************************************
 * 🔥 루비 페이지 전환
 ***************************************/
function showRuby(){
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("rubyPage").style.display = "block";

  if(rubyData.length){
    renderRuby();
  }
}


/***************************************
 * 🔥 필터 값 가져오기
 ***************************************/
function getRubyFilters(){
  return {
    group: document.getElementById("groupFilter").value,
    season: document.getElementById("seasonFilter").value,
    week: document.getElementById("weekFilter").value
  };
}


/***************************************
 * 🔥 필터 옵션 생성
 ***************************************/
function initRubyFilters(){

  const seasons = [...new Set(rubyData.map(r => r.season))];
  const weeks = [...new Set(rubyData.map(r => r.week))];

  const seasonSelect = document.getElementById("seasonFilter");
  const weekSelect = document.getElementById("weekFilter");

  if(!seasonSelect || !weekSelect) return;

  // 초기화
  seasonSelect.innerHTML = `<option value="all">전체 시즌</option>`;
  weekSelect.innerHTML = `<option value="all">전체 주차</option>`;

  seasons.forEach(s => {
    seasonSelect.innerHTML += `<option value="${s}">${s}</option>`;
  });

  weeks.forEach(w => {
    weekSelect.innerHTML += `<option value="${w}">${w}주차</option>`;
  });

  // 이벤트 연결
  document.getElementById("groupFilter").addEventListener("change", renderRuby);
  document.getElementById("seasonFilter").addEventListener("change", renderRuby);
  document.getElementById("weekFilter").addEventListener("change", renderRuby);
}


/***************************************
 * 🔥 루비 렌더 핵심
 ***************************************/
function renderRuby(){

  if(!rubyData.length) return;

  const filters = getRubyFilters();

  // 🔥 필터 적용
  let filtered = rubyData.filter(r => {

    if(filters.group !== "all" && r.group !== filters.group) return false;
    if(filters.season !== "all" && r.season !== filters.season) return false;
    if(filters.week !== "all" && String(r.week) !== filters.week) return false;

    return true;
  });

  // 🔥 UID 기준 합산
  let map = {};

  filtered.forEach(r => {

    const key = r.uid;

    if(!map[key]){
      map[key] = {
        uid: r.uid,
        name: r.name,
        group: r.group,
        total: 0,
        weekValue: 0,
        season: r.season,
        week: r.week
      };
    }

    map[key].total += Number(r.value || 0);
    map[key].weekValue += Number(r.value || 0);
  });

  let list = Object.values(map);

  // 🔥 정렬
  list.sort((a,b)=> b.total - a.total);

  // 🔥 게이지 계산
  const totalSum = list.reduce((sum,v)=> sum + v.total, 0);
  const goal = 50000000;
  const percent = Math.min((totalSum / goal) * 100, 100);

  const bar = document.getElementById("rubyBar");
  const text = document.getElementById("rubyText");
  const percentText = document.getElementById("rubyPercent");

  if(bar) bar.style.width = percent + "%";
  if(text) text.innerText = `${totalSum.toLocaleString()} / ${goal.toLocaleString()}`;
  if(percentText) percentText.innerText = percent.toFixed(1) + "%";

  // 🔥 테이블 출력
  let html = "";

  list.forEach((p, i) => {

    html += `
    <tr>
      <td>${i+1}</td>
      <td>${p.season}</td>
      <td>${p.week}</td>
      <td>${p.group}</td>
      <td>${p.name}</td>
      <td>${p.total.toLocaleString()}</td>
      <td>${p.weekValue.toLocaleString()}</td>
    </tr>
    `;
  });

  const table = document.getElementById("rubyTable");
  if(table) table.innerHTML = html;
}
