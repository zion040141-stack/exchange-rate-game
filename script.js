const GRID = 7;

const CATEGORIES = [
  "수입업자",
  "수출업자",
  "외국인 여행객",
  "내국인의 해외여행",
  "내국인의 해외 유학(노동)",
  "외국인의 국내 유행(노동)",
  "가계의 생활비",
];

const PLAYER_COLORS = ["#2f6fed", "#ef5350", "#0f9488", "#ab47bc"];
const TEAM_LABELS = ["A", "B", "C"];
const TEAM_COLORS = ["#2f6fed", "#ef5350", "#0f9488"];

function buildPerimeterCells() {
  const cells = [];
  for (let col = 1; col <= GRID; col++) cells.push({ row: 1, col });
  for (let row = 2; row <= GRID; row++) cells.push({ row, col: GRID });
  for (let col = GRID - 1; col >= 1; col--) cells.push({ row: GRID, col });
  for (let row = GRID - 1; row >= 2; row--) cells.push({ row, col: 1 });
  return cells;
}

function buildTiles() {
  const cells = buildPerimeterCells();
  const cornerIndexes = [0, GRID - 1, 2 * (GRID - 1), 3 * (GRID - 1)];
  return cells.map((cell, index) => {
    const isCorner = cornerIndexes.includes(index);
    const isStart = index === 0;
    const categoryIndex = isStart ? -1 : (index - 1) % CATEGORIES.length;
    return {
      index,
      row: cell.row,
      col: cell.col,
      isCorner,
      isStart,
      categoryIndex,
      category: isStart ? "출발" : CATEGORIES[categoryIndex],
    };
  });
}

const tiles = buildTiles();
const tileCount = tiles.length;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------- Setup screen ----------------

const setupState = {
  playerCount: 1,
  teamMode: "solo",
  teamCount: null,
  diceMode: "app",
};

const setupScreenEl = document.getElementById("setup-screen");
const gameScreenEl = document.getElementById("game-screen");
const playerCountBtns = document.querySelectorAll("#player-count-row .option-btn");
const teamModeBtns = document.querySelectorAll("#team-mode-row .option-btn");
const teamCountRowEl = document.getElementById("team-count-row");
const diceModeBtns = document.querySelectorAll("#dice-mode-row .option-btn");
const startGameBtn = document.getElementById("start-game-btn");

function renderPlayerCountButtons() {
  playerCountBtns.forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.count) === setupState.playerCount);
  });
}

function renderTeamModeButtons() {
  const teamPossible = setupState.playerCount >= 3;
  teamModeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === setupState.teamMode);
    if (btn.dataset.mode === "team") btn.disabled = !teamPossible;
  });
}

function renderTeamCountOptions() {
  teamCountRowEl.innerHTML = "";
  if (setupState.teamMode !== "team") return;
  const max = setupState.playerCount - 1;
  if (setupState.teamCount === null || setupState.teamCount > max) {
    setupState.teamCount = max >= 2 ? 2 : null;
  }
  for (let t = 2; t <= max; t++) {
    const btn = document.createElement("button");
    btn.className = "option-btn small" + (setupState.teamCount === t ? " active" : "");
    btn.textContent = `${t}팀`;
    btn.addEventListener("click", () => {
      setupState.teamCount = t;
      renderTeamCountOptions();
    });
    teamCountRowEl.appendChild(btn);
  }
}

function renderDiceModeButtons() {
  diceModeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === setupState.diceMode);
  });
}

playerCountBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setupState.playerCount = Number(btn.dataset.count);
    renderPlayerCountButtons();
    renderTeamModeButtons();
    renderTeamCountOptions();
  });
});

teamModeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    setupState.teamMode = btn.dataset.mode;
    if (setupState.teamMode === "solo") setupState.teamCount = null;
    renderTeamModeButtons();
    renderTeamCountOptions();
  });
});

diceModeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setupState.diceMode = btn.dataset.mode;
    renderDiceModeButtons();
  });
});

startGameBtn.addEventListener("click", startGame);

renderPlayerCountButtons();
renderTeamModeButtons();
renderTeamCountOptions();
renderDiceModeButtons();

// ---------------- Game state ----------------

const state = {
  players: [],
  currentPlayerIndex: 0,
  turn: 0,
  diceMode: "app",
  animating: false,
};

function currentPlayer() {
  return state.players[state.currentPlayerIndex];
}

function startGame() {
  const players = [];
  for (let i = 0; i < setupState.playerCount; i++) {
    players.push({
      name: `플레이어 ${i + 1}`,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      team: setupState.teamMode === "team" ? i % setupState.teamCount : null,
      pos: 0,
    });
  }

  state.players = players;
  state.currentPlayerIndex = 0;
  state.turn = 0;
  state.diceMode = setupState.diceMode;
  state.animating = false;

  setupScreenEl.classList.add("hidden");
  gameScreenEl.classList.remove("hidden");

  turnCountEl.textContent = state.turn;
  renderPlayerBar();
  renderBoard();
  updateCurrentPlayerDisplay();
}

// ---------------- Game screen elements ----------------

const boardEl = document.getElementById("board");
const playerBarEl = document.getElementById("player-bar");
const turnCountEl = document.getElementById("turn-count");
const currentPlayerEl = document.getElementById("current-player");
const currentTileEl = document.getElementById("current-tile");
const rollBtn = document.getElementById("roll-btn");
const logListEl = document.getElementById("log-list");

const eventModalEl = document.getElementById("event-modal");
const eventTitleEl = document.getElementById("event-title");
const eventBodyEl = document.getElementById("event-body");
const eventCloseBtn = document.getElementById("event-close");

const diceOverlayEl = document.getElementById("dice-overlay");
const diceCubeEl = document.getElementById("dice-cube");
const diceResultEl = document.getElementById("dice-result");

const manualDiceModalEl = document.getElementById("manual-dice-modal");
const manualDiceGridEl = document.getElementById("manual-dice-grid");

function renderPlayerBar() {
  playerBarEl.innerHTML = "";
  state.players.forEach((player, idx) => {
    const chip = document.createElement("div");
    chip.className = "player-chip" + (idx === state.currentPlayerIndex ? " active" : "");
    chip.style.setProperty("--chip-color", player.color);

    const avatar = document.createElement("div");
    avatar.className = "chip-avatar";
    avatar.textContent = `P${idx + 1}`;
    chip.appendChild(avatar);

    const info = document.createElement("div");
    info.className = "chip-info";

    const nameEl = document.createElement("div");
    nameEl.className = "chip-name";
    nameEl.textContent = player.name;
    info.appendChild(nameEl);

    if (player.team !== null) {
      const teamEl = document.createElement("div");
      teamEl.className = "chip-team";
      teamEl.textContent = `${TEAM_LABELS[player.team]}팀`;
      teamEl.style.color = TEAM_COLORS[player.team];
      info.appendChild(teamEl);
    }

    chip.appendChild(info);
    playerBarEl.appendChild(chip);
  });
}

function renderBoard() {
  boardEl.innerHTML = "";

  const center = document.createElement("div");
  center.className = "tile-center";
  center.textContent = "환율 정복";
  boardEl.appendChild(center);

  tiles.forEach((tile) => {
    const el = document.createElement("div");
    el.className = "tile";
    if (tile.isStart) {
      el.classList.add("start");
    } else {
      el.classList.add(`tile-cat-${tile.categoryIndex}`);
    }
    if (tile.isCorner) el.classList.add("corner");
    el.style.gridRow = tile.row;
    el.style.gridColumn = tile.col;

    const label = document.createElement("div");
    label.className = "tile-label";
    label.textContent = tile.category;
    el.appendChild(label);

    const occupants = state.players.filter((p) => p.pos === tile.index);
    if (occupants.length > 0) {
      el.classList.add("active-player");
      const tokenWrap = document.createElement("div");
      tokenWrap.className = "token-wrap";
      occupants.forEach((p) => {
        const token = document.createElement("div");
        token.className = "player-token" + (p === currentPlayer() ? " current" : "");
        token.style.background = p.color;
        tokenWrap.appendChild(token);
      });
      el.appendChild(tokenWrap);
    }

    boardEl.appendChild(el);
  });
}

function addLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  logListEl.prepend(li);
}

function updateCurrentPlayerDisplay() {
  const player = currentPlayer();
  currentPlayerEl.textContent = player.name;
  currentTileEl.textContent = tiles[player.pos].category;
  renderPlayerBar();
}

function showEvent(tile, player) {
  if (tile.isStart) {
    eventTitleEl.textContent = "출발";
    eventBodyEl.textContent = `${player.name}이(가) 출발점을 지나 다시 게임을 이어갑니다.`;
  } else {
    const direction = Math.random() < 0.5 ? "상승" : "하강";
    eventTitleEl.textContent = `${tile.category} 이벤트`;
    eventBodyEl.textContent = `${player.name}의 턴 - 환율이 ${direction}하는 상황입니다. (상세 이벤트 내용은 추후 추가 예정)`;
  }
  eventModalEl.classList.remove("hidden");
}

eventCloseBtn.addEventListener("click", () => {
  eventModalEl.classList.add("hidden");
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  updateCurrentPlayerDisplay();
  state.animating = false;
  rollBtn.disabled = false;
});

function movePlayerStep(stepsLeft) {
  const player = currentPlayer();
  if (stepsLeft === 0) {
    const tile = tiles[player.pos];
    currentTileEl.textContent = tile.category;
    addLog(`${state.turn}턴: ${player.name} - ${tile.category} 도착`);
    showEvent(tile, player);
    return;
  }
  player.pos = (player.pos + 1) % tileCount;
  renderBoard();
  setTimeout(() => movePlayerStep(stepsLeft - 1), 180);
}

// ---------------- 3D dice cube animation ----------------

const FACE_ROTATIONS = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 90 },
  3: { x: 90, y: 0 },
  4: { x: -90, y: 0 },
  5: { x: 0, y: -90 },
  6: { x: 0, y: 180 },
};

async function animateDiceRoll(result) {
  diceCubeEl.style.transition = "none";
  diceCubeEl.style.transform = "rotateX(0deg) rotateY(0deg)";
  void diceCubeEl.offsetWidth;

  const target = FACE_ROTATIONS[result];
  const spinX = 360 * (2 + Math.floor(Math.random() * 2)) * (Math.random() < 0.5 ? 1 : -1);
  const spinY = 360 * (2 + Math.floor(Math.random() * 2)) * (Math.random() < 0.5 ? 1 : -1);

  await new Promise((resolve) => requestAnimationFrame(resolve));
  diceCubeEl.style.transition = "transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)";
  diceCubeEl.style.transform = `rotateX(${spinX + target.x}deg) rotateY(${spinY + target.y}deg)`;

  await wait(950);
}

// ---------------- Manual dice input ----------------

let manualResolve = null;

for (let n = 1; n <= 6; n++) {
  const btn = document.createElement("button");
  btn.className = `die-face manual-die-btn pip-${n}`;
  for (let p = 0; p < n; p++) {
    const pip = document.createElement("span");
    pip.className = "pip";
    btn.appendChild(pip);
  }
  btn.addEventListener("click", () => {
    manualDiceModalEl.classList.add("hidden");
    if (manualResolve) {
      const resolve = manualResolve;
      manualResolve = null;
      resolve(n);
    }
  });
  manualDiceGridEl.appendChild(btn);
}

function showManualDiceModal() {
  return new Promise((resolve) => {
    manualResolve = resolve;
    manualDiceModalEl.classList.remove("hidden");
  });
}

// ---------------- Roll button ----------------

rollBtn.addEventListener("click", async () => {
  if (state.animating) return;
  state.animating = true;
  rollBtn.disabled = true;

  let result;
  if (state.diceMode === "app") {
    result = Math.floor(Math.random() * 6) + 1;
    diceResultEl.textContent = "";
    diceOverlayEl.classList.remove("hidden");
    await animateDiceRoll(result);
    diceResultEl.textContent = result;
    await wait(500);
    diceOverlayEl.classList.add("hidden");
  } else {
    result = await showManualDiceModal();
  }

  state.turn += 1;
  turnCountEl.textContent = state.turn;
  movePlayerStep(result);
});
