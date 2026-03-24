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

let levelStats = {};
let gradeStats = {};
let classStats = {};

data.forEach(p => {

let level = p.gc_level;
let grade = p.grade;
let cls = classMap[p.class] || p.class;

levelStats[level] = (levelStats[level] || 0) + 1;
gradeStats[grade] = (gradeStats[grade] || 0) + 1;
classStats[cls] = (classStats[cls] || 0) + 1;

});

renderStats("levelStats",levelStats);
renderStats("gradeStats",gradeStats);
renderStats("classStats",classStats);

});

function renderStats(id,data){

let total = 0;

for(let k in data){
total += data[k];
}

let entries = Object.entries(data);

entries.sort((a,b)=>b[1]-a[1]);

let html = "<table>";

html += `
<tr>
<th>구분</th>
<th>인원</th>
<th>비율</th>
</tr>
`;

entries.forEach(e=>{

let key = e[0];
let count = e[1];
let percent = ((count/total)*100).toFixed(1);

html += `
<tr>
<td>${key}</td>
<td>${count}</td>
<td>${percent}%</td>
</tr>
`;

});

html += "</table>";

document.getElementById(id).innerHTML = html;

}

// 갱신시간

const now = new Date();

const formatted =
now.getFullYear() + "." +
String(now.getMonth()+1).padStart(2,"0") + "." +
String(now.getDate()).padStart(2,"0") + " " +
String(now.getHours()).padStart(2,"0") + ":" +
String(now.getMinutes()).padStart(2,"0");

document.getElementById("updateTime").innerText = formatted;
