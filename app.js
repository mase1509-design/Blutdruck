const dateInput = document.getElementById("date");
dateInput.valueAsDate = new Date();

const form = document.getElementById("form");
const table = document.getElementById("table");

function load() {
  table.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("bp")) || [];
  data.sort((a,b)=>b.date.localeCompare(a.date));
  data.forEach(e=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2">${e.date}</td>
      <td class="p-2 ${e.sys>135?'bg-red-200':''}">${e.sys}</td>
      <td class="p-2 ${e.dia>90?'bg-red-200':''}">${e.dia}</td>
      <td class="p-2">${e.pulse}</td>`;
    table.appendChild(tr);
  });
}

form.addEventListener("submit", e=>{
  e.preventDefault();
  const data = JSON.parse(localStorage.getItem("bp")) || [];
  data.push({
    date: dateInput.value,
    sys: +document.getElementById("sys").value,
    dia: +document.getElementById("dia").value,
    pulse: +document.getElementById("pulse").value
  });
  localStorage.setItem("bp", JSON.stringify(data));
  form.reset();
  dateInput.valueAsDate = new Date();
  load();
});

document.getElementById("csv").onclick = ()=>{
  const data = JSON.parse(localStorage.getItem("bp")) || [];
  let csv = "Datum,Oberer,Unterer,Puls\n";
  csv += data.map(e=>`${e.date},${e.sys},${e.dia},${e.pulse}`).join("\n");
  const blob = new Blob([csv],{type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "blutdruck.csv";
  a.click();
};

load();
