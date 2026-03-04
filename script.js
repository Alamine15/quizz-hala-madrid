let players = JSON.parse(localStorage.getItem("quizPlayers")) || [];
let currentRound = JSON.parse(localStorage.getItem("quizRound")) || 0;

document.getElementById("roundNumber").innerText = currentRound + 1;

updateSelect();
updateEditOptions();
displayScores();

function saveData() {
  localStorage.setItem("quizPlayers", JSON.stringify(players));
  localStorage.setItem("quizRound", JSON.stringify(currentRound));
}

function addPlayer() {
  const name = document.getElementById("playerName").value;

  if (name !== "") {
    players.push({ name: name, scores: [] });

    saveData();
    updateSelect();
    updateEditOptions();
    displayScores();

    document.getElementById("playerName").value = "";
  }
}

function updateSelect() {
  const select = document.getElementById("playerSelect");
  const editPlayer = document.getElementById("editPlayer");

  if (!select || !editPlayer) return;

  select.innerHTML = "";
  editPlayer.innerHTML = "";

  players.forEach((player, index) => {

    select.innerHTML += `<option value="${index}">${player.name}</option>`;
    editPlayer.innerHTML += `<option value="${index}">${player.name}</option>`;

  });
}

function updateEditOptions() {

  const editRound = document.getElementById("editRound");

  if (!editRound) return;

  editRound.innerHTML = "";

  for (let i = 0; i <= currentRound; i++) {

    editRound.innerHTML += `<option value="${i}">Manche ${i + 1}</option>`;

  }
}

function addPoints() {

  const playerIndex = document.getElementById("playerSelect").value;
  const points = parseInt(document.getElementById("points").value);

  if (!players[playerIndex].scores[currentRound]) {
    players[playerIndex].scores[currentRound] = 0;
  }

  players[playerIndex].scores[currentRound] += points;

  saveData();
  displayScores();
}

function nextRound() {

  currentRound++;

  document.getElementById("roundNumber").innerText = currentRound + 1;

  updateEditOptions();
  saveData();
  displayScores();
}

function updateScore() {

  const round = parseInt(document.getElementById("editRound").value);
  const playerIndex = document.getElementById("editPlayer").value;
  const newScore = parseInt(document.getElementById("newScore").value);

  if (!isNaN(newScore)) {

    players[playerIndex].scores[round] = newScore;

    saveData();
    displayScores();

    document.getElementById("newScore").value = "";

  }
}

function displayScores() {

  let table = "<table><tr><th>Joueur</th>";

  for (let i = 0; i <= currentRound; i++) {

    table += `<th>M${i + 1}</th>`;

  }

  table += "<th>Total</th></tr>";

  players.forEach(player => {

    let total = player.scores.reduce((a, b) => a + b, 0);

    table += `<tr><td>${player.name}</td>`;

    for (let i = 0; i <= currentRound; i++) {

      table += `<td>${player.scores[i] || 0}</td>`;

    }

    table += `<td class="total">${total}</td></tr>`;

  });

  table += "</table>";

  document.getElementById("scoresTable").innerHTML = table;

  updateRanking();
}

function updateRanking() {

  let ranking = players.map(player => {

    let total = player.scores.reduce((a, b) => a + b, 0);

    return {
      name: player.name,
      total: total
    }

  });

  ranking.sort((a, b) => b.total - a.total);

  let html = "<ol>";

  ranking.forEach((player, index) => {

    let medal = "";

    if (index === 0) medal = "🥇 ";
    if (index === 1) medal = "🥈 ";
    if (index === 2) medal = "🥉 ";

    html += `<li>${medal}${player.name} — ${player.total} pts</li>`;

  });

  html += "</ol>";

  document.getElementById("ranking").innerHTML = html;
}

function resetGame() {

  if (confirm("Voulez-vous vraiment réinitialiser le quiz ?")) {

    localStorage.removeItem("quizPlayers");
    localStorage.removeItem("quizRound");

    location.reload();

  }
}