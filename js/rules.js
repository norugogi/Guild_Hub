fetch("data/rules.json")
.then(res=>res.json())
.then(data=>{

  const box = document.getElementById("ruleBox");

  let html = "";

  Object.values(data).forEach(section=>{

    html += `
      <div class="card">
        <h3>${section.title}</h3>
    `;

    section.items.forEach(item=>{
      html += `<div class="item">✔ ${item}</div>`;
    });

    html += `</div>`;
  });

  box.innerHTML = html;
});
