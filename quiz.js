// quiz.js
let questions = [];
let currentIndex = 0;
let score = 0;

async function fetchQuestions() {
  const res = await fetch('https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple');
  const data = await res.json();
  questions = data.results;
  showQuestion();
}

function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function showQuestion() {
  const quizEl = document.getElementById('quiz');
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const nextBtn = document.getElementById('next-btn');

  if (currentIndex >= questions.length) {
    quizEl.innerHTML = `<h2>クイズ終了！</h2><p>あなたのスコア: ${score}</p>`;
    return;
  }

  const q = questions[currentIndex];
  const questionText = decodeHTMLEntities(q.question);
  const options = [...q.incorrect_answers, q.correct_answer];
  shuffleArray(options);

  questionEl.textContent = questionText;
  optionsEl.innerHTML = '';

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = decodeHTMLEntities(option);
    btn.onclick = () => {
      if (option === q.correct_answer) {
        score++;
        alert('正解！');
      } else {
        alert(`不正解！正解は「${decodeHTMLEntities(q.correct_answer)}」です`);
      }
      document.getElementById('score').textContent = `スコア: ${score}`;
      nextBtn.disabled = false;
    };
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = true;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex++;
  showQuestion();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  document.getElementById('score').textContent = 'スコア: 0';
  fetchQuestions();
});

fetchQuestions();
