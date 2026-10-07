// 게임 설정값
const holeCount = 9;
const gameSeconds = 30;
const moleShowMs = 700;
const moleIntervalMs = 800;

// 화면 요소
const board = document.getElementById('board');
const scoreText = document.getElementById('scoreText');
const timeText = document.getElementById('timeText');
const bestText = document.getElementById('bestText');
const startButton = document.getElementById('startButton');
const messageText = document.getElementById('messageText');

// 게임 상태
let score = 0;
let timeLeft = gameSeconds;
let activeIndex = -1;
let isPlaying = false;
let moleTimer = null;
let countdownTimer = null;
let hideTimer = null;
let bestScore = 0;

// 최고 점수 불러오기 (저장소를 쓸 수 없는 환경도 고려)
try {
  bestScore = Number(localStorage.getItem('moleBestScore')) || 0;
} catch (e) {
  bestScore = 0;
}
bestText.textContent = bestScore;

// 구멍 생성
const holes = [];
for (let i = 0; i < holeCount; i++) {
  const hole = document.createElement('button');
  hole.className = 'w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-900 border-4 border-amber-950 flex items-center justify-center text-5xl overflow-hidden';
  hole.addEventListener('click', () => hitHole(i));
  board.appendChild(hole);
  holes.push(hole);
}

// 두더지 표시/숨김
function showMole(index) {
  hideMole();
  activeIndex = index;
  holes[index].textContent = '🐹';
}

function hideMole() {
  if (activeIndex >= 0) {
    holes[activeIndex].textContent = '';
    activeIndex = -1;
  }
}

// 무작위 구멍에 두더지 등장
function popMole() {
  const nextIndex = Math.floor(Math.random() * holeCount);
  showMole(nextIndex);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideMole, moleShowMs);
}

// 구멍 클릭 처리
function hitHole(index) {
  if (!isPlaying || index !== activeIndex) return;
  score += 1;
  scoreText.textContent = score;
  // 맞춘 두더지는 즉시 숨김
  hideMole();
  clearTimeout(hideTimer);
}

// 게임 시작
function startGame() {
  score = 0;
  timeLeft = gameSeconds;
  isPlaying = true;
  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  messageText.textContent = '';
  startButton.disabled = true;
  startButton.classList.add('opacity-50', 'cursor-not-allowed');

  moleTimer = setInterval(popMole, moleIntervalMs);
  countdownTimer = setInterval(() => {
    timeLeft -= 1;
    timeText.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// 게임 종료
function endGame() {
  isPlaying = false;
  clearInterval(moleTimer);
  clearInterval(countdownTimer);
  clearTimeout(hideTimer);
  hideMole();
  startButton.disabled = false;
  startButton.classList.remove('opacity-50', 'cursor-not-allowed');
  startButton.textContent = '다시 시작';

  if (score > bestScore) {
    bestScore = score;
    bestText.textContent = bestScore;
    try {
      localStorage.setItem('moleBestScore', String(bestScore));
    } catch (e) {
      // 저장 실패는 무시
    }
    messageText.textContent = `🎉 신기록! ${score}점`;
  } else {
    messageText.textContent = `게임 종료! ${score}점`;
  }
}

startButton.addEventListener('click', startGame);
