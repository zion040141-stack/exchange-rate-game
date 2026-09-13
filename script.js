const GRID = 7;

const CATEGORIES = [
  "수입업자",
  "수출업자",
  "외국인 여행객",
  "내국인의 해외여행",
  "내국인의 해외 유학(노동)",
  "외국인의 국내 유학(노동)",
  "가계의 생활비",
];

const CATEGORY_ICONS = ["📦", "🚢", "✈️", "🧳", "🎓", "💼", "🏠"];
const START_ICON = "🏁";
const DIRECTION_TILE_ICON = "🔮";
const DIRECTION_TILE_LABEL = "환율 변동 예측";

// Short, icon-friendly flavor for the quiz "team status" card — the real
// category name (used everywhere else: tiles, report, explanations) stays
// unchanged; this is just a punchier label for the small card.
const CATEGORY_FLAVOR = [
  { label: "물건 수입", icons: ["🏭", "➡️", "📦"], quote: "해외에서 물건을 사 와서 대금을 원화로 치러요." },
  { label: "물건 수출", icons: ["📦", "➡️", "🚢"], quote: "물건을 해외에 팔고 외화를 벌어 와요." },
  { label: "한국 온 외국인 관광객", icons: ["🧳", "➡️", "🇰🇷"], quote: "자기 나라 돈을 원화로 바꿔서 써요." },
  { label: "해외여행 간 나", icons: ["🎒", "➡️", "✈️"], quote: "원화를 외화로 바꿔서 해외에서 써요." },
  { label: "유학 간 나", icons: ["🎒", "➡️", "🎓"], quote: "원화를 외화로 바꿔서 유학 비용을 내요." },
  { label: "한국에 유학 온 외국인", icons: ["🎓", "➡️", "💵"], quote: "한국에서 번(쓴) 돈을 자기 나라 돈으로 바꿔요." },
  { label: "우리 집 생활비", icons: ["🏠", "➡️", "🛒"], quote: "수입 물건 값이 오르면 생활비도 영향을 받아요." },
];

// Placeholder special tiles — landing here just shows a notice for now.
// Rules (skip a turn, draw a card, etc.) are still being designed.
const SPECIAL_TILES = {
  6: { type: "island", label: "무인도", icon: "🏝️" },
  9: { type: "nonsense", label: "넌센스 퀴즈", icon: "❓" },
  18: { type: "card", label: "카드뽑기", icon: "🃏" },
  21: { type: "nonsense", label: "넌센스 퀴즈", icon: "❓" },
};

const NONSENSE_QUESTIONS = [
  {
    question: "영희에게는 오빠가 3명 있습니다. 오빠들에게는 여동생이 각각 1명씩 있습니다. 오빠들의 여동생은 모두 몇 명일까요?",
    options: ["1명", "2명", "3명", "4명"],
    answerIndex: 0,
  },
  {
    question: "쌍둥이 형제가 있습니다. 형은 동생보다 5분 먼저 태어났습니다. 동생이 태어난 요일이 화요일이라면, 형이 태어난 요일은 무슨 요일일까요?",
    options: ["월요일", "화요일", "수요일", "알 수 없다"],
    answerIndex: 1,
  },
  {
    question: "다음 중 짝수는 몇 개일까요? 1, 2, 3, 4, 5, 육, 7, 8, 구, 10",
    options: ["4개", "5개", "6개", "7개"],
    answerIndex: 1,
  },
  {
    question: "철수 엄마에게는 아들이 넷 있습니다. 첫째는 일수, 둘째는 이수, 셋째는 삼수입니다. 넷째의 이름은 무엇일까요?",
    options: ["사수", "철수", "넷수", "막내"],
    answerIndex: 1,
  },
  {
    question: "열두 달 중에서 28일이 있는 달은 몇 개일까요?",
    options: ["1개", "4개", "12개", "2개"],
    answerIndex: 2,
  },
];

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
  "disadvantage", // 외국인의 국내 유학(노동): 번 원화를 본국 통화로 환전 → 상승 시 더 적은 외화 수령
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

// Only the four factors from the textbook table (외환의 수요/공급) — no
// additional economic content beyond what was explicitly provided.
const DIRECTION_FACTORS = [
  {
    text: "외국 상품의 수입이 늘었습니다.",
    direction: "up",
    explanation: "수입이 늘면 외국 상품 대금을 외환으로 지급해야 해서 외환 수요가 늘어 환율이 올라요.",
  },
  {
    text: "자국 상품의 수출이 늘었습니다.",
    direction: "down",
    explanation: "수출이 늘면 대금을 외환으로 받아 국내로 들어오는 외환 공급이 늘어 환율이 내려가요.",
  },
  {
    text: "자국민의 해외여행·해외유학·해외투자가 늘었습니다.",
    direction: "up",
    explanation: "외환이 해외로 나가는 일이 늘면 외환 수요가 늘어 환율이 올라요.",
  },
  {
    text: "외국인의 국내여행·국내투자·차관 도입이 늘었습니다.",
    direction: "down",
    explanation: "외환이 국내로 들어오는 일이 늘면 외환 공급이 늘어 환율이 내려가요.",
  },
];

const CARDS = [
  { id: "trade", icon: "🔄", title: "맞트레이드", desc: "원하는 팀과 자산을 맞바꿉니다. (혼자 하면 자산 ±2 랜덤)" },
  { id: "forward2", icon: "🚀", title: "순풍이 붑니다", desc: "앞으로 2칸 이동합니다." },
  { id: "back2", icon: "🌪️", title: "역풍을 맞았어요", desc: "뒤로 2칸 이동합니다." },
  { id: "doubleQuiz", icon: "⚡", title: "더블 찬스", desc: "퀴즈를 한 번 더 풉니다." },
  { id: "skipTurn", icon: "😴", title: "방심했어요", desc: "다음 턴을 쉽니다." },
  { id: "trivia", icon: "💡", title: "오늘의 경제 상식", desc: "게임 효과는 없지만 경제 상식을 하나 얻어갑니다." },
  { id: "catchup", icon: "🎁", title: "환율 안정 지원금", desc: "자산이 가장 낮은 팀에게 자산 +3을 지급합니다." },
  { id: "fee", icon: "💸", title: "환전 수수료", desc: "자산이 1 줄어듭니다." },
  { id: "rollAgain", icon: "🔁", title: "한 번 더 굴리기", desc: "주사위를 한 번 더 굴립니다." },
  { id: "interest", icon: "🏦", title: "저축 이자 수령", desc: "자산이 1 늘어납니다." },
];

const TRIVIA_FACTS = [
  "환율이 오르면 해외여행 경비 부담이 커져요.",
  "우리나라 환율은 보통 원/달러로 표시돼요.",
  "환율이 내리면 수입 물가가 내려가 생활비 부담이 줄 수 있어요.",
  "1997년 외환위기 때 원/달러 환율이 크게 치솟았어요.",
  "중앙은행은 환율이 너무 흔들리면 외환보유액으로 시장에 개입하기도 해요.",
  "환율은 두 나라 화폐를 바꿀 때 적용되는 교환 비율이에요.",
  "수출이 늘면 원화 가치가 오르는(환율이 내리는) 경향이 있어요.",
  "환율이 오르면 수출업자는 가격 경쟁력이 좋아져 유리해질 수 있어요.",
  "미국 기준금리가 오르면 달러가 강세를 보여 원/달러 환율이 오르는 경우가 많아요.",
  "환율 변동이 심하면 정부나 중앙은행이 '환율 안정화 정책'을 펴기도 해요.",
];

function buildPerimeterCells() {
  const cells = [];
  for (let col = 1; col <= GRID; col++) cells.push({ row: 1, col });
  for (let row = 2; row <= GRID; row++) cells.push({ row, col: GRID });
  for (let col = GRID - 1; col >= 1; col--) cells.push({ row: GRID, col });
  for (let row = GRID - 1; row >= 2; row--) cells.push({ row, col: 1 });
  return cells;
}

// Every tile's quiz type is fixed to the tile itself so its board label
// always matches what's actually asked there: about 1 in 3 non-special
// tiles is a dedicated "환율 변동 예측" (direction) tile, and the rest are
// "환율 변동 영향" tiles each tied to one specific economic-actor category.
function buildTiles() {
  const cells = buildPerimeterCells();
  const cornerIndexes = [0, GRID - 1, 2 * (GRID - 1), 3 * (GRID - 1)];

  const eligibleIndexes = cells
    .map((_, index) => index)
    .filter((index) => index !== 0 && !SPECIAL_TILES[index]);

  const directionIndexSet = new Set();
  eligibleIndexes.forEach((tileIndex, orderIndex) => {
    if (orderIndex % 3 === 2) directionIndexSet.add(tileIndex);
  });

  let impactCounter = 0;

  return cells.map((cell, index) => {
    const isCorner = cornerIndexes.includes(index);
    const isStart = index === 0;
    const special = SPECIAL_TILES[index];
    const isDirectionTile = directionIndexSet.has(index);

    let categoryIndex = -1;
    if (!isStart && !special && !isDirectionTile) {
      categoryIndex = impactCounter % CATEGORIES.length;
      impactCounter += 1;
    }

    let category;
    let icon;
    if (isStart) {
      category = "출발 / 도착";
      icon = START_ICON;
    } else if (special) {
      category = special.label;
      icon = special.icon;
    } else if (isDirectionTile) {
      category = DIRECTION_TILE_LABEL;
      icon = DIRECTION_TILE_ICON;
    } else {
      category = CATEGORIES[categoryIndex];
      icon = CATEGORY_ICONS[categoryIndex];
    }

    return {
      index,
      row: cell.row,
      col: cell.col,
      isCorner,
      isStart,
      isSpecial: Boolean(special),
      specialType: special ? special.type : null,
      isDirectionTile,
      categoryIndex,
      category,
      icon,
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

// ---------------- Setup screen ----------------

const setupState = {
  teamCount: 2,
  diceMode: "app",
};

const teamCountRowEl = document.getElementById("team-count-row");
const diceModeBtns = document.querySelectorAll("#dice-mode-row .option-btn");
const startGameBtn = document.getElementById("start-game-btn");

for (let t = 1; t <= ANIMAL_NAMES.length; t++) {
  const btn = document.createElement("button");
  btn.className = "option-btn" + (t === setupState.teamCount ? " active" : "");
  btn.textContent = `${t}팀`;
  btn.addEventListener("click", () => {
    setupState.teamCount = t;
    teamCountRowEl.querySelectorAll(".option-btn").forEach((b) => b.classList.toggle("active", b === btn));
  });
  teamCountRowEl.appendChild(btn);
}

function renderDiceModeButtons() {
  diceModeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === setupState.diceMode);
  });
}

diceModeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setupState.diceMode = btn.dataset.mode;
    renderDiceModeButtons();
  });
});

startGameBtn.addEventListener("click", startGame);

renderDiceModeButtons();

// ---------------- Game state ----------------

const FINISH_LAPS = 3;

const state = {
  units: [],
  currentUnitIndex: 0,
  turn: 0,
  diceMode: "app",
  animating: false,
  quizLog: [],
  gameEndedByLaps: false,
};

let pendingQuiz = null;

// ---------------- Teacher review mode ----------------
// Not real gameplay: every tile becomes clickable so a teacher can check
// each question's content and correct answer. Answering never touches
// score, position, or the turn order.

let isReviewMode = false;
const REVIEW_UNIT = { name: "검토용", icon: "🧑‍🏫", pos: 0, score: 0, distance: 0, laps: 0, skipNextTurn: false };

const teacherReviewFab = document.getElementById("teacher-review-fab");
const teacherReviewModal = document.getElementById("teacher-review-modal");
const teacherReviewPasswordInput = document.getElementById("teacher-review-password-input");
const teacherReviewPasswordError = document.getElementById("teacher-review-password-error");
const teacherReviewPasswordSubmit = document.getElementById("teacher-review-password-submit");

teacherReviewFab.addEventListener("click", () => {
  teacherReviewPasswordInput.value = "";
  teacherReviewPasswordError.classList.add("hidden");
  teacherReviewModal.classList.remove("hidden");
  teacherReviewPasswordInput.focus();
});

function checkTeacherReviewPassword() {
  if (teacherReviewPasswordInput.value === TEACHER_PASSWORD) {
    teacherReviewModal.classList.add("hidden");
    enterReviewMode();
  } else {
    teacherReviewPasswordError.classList.remove("hidden");
    teacherReviewPasswordInput.value = "";
    teacherReviewPasswordInput.focus();
  }
}

teacherReviewPasswordSubmit.addEventListener("click", checkTeacherReviewPassword);
teacherReviewPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkTeacherReviewPassword();
});

function enterReviewMode() {
  isReviewMode = true;
  state.units = [];
  showScreen("game-screen");
  document.getElementById("normal-panel").classList.add("hidden");
  document.getElementById("review-panel").classList.remove("hidden");
  rollBtn.classList.add("hidden");
  renderUnitBar();
  renderBoard();
}

function exitReviewMode() {
  isReviewMode = false;
  document.getElementById("normal-panel").classList.remove("hidden");
  document.getElementById("review-panel").classList.add("hidden");
  rollBtn.classList.remove("hidden");
  showScreen("setup-screen");
}

document.getElementById("exit-review-btn").addEventListener("click", exitReviewMode);

function currentUnit() {
  return state.units[state.currentUnitIndex];
}

function buildUnits() {
  const units = [];
  for (let t = 0; t < setupState.teamCount; t++) {
    units.push({
      name: `${ANIMAL_NAMES[t % ANIMAL_NAMES.length]}팀`,
      icon: ANIMAL_ICONS[t % ANIMAL_ICONS.length],
      color: UNIT_COLORS[t % UNIT_COLORS.length],
      pos: 0,
      score: 0,
      distance: 0,
      laps: 0,
      skipNextTurn: false,
    });
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
  state.gameEndedByLaps = false;

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
const assetRankingEl = document.getElementById("asset-ranking");
const turnCountEl = document.getElementById("turn-count");
const currentUnitEl = document.getElementById("current-player");
const currentTileEl = document.getElementById("current-tile");
const lapCountEl = document.getElementById("lap-count");
const rollBtn = document.getElementById("roll-btn");
const logListEl = document.getElementById("log-list");
const logToggleBtn = document.getElementById("log-toggle-btn");
const logToggleIcon = document.getElementById("log-toggle-icon");

logToggleBtn.addEventListener("click", () => {
  const collapsed = logListEl.classList.toggle("collapsed");
  logToggleIcon.textContent = collapsed ? "▸" : "▾";
});

const eventModalEl = document.getElementById("event-modal");
const eventTitleEl = document.getElementById("event-title");
const eventNewsEl = document.getElementById("event-news");
const quizCardsRowEl = document.getElementById("quiz-cards-row");
const quizHeadlineEl = document.getElementById("quiz-headline");
const quizSubtitleEl = document.getElementById("quiz-subtitle");
const quizExampleEl = document.getElementById("quiz-example");
const quizCaptionEl = document.getElementById("quiz-caption");
const quizTeamCardEl = document.getElementById("quiz-team-card");
const quizTeamIconsEl = document.getElementById("quiz-team-icons");
const quizTeamLabelEl = document.getElementById("quiz-team-label");
const quizTeamQuoteEl = document.getElementById("quiz-team-quote");

function renderDirectionCard(direction) {
  quizCardsRowEl.classList.remove("hidden");
  quizExampleEl.classList.remove("hidden");
  quizCaptionEl.classList.remove("hidden");

  quizHeadlineEl.textContent = direction === "up" ? "환율 상승 📈" : "환율 하락 📉";
  quizHeadlineEl.className = "quiz-headline " + (direction === "up" ? "direction-up" : "direction-down");
  quizSubtitleEl.textContent = direction === "up" ? "(원화 약세)" : "(원화 강세)";
  quizExampleEl.textContent = direction === "up" ? "1달러 1,000원 → 1,500원!" : "1달러 1,000원 → 700원!";
  quizCaptionEl.textContent = direction === "up" ? "달러의 가치가 비싸졌어요!" : "달러의 가치가 싸졌어요!";
}

function renderTeamCard(categoryIndex) {
  const flavor = CATEGORY_FLAVOR[categoryIndex];
  quizTeamCardEl.classList.remove("hidden");
  quizTeamIconsEl.innerHTML = flavor.icons.map((icon) => `<span>${icon}</span>`).join("");
  quizTeamLabelEl.textContent = flavor.label;
  quizTeamQuoteEl.textContent = `"${flavor.quote}"`;
  return flavor.label;
}
const eventQuestionEl = document.getElementById("event-question");
const eventAnswerRowEl = document.getElementById("event-answer-row");
const answerBtns = document.querySelectorAll(".answer-btn");
const answerNeutralBtn = document.getElementById("answer-neutral-btn");
const answerBtnA = document.getElementById("answer-btn-a");
const answerBtnB = document.getElementById("answer-btn-b");
const nonsenseOptionsEl = document.getElementById("nonsense-options");

let pendingNonsense = null;
const eventFeedbackEl = document.getElementById("event-feedback");
const feedbackTitleEl = document.getElementById("feedback-title");
const feedbackStatEl = document.getElementById("feedback-stat");
const feedbackDetailEl = document.getElementById("feedback-detail");
const eventCloseBtn = document.getElementById("event-close");

function showFeedback(title, stat, detail, correct) {
  const colorClass = correct ? "feedback-correct" : "feedback-wrong";
  feedbackTitleEl.textContent = title;
  feedbackTitleEl.className = "feedback-title " + colorClass;
  feedbackStatEl.textContent = stat;
  feedbackStatEl.className = "feedback-stat " + colorClass;
  feedbackDetailEl.textContent = detail;
  eventFeedbackEl.classList.remove("hidden");
}

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

    chip.appendChild(info);
    playerBarEl.appendChild(chip);
  });

  renderAssetRanking();
}

function renderAssetRanking() {
  const ranked = [...state.units].sort((a, b) => b.score - a.score);
  assetRankingEl.innerHTML = "";
  ranked.forEach((unit, idx) => {
    const row = document.createElement("div");
    row.className = "asset-rank-row" + (unit === currentUnit() ? " active" : "");
    row.innerHTML = `
      <span class="asset-rank-pos">${idx + 1}</span>
      <span class="asset-rank-icon">${unit.icon}</span>
      <span class="asset-rank-name">${unit.name}</span>
      <span class="asset-rank-score">${unit.score}</span>
    `;
    assetRankingEl.appendChild(row);
  });
}

function renderBoard() {
  boardEl.innerHTML = "";

  const center = document.createElement("div");
  center.className = "tile-center";
  center.innerHTML = `
    <div class="center-globe">🌍</div>
    <div class="center-label">환율 정복</div>
    <div class="center-card-stack"><div class="stack-card"></div><div class="stack-card"></div><div class="stack-card"></div></div>
  `;
  boardEl.appendChild(center);

  tiles.forEach((tile) => {
    const el = document.createElement("div");
    el.className = "tile";
    if (tile.isStart) {
      el.classList.add("start");
    } else if (tile.isSpecial) {
      el.classList.add(`special-${tile.specialType}`);
    } else if (tile.isDirectionTile) {
      el.classList.add("tile-direction");
    } else {
      el.classList.add(`tile-cat-${tile.categoryIndex}`);
    }
    if (tile.isCorner) el.classList.add("corner");
    el.style.gridRow = tile.row;
    el.style.gridColumn = tile.col;

    if (isReviewMode) {
      el.classList.add("clickable-tile");
      el.addEventListener("click", () => {
        if (tile.specialType === "card") {
          startCardPreviewGrid();
        } else {
          showEvent(tile, REVIEW_UNIT);
        }
      });
    } else if (tile.specialType === "card") {
      el.classList.add("clickable-tile");
      el.addEventListener("click", () => openCardPreview());
    }

    const occupants = state.units.filter((u) => u.pos === tile.index);

    if (occupants.length > 0) {
      el.classList.add("active-player", "occupied");
      const tokenWrap = document.createElement("div");
      tokenWrap.className = "token-wrap";
      occupants.forEach((u) => {
        const token = document.createElement("div");
        token.className = "unit-token" + (u === currentUnit() ? " current" : "");
        token.textContent = u.icon;
        tokenWrap.appendChild(token);
      });
      el.appendChild(tokenWrap);
    } else {
      const icon = document.createElement("div");
      icon.className = "tile-icon";
      icon.textContent = tile.icon;
      el.appendChild(icon);

      const label = document.createElement("div");
      label.className = "tile-label";
      label.textContent = tile.category;
      el.appendChild(label);
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
  lapCountEl.textContent = `${unit.laps} / ${FINISH_LAPS}`;
  renderUnitBar();
}

function correctImpactFor(categoryIndex, direction) {
  const baseUp = QUIZ_IMPACT_WHEN_UP[categoryIndex];
  if (direction === "up") return baseUp;
  return baseUp === "advantage" ? "disadvantage" : "advantage";
}

function showEvent(tile, unit) {
  nonsenseOptionsEl.classList.add("hidden");
  eventNewsEl.classList.add("hidden");
  quizCardsRowEl.classList.add("hidden");
  quizTeamCardEl.classList.add("hidden");
  eventCloseBtn.textContent = isReviewMode ? "확인" : "다음";

  if (tile.isStart) {
    pendingQuiz = null;
    eventTitleEl.textContent = "🏁 출발점 통과";
    eventNewsEl.textContent = "";
    eventQuestionEl.textContent = `${unit.icon} ${unit.name}이(가) 출발점을 지나 다시 게임을 이어갑니다.`;
    eventAnswerRowEl.classList.add("hidden");
    feedbackTitleEl.textContent = "";
    feedbackTitleEl.className = "feedback-title";
    feedbackStatEl.textContent = "";
    feedbackStatEl.className = "feedback-stat";
    feedbackDetailEl.textContent = "";
    eventFeedbackEl.classList.remove("hidden");
  } else if (tile.isSpecial && tile.specialType === "island") {
    const direction = Math.random() < 0.5 ? "up" : "down";
    const categoryIndex = Math.floor(Math.random() * CATEGORIES.length);
    const correctImpact = correctImpactFor(categoryIndex, direction);

    pendingQuiz = { unit, direction, correctImpact, categoryIndex, category: CATEGORIES[categoryIndex], isIsland: true, isDirectionQuiz: false };

    answerBtnA.textContent = "👍 유리해요!";
    answerBtnA.dataset.impact = "advantage";
    answerBtnB.textContent = "👎 불리해요!";
    answerBtnB.dataset.impact = "disadvantage";

    eventTitleEl.textContent = "🏝️ 무인도 탈출 퀴즈 (고난도)";
    renderDirectionCard(direction);
    const islandLabel = renderTeamCard(categoryIndex);
    eventQuestionEl.innerHTML = `이 상황이 <span class="quiz-highlight">${islandLabel}</span>에게 유리할까요, 불리할까요, 아니면 상관없을까요?`;

    if (isReviewMode) {
      eventAnswerRowEl.classList.add("hidden");
      const answerLabel = correctImpact === "advantage" ? "👍 유리해요!" : "👎 불리해요!";
      showFeedback("정답 공개", answerLabel, QUIZ_EXPLANATIONS[categoryIndex][direction], true);
    } else {
      answerNeutralBtn.classList.remove("hidden");
      eventAnswerRowEl.classList.remove("hidden");
      eventFeedbackEl.classList.add("hidden");
    }
  } else if (tile.isSpecial && tile.specialType === "nonsense") {
    pendingQuiz = null;
    const q = NONSENSE_QUESTIONS[Math.floor(Math.random() * NONSENSE_QUESTIONS.length)];
    pendingNonsense = { unit, question: q };

    eventTitleEl.textContent = "❓ 넌센스 퀴즈";
    eventNewsEl.textContent = "";
    eventQuestionEl.textContent = q.question;
    eventAnswerRowEl.classList.add("hidden");
    eventFeedbackEl.classList.add("hidden");

    if (isReviewMode) {
      nonsenseOptionsEl.classList.add("hidden");
      showFeedback("정답 공개", q.options[q.answerIndex], "(도착한 칸의 효과는 적용되지 않아요)", true);
    } else {
      nonsenseOptionsEl.innerHTML = "";
      q.options.forEach((option, idx) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = option;
        btn.addEventListener("click", () => resolveNonsense(idx === q.answerIndex));
        nonsenseOptionsEl.appendChild(btn);
      });
      nonsenseOptionsEl.classList.remove("hidden");
    }
  } else if (tile.isSpecial && tile.specialType === "card") {
    cardIsPreview = false;
    cardDrawUnit = unit;
    cardRollAgain = false;
    cardPasswordGateEl.classList.add("hidden");
    cardModalContentEl.classList.add("expanded");
    const originEl = document.querySelector(".tile.special-card");
    cardOriginRect = originEl ? originEl.getBoundingClientRect() : null;
    cardModalEl.classList.remove("hidden");
    renderCardGrid();
    return;
  } else {
    setupNormalQuiz(unit, tile);
  }
  eventModalEl.classList.remove("hidden");
}

// Builds either the impact-guess quiz ("이 상황에서 OO는 유리할까요, 불리할까요?")
// or the direction-guess quiz ("이 상황에서 환율은 상승할까요, 하락할까요?")
// using only the four factors from the textbook table. Which one appears is
// fixed per-tile (tile.isDirectionTile) so the board label always matches;
// the 더블 찬스 bonus quiz has no physical tile, so it still picks randomly.
function setupNormalQuiz(unit, tile) {
  const isDirectionQuiz = tile ? tile.isDirectionTile : Math.random() < 1 / 3;

  answerNeutralBtn.classList.add("hidden");
  eventAnswerRowEl.classList.remove("hidden");
  eventFeedbackEl.classList.add("hidden");

  if (isDirectionQuiz) {
    const factor = DIRECTION_FACTORS[Math.floor(Math.random() * DIRECTION_FACTORS.length)];
    pendingQuiz = {
      unit,
      isDirectionQuiz: true,
      correctImpact: factor.direction,
      explanationText: factor.explanation,
      category: DIRECTION_TILE_LABEL,
    };

    answerBtnA.textContent = "📈 환율 상승";
    answerBtnA.dataset.impact = "up";
    answerBtnB.textContent = "📉 환율 하락";
    answerBtnB.dataset.impact = "down";

    eventTitleEl.textContent = tile ? `${tile.category} 퀴즈` : "⚡ 더블 찬스 퀴즈";
    quizCardsRowEl.classList.remove("hidden");
    quizExampleEl.classList.add("hidden");
    quizCaptionEl.classList.add("hidden");
    quizTeamCardEl.classList.add("hidden");
    quizHeadlineEl.textContent = factor.text;
    quizHeadlineEl.className = "quiz-headline";
    quizSubtitleEl.textContent = "";
    eventQuestionEl.textContent = "이 상황에서 환율은 상승할까요, 하락할까요?";

    if (isReviewMode) {
      eventAnswerRowEl.classList.add("hidden");
      const answerLabel = factor.direction === "up" ? "📈 환율 상승" : "📉 환율 하락";
      showFeedback("정답 공개", answerLabel, factor.explanation, true);
    }
    return;
  }

  const categoryIndex = tile ? tile.categoryIndex : Math.floor(Math.random() * CATEGORIES.length);
  const category = tile ? tile.category : CATEGORIES[categoryIndex];
  const direction = Math.random() < 0.5 ? "up" : "down";
  const correctImpact = correctImpactFor(categoryIndex, direction);

  pendingQuiz = { unit, isDirectionQuiz: false, direction, correctImpact, categoryIndex, category };

  answerBtnA.textContent = "👍 유리해요!";
  answerBtnA.dataset.impact = "advantage";
  answerBtnB.textContent = "👎 불리해요!";
  answerBtnB.dataset.impact = "disadvantage";

  eventTitleEl.textContent = tile ? `${category} 퀴즈` : "⚡ 더블 찬스 퀴즈";
  renderDirectionCard(direction);
  const shortLabel = renderTeamCard(categoryIndex);
  eventQuestionEl.innerHTML = `이 상황이 <span class="quiz-highlight">${shortLabel}</span>에게 유리할까요?`;

  if (isReviewMode) {
    eventAnswerRowEl.classList.add("hidden");
    const answerLabel = correctImpact === "advantage" ? "👍 유리해요!" : "👎 불리해요!";
    showFeedback("정답 공개", answerLabel, QUIZ_EXPLANATIONS[categoryIndex][direction], true);
  }
}

answerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!pendingQuiz) return;
    const chosen = btn.dataset.impact;
    const correct = chosen === pendingQuiz.correctImpact;
    const explanation = pendingQuiz.isDirectionQuiz
      ? pendingQuiz.explanationText
      : QUIZ_EXPLANATIONS[pendingQuiz.categoryIndex][pendingQuiz.direction];
    const category = pendingQuiz.category;

    if (!isReviewMode) state.quizLog.push({ unitName: pendingQuiz.unit.name, category, correct });

    if (pendingQuiz.isIsland) {
      if (!isReviewMode) {
        pendingQuiz.unit.score += correct ? 2 : -1;
        if (!correct) pendingQuiz.unit.skipNextTurn = true;
      }
      showFeedback(
        correct ? "정답!" : "땡!",
        correct ? "자산 +2" : "자산 -1",
        correct ? explanation : `${explanation} (다음 턴은 쉬어야 해요)`,
        correct
      );
    } else {
      if (!isReviewMode) pendingQuiz.unit.score += correct ? 1 : -1;
      showFeedback(correct ? "정답!" : "땡!", correct ? "자산 +1" : "자산 -1", explanation, correct);
    }

    eventAnswerRowEl.classList.add("hidden");
    if (!isReviewMode) renderUnitBar();
  });
});

function advanceTurnOrEndGame() {
  if (state.gameEndedByLaps) {
    renderReport();
    showScreen("report-screen");
    return;
  }
  state.currentUnitIndex = (state.currentUnitIndex + 1) % state.units.length;
  updateCurrentUnitDisplay();
  state.animating = false;
  rollBtn.disabled = false;
  triggerRollInvite();
}

eventCloseBtn.addEventListener("click", () => {
  eventModalEl.classList.add("hidden");
  if (isReviewMode) return;
  advanceTurnOrEndGame();
});

function resolveNonsense(correct) {
  const unit = pendingNonsense.unit;
  if (!isReviewMode) {
    moveUnitBy(unit, correct ? 1 : -1);
    renderBoard();
    lapCountEl.textContent = `${unit.laps} / ${FINISH_LAPS}`;
  }

  nonsenseOptionsEl.classList.add("hidden");
  showFeedback(
    correct ? "정답!" : "땡!",
    correct ? "1칸 전진" : "1칸 후진",
    "(도착한 칸의 효과는 적용되지 않아요)",
    correct
  );
}

// Synthesized "tick" sound for token moves — no audio file needed.
let audioCtx = null;

function playMoveSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 720;
    gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.11);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.11);
  } catch (e) {
    // Ignore audio errors (e.g. autoplay restrictions before any user gesture).
  }
}

function moveUnitBy(unit, delta) {
  playMoveSound();
  const rawPos = unit.pos + delta;
  if (rawPos >= tileCount) {
    unit.laps += 1;
    if (unit.laps >= FINISH_LAPS) state.gameEndedByLaps = true;
  } else if (rawPos < 0) {
    unit.laps = Math.max(0, unit.laps - 1);
  }
  unit.pos = ((rawPos % tileCount) + tileCount) % tileCount;
  unit.distance = Math.max(0, unit.distance + delta);
}

function movePlayerStep(stepsLeft) {
  const unit = currentUnit();
  if (stepsLeft === 0) {
    const tile = tiles[unit.pos];
    currentTileEl.textContent = tile.category;
    addLog(`${state.turn}턴: ${unit.icon} ${unit.name} - ${tile.category} 도착`);
    showEvent(tile, unit);
    return;
  }
  moveUnitBy(unit, 1);
  renderBoard();
  lapCountEl.textContent = `${unit.laps} / ${FINISH_LAPS}`;
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
  advanceTurnOrEndGame();
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
const cardModalContentEl = cardModalEl.querySelector(".modal-content");
const cardPasswordGateEl = document.getElementById("card-password-gate");
const cardPasswordInput = document.getElementById("card-password-input");
const cardPasswordErrorEl = document.getElementById("card-password-error");
const cardPasswordSubmitBtn = document.getElementById("card-password-submit");
const cardGridEl = document.getElementById("card-grid");
const cardTradePickerEl = document.getElementById("card-trade-picker");
const cardTradeOptionsEl = document.getElementById("card-trade-options");
const cardResultEl = document.getElementById("card-result");
const cardResultTextEl = document.getElementById("card-result-text");
const cardCloseBtn = document.getElementById("card-close-btn");

let cardDrawUnit = null;
let cardRollAgain = false;
let cardIsPreview = false;
let cardOriginRect = null;

function openCardPreview() {
  if (state.animating || !cardModalEl.classList.contains("hidden")) return;

  cardIsPreview = true;
  cardDrawUnit = null;
  cardRollAgain = false;

  cardPasswordInput.value = "";
  cardPasswordErrorEl.classList.add("hidden");
  cardPasswordGateEl.classList.remove("hidden");
  cardGridEl.classList.add("hidden");
  cardTradePickerEl.classList.add("hidden");
  cardResultEl.classList.add("hidden");
  cardModalContentEl.classList.remove("expanded");

  cardModalEl.classList.remove("hidden");
}

function startCardPreviewGrid() {
  cardIsPreview = true;
  cardDrawUnit = null;
  cardRollAgain = false;
  cardPasswordGateEl.classList.add("hidden");
  cardModalContentEl.classList.add("expanded");
  const originEl = document.querySelector(".tile.special-card");
  cardOriginRect = originEl ? originEl.getBoundingClientRect() : null;
  cardModalEl.classList.remove("hidden");
  renderCardGrid();
}

function checkCardPassword() {
  if (cardPasswordInput.value === TEACHER_PASSWORD) {
    cardPasswordInput.value = "";
    startCardPreviewGrid();
  } else {
    cardPasswordErrorEl.classList.remove("hidden");
    cardPasswordInput.value = "";
    cardPasswordInput.focus();
  }
}

cardPasswordSubmitBtn.addEventListener("click", checkCardPassword);
cardPasswordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkCardPassword();
});

function renderCardGrid() {
  cardGridEl.innerHTML = "";
  cardGridEl.classList.remove("hidden");
  cardTradePickerEl.classList.add("hidden");
  cardResultEl.classList.add("hidden");

  const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
  const cardEls = shuffled.map((card) => {
    const btn = document.createElement("button");
    btn.className = "card-item";
    btn.innerHTML = '<div class="card-face card-back-face">🃏</div>';
    btn.addEventListener("click", () => pickCard(btn, card));
    cardGridEl.appendChild(btn);
    return btn;
  });

  const origin = cardOriginRect;
  cardOriginRect = null;
  if (!origin) return;

  // FLIP animation: start each card at the board tile's on-screen position,
  // then let it transition to its real grid slot (2D translate/scale only —
  // no rotateX/Y — to steer clear of the earlier 3D-transform text bug).
  requestAnimationFrame(() => {
    const deltas = cardEls.map((btn) => {
      const rect = btn.getBoundingClientRect();
      return {
        dx: origin.left + origin.width / 2 - (rect.left + rect.width / 2),
        dy: origin.top + origin.height / 2 - (rect.top + rect.height / 2),
      };
    });
    cardEls.forEach((btn, i) => {
      btn.style.transition = "none";
      btn.style.transform = `translate(${deltas[i].dx}px, ${deltas[i].dy}px) scale(0.2)`;
      btn.style.opacity = "0.4";
    });
    requestAnimationFrame(() => {
      cardEls.forEach((btn, i) => {
        btn.style.transition = `transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) ${i * 25}ms, opacity 0.3s ease ${i * 25}ms`;
        btn.style.transform = "";
        btn.style.opacity = "";
        btn.addEventListener("transitionend", () => { btn.style.transition = ""; }, { once: true });
      });
    });
  });
}

function pickCard(btn, card) {
  cardGridEl.querySelectorAll(".card-item").forEach((b) => {
    b.disabled = true;
  });
  btn.classList.add("flipping");
  setTimeout(() => {
    btn.innerHTML = `<div class="card-face card-front-face"><span class="card-icon">${card.icon}</span><span>${card.title}</span></div>`;
    btn.classList.remove("flipping");
    setTimeout(() => {
      if (cardIsPreview) {
        showCardResult(`${card.icon} ${card.title}\n${card.desc}`);
      } else {
        applyCard(card);
      }
    }, 300);
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
      moveUnitBy(unit, 2);
      renderBoard();
      lapCountEl.textContent = `${unit.laps} / ${FINISH_LAPS}`;
      showCardResult(`${card.icon} ${card.title}\n2칸 앞으로 이동했어요! (도착한 칸의 효과는 적용되지 않아요)`);
      break;
    case "back2":
      moveUnitBy(unit, -2);
      renderBoard();
      lapCountEl.textContent = `${unit.laps} / ${FINISH_LAPS}`;
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
  setupNormalQuiz(unit, null);
  eventModalEl.classList.remove("hidden");
}

cardCloseBtn.addEventListener("click", () => {
  cardModalEl.classList.add("hidden");

  if (cardIsPreview) {
    cardIsPreview = false;
    return;
  }

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

  advanceTurnOrEndGame();
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
  showScreen("setup-screen");
});

// ---------------- Developer preview (sample report data) ----------------

document.getElementById("dev-preview-btn").addEventListener("click", () => {
  const sampleUnits = [0, 1, 2].map((t) => ({
    name: `${ANIMAL_NAMES[t]}팀`,
    icon: ANIMAL_ICONS[t],
    color: UNIT_COLORS[t],
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
