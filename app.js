// ====== GOOGLE CONFIG ======
// Hier deine Daten eintragen
const CLIENT_ID = "209966574961-dcv6r5rr9genk894cjocb8ad8mb1liru.apps.googleusercontent.com";
const API_KEY = "AIzaSyCp-mqkQK95r6-6975qF94183fk_f7aywI";
const SPREADSHEET_ID = "103-o4NUpJWGFhqSP9z2uMrbK0nUjxZGBoZPB0vXe7s8";

const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById("date").valueAsDate = new Date();

// ---------- Google API laden ----------
window.onload = () => {
  gapi.load("client", async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });

  gisInited = true;
};

// ---------- Login Button ----------
document.getElementById("loginBtn").onclick = () => {
  if (!gapiInited || !gisInited) {
    alert("Google API lädt noch… bitte 2 Sekunden warten.");
    return;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error) {
      console.error(resp);
      return;
    }

    document.getElementById("form").classList.remove("hidden");
    loadSheet();
  };

  tokenClient.requestAccessToken({ prompt: "consent" });
};

// ---------- Spreadsheet laden ----------
async function loadSheet() {
  const res = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "A2:D",
  });

  const rows = res.result.values || [];
  const table = document.getElementById("table");
  table.innerHTML = "";

  rows.reverse().forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2">${r[0]}</td>
      <td class="p-2 ${r[1] > 135 ? "bg-red-200" : ""}">${r[1]}</td>
      <td class="p-2 ${r[2] > 90 ? "bg-red-200" : ""}">${r[2]}</td>
      <td class="p-2">${r[3]}</td>`;
    table.appendChild(tr);
  });
}

// ---------- Speichern ----------
document.getElementById("form").addEventListener("submit", async e => {
  e.preventDefault();

  const row = [
    document.getElementById("date").value,
    document.getElementById("sys").value,
    document.getElementById("dia").value,
    document.getElementById("pulse").value
  ];

  await gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "A:D",
    valueInputOption: "USER_ENTERED",
    resource: { values: [row] }
  });

  loadSheet();
  e.target.reset();
  document.getElementById("date").valueAsDate = new Date();
});
