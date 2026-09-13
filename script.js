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

const CATEGORY_ICONS = ["📦", "🚢", "✈️", "🧳", "🎓", "💼", "🏠"];
const START_ICON = "🏁";

// Placeholder special tiles — landing here just shows a notice for now.
// Rules (skip a turn, draw a card, etc.) are still being designed.
const SPECIAL_TILES = {
  6: { type: "island", label: "무인도", icon: "🏝️" },
  18: { type: "card", label: "카드뽑기", icon: "🃏" },
};

const ANIMAL_NAMES = ["토끼", "강아지", "고양이", "호랑이", "판다", "여우", "곰", "원숭이", "코알라", "펭귄"];
const ANIMAL_ICONS = ["🐰", "🐶", "🐱", "🐯", "🐼", "🦊", "🐻", "🐵", "🐨", "🐧"];
const UNIT_COLORS = [
  "#2f6fed", "#ef5350", "#0f9488", "#ab47bc", "#f0932b",
  "#20bf6b", "#eb3b5a", "#4b6584", "#a55eea", "#0fb9b1",
];

const TEACHER_PASSWORD = "4034";

// Whether each category is "advantage" or "disadvantage" when the exchange rate RISES.
// When the rate falls, the impact is the opposite.
const QUIZ_IMPACT_WHEN_UP = [
  "disadvantage", // 수입업자: 원화를 외화로 바꿔 결제 → 상승 시 더 많은 원화 필요
  "advantage",    // 수출업자: 번 외화를 원화로 환전 → 상승 시 더 많은 원화 수령
  "advantage",    // 외국인 여행객: 자국 통화를 원화로 환전 → 상승 시 더 많은 원화 수령
  "disadvantage", // 내국인의 해외여행: 원화를 외화로 환전 → 상승 시 더 많은 원화 필요
  "disadvantage", // 내국인의 해외 유학(노동): 원화를 외화로 환전 → 상승 시 더 많은 원화 필요
  "disadvantage", // 외국인의 국내 유행(노동): 번 원화를 본국 통화로 환전 → 상승 시 더 적은 외화 수령
  "disadvantage", // 가계의 생활비: 수입 물가 상승 → 생활비 부담 증가
];

const QUIZ_EXPLANATIONS = [
  { up: "환율이 오르면 수입업자는 물건을 살 때 원화를 더 많이 내야 해서 불리해요.", down: "환율이 내리면 수입업자는 물건을 살 때 원화를 더 적게 내도 되어 유리해요." },
  { up: "환율이 오르면 수출업자는 번 외화를 원화로 바꿀 때 더 많이 받을 수 있어 유리해요.", down: "환율이 내리면 수출업자는 번 외화를 원화로 바꿀 때 더 적게 받게 되어 불리해요." },
  { up: "환율이 오르면 외국인은 자국 돈을 원화로 바꿀 때 더 많이 받아 한국 여행이 저렴해지므로 유리해요.", down: "환율이 내리면 외국인은 원화를 더 적게 받게 되어 여행 비용 부담이 늘어 불리해요." },
  { up: "환율이 오르면 해외에서 쓸 돈을 마련하는 데 원화가 더 많이 필요해 불리해요.", down: "환율이 내리면 해외에서 쓸 돈을 더 적은 원화로 마련할 수 있어 유리해요." },
  { up: "환율이 오르면 유학비·생활비 부담이 커져 불리해요.", down: "환율이 내리면 유학비·생활비 부담이 줄어 유리해요." },
  { up: "환율이 오르면 국내에서 번 돈을 본국 돈으로 바꿀 때 더 적게 받아 불리해요.", down: "환율이 내리면 국내에서 번 돈을 본국 돈으로 바꿀 때 더 많이 받아 유리해요." },
  { up: "환율이 오르면 수입 물가가 올라 생활비 부담이 커져 불리해요.", down: "환율이 내리면 수입 물가가 내려 생활비 부담이 줄어 유리해요." },
];

const NEWS_HEADLINES = {
  up: [
    "📰 미국이 기준금리를 인상하면서 달러가 강세를 보여 환율이 올랐습니다!",
    "📰 국제 유가가 급등하면서 원화 가치가 떨어져 환율이 올랐습니다!",
    "📰 우리나라 무역수지 적자가 커졌다는 소식에 환율이 올랐습니다!",
    "📰 외국인 투자자들이 국내 주식을 대거 팔아치우며 환율이 올랐습니다!",
  ],
  down: [
    "📰 우리나라 수출이 크게 늘었다는 소식에 환율이 내렸습니다!",
    "📰 미국이 기준금리를 인하할 거라는 기대감에 환율이 내렸습니다!",
    "📰 외국인 투자자들이 국내 주식을 대거 사들이며 환율이 내렸습니다!",
    "📰 국제 원자재 가격이 안정되면서 환율이 내렸습니다!",
  ],
};

const CARDS = [
  { id: "trade", icon: "🔄", title: "맞트레이드" },
  { id: "forward2", icon: "🚀", title: "순풍이 붑니다" },
  { id: "back2", icon: "🌪️", title: "역풍을 맞았어요" },
  { id: "doubleQuiz", icon: "⚡", title: "더블 찬스" },
  { id: "skipTurn", icon: "😴", title: "방심했어요" },
  { id: "trivia", icon: "💡", title: "오늘의 경제 상식" },
  { id: "catchup", icon: "🎁", title: "환율 안정 지원금" },
  { id: "fee", icon: "💸", title: "환전 수수료" },
  { id: "rollAgain", icon: "🔁", title: "한 번 더 굴리기" },
  { id: "interest", icon: "🏦", title: "저축 이자 수령" },
];

const TRIVIA_FACTS = [
  "환율이 오르면 해외여행 경비 부담이 커져요.",
  "우리나라 환율은 보통 원/달러로 표시돼요.",
  "환율이 내리면 수입 물가가 내려가 생활비 부담이 줄 수 있어요.",
  "1997년 외환위기 때 원/달러 환율이 크게 치솟았어요.",
  "중앙은행은 환율이 너무 흔들리면 외환보유액으로 시장에 개입하기도 해요.",
];

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
    const special = SPECIAL_TILES[index];
    const categoryIndex = isStart || special ? -1 : (index - 1) % CATEGORIES.length;
    return {
      index,
      row: cell.row,
      col: cell.col,
      isCorner,
      isStart,
      isSpecial: Boolean(special),
      specialType: special ? special.type : null,
      categoryIndex,
      category: isStart ? "출발" : special ? special.label : CATEGORIES[categoryIndex],
      icon: isStart ? START_ICON : special ? special.icon : CATEGORY_ICONS[categoryIndex],
    };
  });
}

const tiles = buildTiles();
const tileCount = tiles.length;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------- Screen navigation ----------------

function showScreen(id) {
  document.querySelectorAll(".app-screen").forEach((el) => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.back));
});

// ---------------- Role screen ----------------

document.getElementById("role-teacher-btn").addEventListener("click", () => {
  showScreen("teacher-password-screen");
  document.getElementById("teacher-password-input").focus();
});

document.getElementById("role-student-btn").addEventListener("click", () => {
  showScreen("student-setup-screen");
});

// ---------------- Teacher password screen ----------------

const teacherPasswordInput = document.getElementById("teacher-password-input");
const passwordErrorEl = document.getElementById("password-error");

function checkTeacherPassword() {
  if (teacherPasswordInput.value === TEACHER_PASSWORD) {
    passwordErrorEl.classList.add("hidden");
    teacherPasswordInput.value = "";
    showScreen("teacher-setup-screen");
  } else {
    passwordErrorEl.classList.remove("hidden");
    teacherPasswordInput.value = "";
    teacherPasswordInput.focus();
  }
}

document.getElementById("teacher-password-submit").addEventListener("click", checkTeacherPassword);
teacherPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkTeacherPassword();
});

// ---------------- Teacher setup screen ----------------

const teacherPlayerCountSelect = document.getElementById("teacher-player-count");
const teacherTeamCountSelect = document.getElementById("teacher-team-count");
const teacherDiceModeBtns = document.querySelectorAll("#teacher-dice-mode-row .option-btn");
let teacherDiceMode = "app";

for (let n = 2; n <= 25; n++) {
  const opt = document.createElement("option");
  opt.value = n;
  opt.textContent = `${n}명`;
  teacherPlayerCountSelect.appendChild(opt);
}
teacherPlayerCountSelect.value = 10;

function renderTeacherTeamCountOptions() {
  const playerCount = Number(teacherPlayerCountSelect.value);
  const max = Math.min(playerCount - 1, ANIMAL_NAMES.length);
  const prevValue = teacherTeamCountSelect.value;
  teacherTeamCountSelect.innerHTML = "";
  for (let t = 2; t <= max; t++) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = `${t}팀`;
    teacherTeamCountSelect.appendChild(opt);
  }
  if (prevValue && Number(prevValue) <= max) teacherTeamCountSelect.value = prevValue;
}

teacherPlayerCountSelect.addEventListener("change", renderTeacherTeamCountOptions);
renderTeacherTeamCountOptions();

teacherDiceModeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    teacherDiceMode = btn.dataset.mode;
    teacherDiceModeBtns.forEach((b) => b.classList.toggle("active", b === btn));
  });
});
teacherDiceModeBtns[0].classList.add("active");

document.getElementById("teacher-start-btn").addEventListener("click", () => {
  setupState.playerCount = Number(teacherPlayerCountSelect.value);
  setupState.teamMode = "team";
  setupState.teamCount = Number(teacherTeamCountSelect.value);
  setupState.diceMode = teacherDiceMode;
  startGame();
});

// ---------------- Student setup screen ----------------

const setupState = {
  playerCount: 1,
  teamMode: "solo",
  teamCount: null,
  diceMode: "app",
};

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
  units: [],
  currentUnitIndex: 0,
  turn: 0,
  diceMode: "app",
  animating: false,
  quizLog: [],
};

let pendingQuiz = null;

function currentUnit() {
  return state.units[state.currentUnitIndex];
}

function buildUnits() {
  const units = [];
  if (setupState.teamMode === "team") {
    for (let t = 0; t < setupState.teamCount; t++) {
      units.push({
        name: `${ANIMAL_NAMES[t % ANIMAL_NAMES.length]}팀`,
        icon: ANIMAL_ICONS[t % ANIMAL_ICONS.length],
        color: UNIT_COLORS[t % UNIT_COLORS.length],
        memberCount: 0,
        pos: 0,
        score: 0,
        distance: 0,
        skipNextTurn: false,
      });
    }
    for (let i = 0; i < setupState.playerCount; i++) {
      units[i % setupState.teamCount].memberCount += 1;
    }
  } else {
    for (let i = 0; i < setupState.playerCount; i++) {
      units.push({
        name: `플레이어 ${i + 1}`,
        icon: ANIMAL_ICONS[i % ANIMAL_ICONS.length],
        color: UNIT_COLORS[i % UNIT_COLORS.length],
        memberCount: null,
        pos: 0,
        score: 0,
        distance: 0,
        skipNextTurn: false,
      });
    }
  }
  return units;
}

function startGame() {
  state.units = buildUnits();
  state.currentUnitIndex = 0;
  state.turn = 0;
  state.diceMode = setupState.diceMode;
  state.animating = false;
  state.quizLog = [];

  showScreen("game-screen");

  turnCountEl.textContent = state.turn;
  renderUnitBar();
  renderBoard();
  updateCurrentUnitDisplay();
  triggerRollInvite();
}

function triggerRollInvite() {
  rollBtn.classList.remove("invite");
  void rollBtn.offsetWidth;
  rollBtn.classList.add("invite");
}

// ---------------- Game screen elements ----------------

const boardEl = document.getElementById("board");
const playerBarEl = document.getElementById("player-bar");
const turnCountEl = document.getElementById("turn-count");
const currentUnitEl = document.getElementById("current-player");
const currentTileEl = document.getElementById("current-tile");
const rollBtn = document.getElementById("roll-btn");
const logListEl = document.getElementById("log-list");

const eventModalEl = document.getElementById("event-modal");
const eventTitleEl = document.getElementById("event-title");
const eventNewsEl = document.getElementById("event-news");
const eventQuestionEl = document.getElementById("event-question");
const eventAnswerRowEl = document.getElementById("event-answer-row");
const answerBtns = document.querySelectorAll(".answer-btn");
const answerNeutralBtn = document.getElementById("answer-neutral-btn");
const eventFeedbackEl = document.getElementById("event-feedback");
const eventFeedbackTextEl = document.getElementById("event-feedback-text");
const eventCloseBtn = document.getElementById("event-close");

const diceOverlayEl = document.getElementById("dice-overlay");
const diceCubeEl = document.getElementById("dice-cube");
const diceResultEl = document.getElementById("dice-result");

const manualDiceModalEl = document.getElementById("manual-dice-modal");
const manualDiceGridEl = document.getElementById("manual-dice-grid");

function renderUnitBar() {
  playerBarEl.innerHTML = "";
  state.units.forEach((unit, idx) => {
    const chip = document.createElement("div");
    chip.className = "player-chip" + (idx === state.currentUnitIndex ? " active" : "");
    chip.style.setProperty("--chip-color", unit.color);

    const avatar = document.createElement("div");
    avatar.className = "chip-avatar";
    avatar.textContent = unit.icon;
    chip.appendChild(avatar);

    const info = document.createElement("div");
    info.className = "chip-info";

    const nameEl = document.createElement("div");
    nameEl.className = "chip-name";
    nameEl.textContent = unit.name;
    info.appendChild(nameEl);

    const teamEl = document.createElement("div");
    teamEl.className = "chip-team";
    teamEl.textContent = (unit.memberCount !== null ? `${unit.memberCount}명 · ` : "") + `자산 ${unit.score}`;
    info.appendChild(teamEl);

    chip.appendChild(info);
    playerBarEl.appendChild(chip);
  });
}

function renderBoard() {
  boardEl.innerHTML = "";

  const center = document.createElement("div");
  center.className = "tile-center";
  center.innerHTML = '<div class="center-globe">🌍</div><div class="center-label">환율 정복</div>';
  boardEl.appendChild(center);

  tiles.forEach((tile) => {
    const el = document.createElement("div");
    el.className = "tile";
    if (tile.isStart) {
      el.classList.add("start");
    } else if (tile.isSpecial) {
      el.classList.add(`special-${tile.specialType}`);
    } else {
      el.classList.add(`tile-cat-${tile.categoryIndex}`);
    }
    if (tile.isCorner) el.classList.add("corner");
    el.style.gridRow = tile.row;
    el.style.gridColumn = tile.col;

    const icon = document.createElement("div");
    icon.className = "tile-icon";
    icon.textContent = tile.icon;
    el.appendChild(icon);

    const label = document.createElement("div");
    label.className = "tile-label";
    label.textContent = tile.category;
    el.appendChild(label);

    const occupants = state.units.filter((u) => u.pos === tile.index);
    if (occupants.length > 0) {
      el.classList.add("active-player");
      const tokenWrap = document.createElement("div");
      tokenWrap.className = "token-wrap";
      occupants.forEach((u) => {
        const token = document.createElement("div");
        token.className = "unit-token" + (u === currentUnit() ? " current" : "");
        token.textContent = u.icon;
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

function updateCurrentUnitDisplay() {
  const unit = currentUnit();
  currentUnitEl.textContent = `${unit.icon} ${unit.name}`;
  currentTileEl.textContent = tiles[unit.pos].category;
  renderUnitBar();
}

function correctImpactFor(categoryIndex, direction) {
  const baseUp = QUIZ_IMPACT_WHEN_UP[categoryIndex];
  if (direction === "up") return baseUp;
  return baseUp === "advantage" ? "disadvantage" : "advantage";
}

function showEvent(tile, unit) {
  if (tile.isStart) {
    pendingQuiz = null;
    eventTitleEl.textContent = "🏁 출발점 통과";
    eventNewsEl.textContent = "";
    eventQuestionEl.textContent = `${unit.icon} ${unit.name}이(가) 출발점을 지나 다시 게임을 이어갑니다.`;
    eventAnswerRowEl.classList.add("hidden");
    eventFeedbackTextEl.textContent = "";
    eventFeedbackEl.classList.remove("hidden");
  } else if (tile.isSpecial && tile.specialType === "island") {
    const direction = Math.random() < 0.5 ? "up" : "down";
    const headlines = NEWS_HEADLINES[direction];
    const news = headlines[Math.floor(Math.random() * headlines.length)];
    const categoryIndex = Math.floor(Math.random() * CATEGORIES.length);
    const correctImpact = correctImpactFor(categoryIndex, direction);

    pendingQuiz = { unit, direction, correctImpact, categoryIndex, isIsland: true };

    eventTitleEl.textContent = "🏝️ 무인도 탈출 퀴즈 (고난도)";
    eventNewsEl.textContent = news;
    eventQuestionEl.textContent = `이 상황에서 "${CATEGORY_ICONS[categoryIndex]} ${CATEGORIES[categoryIndex]}"는 유리할까요, 불리할까요, 아니면 상관없을까요?`;
    answerNeutralBtn.classList.remove("hidden");
    eventAnswerRowEl.classList.remove("hidden");
    eventFeedbackEl.classList.add("hidden");
  } else if (tile.isSpecial && tile.specialType === "card") {
    openCardModal(unit);
    return;
  } else {
    const direction = Math.random() < 0.5 ? "up" : "down";
    const headlines = NEWS_HEADLINES[direction];
    const news = headlines[Math.floor(Math.random() * headlines.length)];
    const correctImpact = correctImpactFor(tile.categoryIndex, direction);

    pendingQuiz = { tile, unit, direction, correctImpact, categoryIndex: tile.categoryIndex, isIsland: false };

    eventTitleEl.textContent = `${tile.category} 퀴즈`;
    eventNewsEl.textContent = news;
    eventQuestionEl.textContent = `이 상황에서 "${tile.category}"는 유리할까요, 불리할까요?`;
    answerNeutralBtn.classList.add("hidden");
    eventAnswerRowEl.classList.remove("hidden");
    eventFeedbackEl.classList.add("hidden");
  }
  eventModalEl.classList.remove("hidden");
}

answerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!pendingQuiz) return;
    const chosen = btn.dataset.impact;
    const correct = chosen === pendingQuiz.correctImpact;
    const explanation = QUIZ_EXPLANATIONS[pendingQuiz.categoryIndex][pendingQuiz.direction];
    const category = CATEGORIES[pendingQuiz.categoryIndex];

    state.quizLog.push({ unitName: pendingQuiz.unit.name, category, correct });

    if (pendingQuiz.isIsland) {
      pendingQuiz.unit.score += correct ? 2 : -1;
      if (!correct) pendingQuiz.unit.skipNextTurn = true;
      eventFeedbackTextEl.textContent = correct
        ? `🎉 탈출 성공! (자산 +2) ${explanation}`
        : `🔒 탈출 실패... 다음 턴은 쉬어야 해요. (자산 -1) ${explanation}`;
    } else {
      pendingQuiz.unit.score += correct ? 1 : -1;
      eventFeedbackTextEl.textContent = (correct ? "✅ 정답이에요! (자산 +1) " : "❌ 아쉬워요! (자산 -1) ") + explanation;
    }

    eventFeedbackTextEl.className = correct ? "feedback-correct" : "feedback-wrong";
    eventAnswerRowEl.classList.add("hidden");
    eventFeedbackEl.classList.remove("hidden");
    renderUnitBar();
  });
});

eventCloseBtn.addEventListener("click", () => {
  eventModalEl.classList.add("hidden");
  state.currentUnitIndex = (state.currentUnitIndex + 1) % state.units.length;
  updateCurrentUnitDisplay();
  state.animating = false;
  rollBtn.disabled = false;
  triggerRollInvite();
});

function movePlayerStep(stepsLeft) {
  const unit = currentUnit();
  if (stepsLeft === 0) {
    const tile = tiles[unit.pos];
    currentTileEl.textContent = tile.category;
    addLog(`${state.turn}턴: ${unit.icon} ${unit.name} - ${tile.category} 도착`);
    showEvent(tile, unit);
    return;
  }
  unit.pos = (unit.pos + 1) % tileCount;
  unit.distance += 1;
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

function skipStuckTurn(unit) {
  unit.skipNextTurn = false;
  state.turn += 1;
  turnCountEl.textContent = state.turn;
  addLog(`${state.turn}턴: ${unit.icon} ${unit.name} - 무인도에 갇혀 이번 턴을 쉽니다`);
  state.currentUnitIndex = (state.currentUnitIndex + 1) % state.units.length;
  updateCurrentUnitDisplay();
  triggerRollInvite();
}

async function performRoll() {
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
}

rollBtn.addEventListener("click", () => {
  if (state.animating) return;
  const unit = currentUnit();
  if (unit.skipNextTurn) {
    skipStuckTurn(unit);
    return;
  }
  performRoll();
});

// ---------------- Card draw (카드뽑기) ----------------

const cardModalEl = document.getElementById("card-modal");
const cardGridEl = document.getElementById("card-grid");
const cardTradePickerEl = document.getElementById("card-trade-picker");
const cardTradeOptionsEl = document.getElementById("card-trade-options");
const cardResultEl = document.getElementById("card-result");
const cardResultTextEl = document.getElementById("card-result-text");
const cardCloseBtn = document.getElementById("card-close-btn");

let cardDrawUnit = null;
let cardRollAgain = false;

function openCardModal(unit) {
  cardDrawUnit = unit;
  cardRollAgain = false;

  cardGridEl.innerHTML = "";
  cardGridEl.classList.remove("hidden");
  cardTradePickerEl.classList.add("hidden");
  cardResultEl.classList.add("hidden");

  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  shuffled.forEach((card) => {
    const btn = document.createElement("button");
    btn.className = "card-item";
    btn.innerHTML = '<div class="card-face card-back-face">🃏</div>';
    btn.addEventListener("click", () => pickCard(btn, card));
    cardGridEl.appendChild(btn);
  });

  cardModalEl.classList.remove("hidden");
}

function pickCard(btn, card) {
  cardGridEl.querySelectorAll(".card-item").forEach((b) => {
    b.disabled = true;
  });
  btn.classList.add("flipping");
  setTimeout(() => {
    btn.innerHTML = `<div class="card-face card-front-face"><span class="card-icon">${card.icon}</span><span>${card.title}</span></div>`;
    btn.classList.remove("flipping");
    setTimeout(() => applyCard(card), 300);
  }, 250);
}

function showCardResult(text, { rollAgain = false } = {}) {
  cardRollAgain = rollAgain;
  cardGridEl.classList.add("hidden");
  cardTradePickerEl.classList.add("hidden");
  cardResultTextEl.textContent = text;
  cardResultEl.classList.remove("hidden");
}

function applyCard(card) {
  const unit = cardDrawUnit;

  switch (card.id) {
    case "trade": {
      const others = state.units.filter((u) => u !== unit);
      if (others.length === 0) {
        const delta = Math.random() < 0.5 ? 2 : -2;
        unit.score += delta;
        renderUnitBar();
        showCardResult(`${card.icon} ${card.title}\n바꿀 상대가 없어서 대신 자산이 ${delta > 0 ? "+2" : "-2"} 됐어요!`);
      } else {
        cardGridEl.classList.add("hidden");
        cardTradePickerEl.classList.remove("hidden");
        cardTradeOptionsEl.innerHTML = "";
        others.forEach((opponent) => {
          const optBtn = document.createElement("button");
          optBtn.className = "option-btn";
          optBtn.textContent = `${opponent.icon} ${opponent.name} (자산 ${opponent.score})`;
          optBtn.addEventListener("click", () => {
            const temp = unit.score;
            unit.score = opponent.score;
            opponent.score = temp;
            renderUnitBar();
            showCardResult(`${card.icon} ${card.title}\n${opponent.icon} ${opponent.name}과(와) 자산을 맞바꿨어요!`);
          });
          cardTradeOptionsEl.appendChild(optBtn);
        });
      }
      break;
    }
    case "forward2":
      unit.pos = (unit.pos + 2) % tileCount;
      unit.distance += 2;
      renderBoard();
      showCardResult(`${card.icon} ${card.title}\n2칸 앞으로 이동했어요! (도착한 칸의 효과는 적용되지 않아요)`);
      break;
    case "back2":
      unit.pos = (unit.pos - 2 + tileCount) % tileCount;
      unit.distance = Math.max(0, unit.distance - 2);
      renderBoard();
      showCardResult(`${card.icon} ${card.title}\n2칸 뒤로 이동했어요.`);
      break;
    case "skipTurn":
      unit.skipNextTurn = true;
      showCardResult(`${card.icon} ${card.title}\n다음 턴은 쉬어야 해요.`);
      break;
    case "trivia": {
      const fact = TRIVIA_FACTS[Math.floor(Math.random() * TRIVIA_FACTS.length)];
      showCardResult(`${card.icon} ${card.title}\n축하합니다! 이 카드는 게임에는 1도 도움이 안 돼요. 대신 쓸데없이 유식해집니다 😏\n"${fact}"`);
      break;
    }
    case "catchup": {
      const minScore = Math.min(...state.units.map((u) => u.score));
      const targets = state.units.filter((u) => u.score === minScore);
      targets.forEach((u) => {
        u.score += 3;
      });
      renderUnitBar();
      showCardResult(`${card.icon} ${card.title}\n자산이 가장 낮은 ${targets.map((u) => u.name).join(", ")}에게 +3을 지급했어요!`);
      break;
    }
    case "fee":
      unit.score -= 1;
      renderUnitBar();
      showCardResult(`${card.icon} ${card.title}\n자산이 1 줄었어요.`);
      break;
    case "interest":
      unit.score += 1;
      renderUnitBar();
      showCardResult(`${card.icon} ${card.title}\n자산이 1 늘었어요.`);
      break;
    case "doubleQuiz":
      cardModalEl.classList.add("hidden");
      triggerBonusQuiz(unit);
      break;
    case "rollAgain":
      showCardResult(`${card.icon} ${card.title}\n주사위를 한 번 더 굴려요!`, { rollAgain: true });
      break;
  }
}

function triggerBonusQuiz(unit) {
  const direction = Math.random() < 0.5 ? "up" : "down";
  const headlines = NEWS_HEADLINES[direction];
  const news = headlines[Math.floor(Math.random() * headlines.length)];
  const categoryIndex = Math.floor(Math.random() * CATEGORIES.length);
  const correctImpact = correctImpactFor(categoryIndex, direction);

  pendingQuiz = { unit, direction, correctImpact, categoryIndex, isIsland: false };

  eventTitleEl.textContent = "⚡ 더블 찬스 퀴즈";
  eventNewsEl.textContent = news;
  eventQuestionEl.textContent = `이 상황에서 "${CATEGORY_ICONS[categoryIndex]} ${CATEGORIES[categoryIndex]}"는 유리할까요, 불리할까요?`;
  answerNeutralBtn.classList.add("hidden");
  eventAnswerRowEl.classList.remove("hidden");
  eventFeedbackEl.classList.add("hidden");
  eventModalEl.classList.remove("hidden");
}

cardCloseBtn.addEventListener("click", () => {
  cardModalEl.classList.add("hidden");

  if (cardRollAgain) {
    cardRollAgain = false;
    const unit = currentUnit();
    if (unit.skipNextTurn) {
      skipStuckTurn(unit);
    } else {
      performRoll();
    }
    return;
  }

  state.currentUnitIndex = (state.currentUnitIndex + 1) % state.units.length;
  updateCurrentUnitDisplay();
  state.animating = false;
  rollBtn.disabled = false;
  triggerRollInvite();
});

// ---------------- Learning feedback report ----------------

const reportPlayerListEl = document.getElementById("report-player-list");
const reportWeakCategoriesEl = document.getElementById("report-weak-categories");

function computeStatsBy(keyFn) {
  const stats = new Map();
  state.quizLog.forEach((entry) => {
    const key = keyFn(entry);
    if (!stats.has(key)) stats.set(key, { correct: 0, total: 0 });
    const s = stats.get(key);
    s.total += 1;
    if (entry.correct) s.correct += 1;
  });
  return stats;
}

function wrongCategoriesFor(unitName) {
  const seen = new Set();
  const wrong = [];
  state.quizLog.forEach((e) => {
    if (e.unitName === unitName && !e.correct && !seen.has(e.category)) {
      seen.add(e.category);
      wrong.push(e.category);
    }
  });
  return wrong;
}

// Placeholder ranking formula: asset score matters most, distance travelled
// (a proxy for "how far/fast" a unit got) breaks ties and adds a bit of the
// board-game luck factor. The exact weighting is still up for discussion.
const DISTANCE_WEIGHT = 1;
const SCORE_WEIGHT = 10;

function rankScoreFor(unit) {
  return unit.score * SCORE_WEIGHT + unit.distance * DISTANCE_WEIGHT;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function renderReport() {
  const unitStats = computeStatsBy((e) => e.unitName);
  const ranked = [...state.units].sort((a, b) => rankScoreFor(b) - rankScoreFor(a));

  reportPlayerListEl.innerHTML = "";
  ranked.forEach((u, idx) => {
    const s = unitStats.get(u.name) || { correct: 0, total: 0 };
    const wrong = wrongCategoriesFor(u.name);
    const rankLabel = MEDALS[idx] || `${idx + 1}위`;
    const row = document.createElement("div");
    row.className = "report-player-row";
    row.innerHTML = `
      <div class="report-player-top">
        <span class="report-player-name">${rankLabel} ${u.icon} ${u.name}</span>
        <span class="report-player-score">자산 ${u.score} · 정답 ${s.correct}/${s.total} · ${u.distance}칸 이동</span>
      </div>
      ${wrong.length > 0 ? `<div class="report-player-wrong">틀린 개념: ${wrong.join(", ")}</div>` : ""}
    `;
    reportPlayerListEl.appendChild(row);
  });

  const categoryStats = computeStatsBy((e) => e.category);
  const weak = [...categoryStats.entries()]
    .map(([category, s]) => ({ category, wrong: s.total - s.correct, total: s.total }))
    .filter((c) => c.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 3);

  reportWeakCategoriesEl.innerHTML = "";
  if (weak.length === 0) {
    const li = document.createElement("li");
    li.textContent = "틀린 문제가 없습니다. 완벽해요! 🎉";
    reportWeakCategoriesEl.appendChild(li);
  } else {
    weak.forEach((w) => {
      const li = document.createElement("li");
      li.textContent = `${w.category} — ${w.total}문제 중 ${w.wrong}번 오답`;
      reportWeakCategoriesEl.appendChild(li);
    });
  }
}

document.getElementById("end-game-btn").addEventListener("click", () => {
  renderReport();
  showScreen("report-screen");
});

document.getElementById("report-restart-btn").addEventListener("click", () => {
  showScreen("role-screen");
});

// ---------------- Developer preview (sample report data) ----------------

document.getElementById("dev-preview-btn").addEventListener("click", () => {
  const sampleUnits = [0, 1, 2].map((t) => ({
    name: `${ANIMAL_NAMES[t]}팀`,
    icon: ANIMAL_ICONS[t],
    color: UNIT_COLORS[t],
    memberCount: 3,
    pos: 0,
    score: 0,
    distance: 10 + Math.floor(Math.random() * 30),
  }));
  state.units = sampleUnits;
  state.quizLog = [];
  sampleUnits.forEach((u) => {
    CATEGORIES.forEach((category) => {
      const attempts = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < attempts; i++) {
        const correct = Math.random() < 0.65;
        u.score += correct ? 1 : -1;
        state.quizLog.push({ unitName: u.name, category, correct });
      }
    });
  });
  renderReport();
  showScreen("report-screen");
});
