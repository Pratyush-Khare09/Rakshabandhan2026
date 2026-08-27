/* =============================================================
   Rakshabandhan Website — script.js
   Features: Confetti, Petals, Countdown, Rakhi Tie, Gift Box, Quiz
   ============================================================= */

// ─── CONFETTI ───────────────────────────────────────────────
(function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF6B00', '#FFD700', '#9B1C1C', '#F9A8D4', '#FFF8ED', '#FF9A3C', '#C8960C'];
  const emojis = ['🌸', '🪢', '✨', '🌺', '🎊'];

  const particles = [];
  const PARTICLE_COUNT = 160;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 3,
      d: Math.random() * PARTICLE_COUNT,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleInc: (Math.random() * 0.07) + 0.05,
      tiltAngle: 0,
      isEmoji: Math.random() < 0.12,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      speed: Math.random() * 2.5 + 1,
      opacity: 1,
    });
  }

  let angle = 0;
  let animId;
  let elapsed = 0;
  const DURATION = 5000;

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.01;
    elapsed += 16;

    particles.forEach((p, i) => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(angle + p.d) + p.speed);
      p.x += Math.sin(angle) * 1.5;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      p.opacity = Math.max(0, 1 - elapsed / DURATION);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      if (p.isEmoji) {
        ctx.font = `${p.r * 2.5}px serif`;
        ctx.fillText(p.emoji, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
        ctx.fill();
      }
      ctx.restore();

      if (p.y > canvas.height) {
        p.x = Math.random() * canvas.width;
        p.y = -10;
      }
    });

    if (elapsed < DURATION + 2000) {
      animId = requestAnimationFrame(drawConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  setTimeout(() => { drawConfetti(); }, 300);
})();


// ─── FLOATING PETALS ────────────────────────────────────────
(function initPetals() {
  const container = document.getElementById('petals-container');
  const petalSymbols = ['🌸', '🌺', '✨', '🍂'];
  const PETAL_COUNT = 18;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 12;
    const size = 0.9 + Math.random() * 1;
    petal.style.cssText = `
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      font-size: ${size}rem;
    `;
    container.appendChild(petal);
  }
})();


// ─── COUNTDOWN TIMER ────────────────────────────────────────
(function initCountdown() {
  // Rakshabandhan 2026: August 28, 2026 at 00:00:00 IST (UTC+5:30)
  const target = new Date('2026-08-28T00:00:00+05:30');

  function update() {
    const now = new Date();
    const diff = target - now;
    const note = document.getElementById('countdown-note');

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      note.textContent = '🎉 Aaj Rakshabandhan hai! Happy Rakshabandhan, Megha! 🪢';
      note.style.color = '#FFD700';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');

    if (days === 0 && hours === 0) {
      note.textContent = '🌸 Bas kuch ghante aur! Rakshabandhan aa raha hai!';
    } else if (days === 0) {
      note.textContent = '🎊 Kal Rakshabandhan hai, Megha!';
    } else if (days === 1) {
      note.textContent = '🌺 Kal Rakshabandhan hai!';
    } else {
      note.textContent = `🪢 ${days} din aur, phir aayega hamara khaas din!`;
    }
  }

  update();
  setInterval(update, 1000);
})();


// ─── RAKHI TIE INTERACTION ──────────────────────────────────
(function initRakhi() {
  const rakhiDrag = document.getElementById('rakhi-drag');
  const wrist = document.getElementById('wrist');
  const tiedMsg = document.getElementById('tied-message');
  let tied = false;

  function tieRakhi() {
    if (tied) return;
    tied = true;

    rakhiDrag.style.transition = 'all 0.6s cubic-bezier(0.68,-0.55,0.27,1.55)';
    rakhiDrag.style.opacity = '0';
    rakhiDrag.style.transform = 'scale(0.3)';

    setTimeout(() => {
      rakhiDrag.style.display = 'none';
      wrist.classList.add('rakhi-tied');
      wrist.querySelector('.wrist-label').style.display = 'none';

      tiedMsg.classList.add('show');
      launchMiniConfetti();
    }, 500);
  }

  rakhiDrag.addEventListener('click', tieRakhi);

  function launchMiniConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    const colors = ['#FF6B00', '#FFD700', '#F9A8D4', '#9B1C1C'];
    const bursts = [];
    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      bursts.push({
        x: CX, y: CY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        gravity: 0.15,
      });
    }

    function animBurst() {
      bursts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= 0.018;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });
      if (bursts.some(p => p.alpha > 0)) requestAnimationFrame(animBurst);
    }

    animBurst();
  }
})();


// ─── GIFT BOX ───────────────────────────────────────────────
let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const giftBox = document.getElementById('gift-box');
  const giftReveal = document.getElementById('gift-reveal');

  giftBox.classList.add('opened');

  setTimeout(() => {
    giftBox.style.transform = 'scale(0.8)';
    giftBox.style.opacity = '0.3';
    giftReveal.classList.add('show');
    launchGiftConfetti();
  }, 700);
}

function launchGiftConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const emojis = ['🎊', '🌸', '🪢', '✨', '🌺', '🎀'];
  const bursts = [];

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    bursts.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      alpha: 1,
      gravity: 0.12,
      size: 1.4 + Math.random(),
    });
  }

  function animGift() {
    bursts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.015;
      if (p.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}rem serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
    });
    if (bursts.some(p => p.alpha > 0)) requestAnimationFrame(animGift);
  }

  animGift();
}


// ─── SIBLING QUIZ ───────────────────────────────────────────
const quizData = [
  {
    question: "What does a good brother always do on Rakshabandhan? 😄",
    options: ["Give gifts willingly", "Pretend to sleep", "Bargain the gift price", "Say 'kal deta hoon'"],
    answer: 0,
    fun: ["Bilkul sahi! 🎁", "Uth jaa bhaiya! 😂", "Classic move! 😂", "Never! 😄"],
  },
  {
    question: "What is the unofficial sibling language for 'I love you'?",
    options: ["'Tujhe kha jaunga' 😋", "'Jao yaar!'", "'Nalayak!' said with a smile 😏", "'Whatever!'"],
    answer: 2,
    fun: ["Aww! 🥺", "Rude! 😂", "Ekdam sahi! That's true sibling love! ❤️", "Hmm... maybe! 😆"],
  },
  {
    question: "How does a sibling react when you change the TV channel?",
    options: ["Says 'Sure, you watch'", "Starts a 10-minute argument", "Watches in silence", "Leaves the room gracefully"],
    answer: 1,
    fun: ["Too generous! 😂", "THE TRUTH! 😂🔥", "Too peaceful!", "Nobody does this! 😂"],
  },
  {
    question: "On Rakshabandhan, bhaiya's first question is always...?",
    options: ["'How are you, behna?'", "'Kitna shagun chahiye?'", "'Khana khaya?'", "'Aaj kya banao?'"],
    answer: 1,
    fun: ["So sweet!", "Haan bhai, the real question! 😂💸", "Classic!", "Also valid! 😄"],
  },
  {
    question: "What is the sacred rule of sibling love?",
    options: ["Never share food 🍕", "Always take each other's side in front of parents 😇", "Steal each other's charger 😂", "Blame each other first"],
    answer: 1,
    fun: ["Food is personal! 😂", "The GOLDEN rule! ❤️🫶", "Classic sibling crime! 😂", "The first instinct! 😂"],
  },
];

let currentQ = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = quizData[currentQ];
  document.getElementById('quiz-counter').textContent = `Question ${currentQ + 1} of ${quizData.length}`;
  document.getElementById('quiz-question').textContent = q.question;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next-btn').style.display = 'none';
  answered = false;

  const fill = ((currentQ) / quizData.length) * 100;
  document.getElementById('quiz-progress-fill').style.width = fill + '%';

  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.id = `quiz-opt-${i}`;
    btn.onclick = () => answerQuestion(i);
    optionsEl.appendChild(btn);
  });
}

function answerQuestion(chosen) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQ];
  const btns = document.querySelectorAll('.quiz-opt-btn');

  btns.forEach(btn => btn.disabled = true);

  const chosenBtn = document.getElementById(`quiz-opt-${chosen}`);
  const correctBtn = document.getElementById(`quiz-opt-${q.answer}`);

  correctBtn.classList.add('correct');

  if (chosen === q.answer) {
    score++;
    chosenBtn.classList.add('correct');
    document.getElementById('quiz-feedback').textContent = '✅ ' + q.fun[chosen];
    document.getElementById('quiz-feedback').style.color = '#166534';
  } else {
    chosenBtn.classList.add('wrong');
    document.getElementById('quiz-feedback').textContent = '❌ ' + q.fun[chosen] + ' (Sahi jawab dekho! 👆)';
    document.getElementById('quiz-feedback').style.color = '#991B1B';
  }

  document.getElementById('quiz-next-btn').style.display = 'inline-block';
}

function nextQuestion() {
  currentQ++;
  if (currentQ < quizData.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById('quiz-card').style.display = 'none';
  const result = document.getElementById('quiz-result');
  result.style.display = 'block';

  document.getElementById('quiz-progress-fill').style.width = '100%';

  let emoji, title, desc;

  if (score === 5) {
    emoji = '🏆👑';
    title = 'Sibling Genius! Perfect Score!';
    desc = `Wah Megha! 5/5 — Tum toh sibling knowledge ki expert ho! Bhaiya ko garv hai! ❤️🎊`;
  } else if (score >= 3) {
    emoji = '🌟🥰';
    title = `Not bad! ${score}/5 sahi the!`;
    desc = `Acchi koshish! Sibling bond strong hai, thoda aur! Rakshabandhan mubarak! 🪢`;
  } else {
    emoji = '😂🤣';
    title = `Arey! Sirf ${score}/5?`;
    desc = `Koi baat nahi, Bhaiya ka pyaar toh 10/5 hai! Phir try karo! 🌺`;
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-desc').textContent = desc;
}

function resetQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;
  document.getElementById('quiz-card').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-progress-fill').style.width = '0%';
  renderQuestion();
}

renderQuestion();


// ─── SCROLL REVEAL ──────────────────────────────────────────
(function initScrollReveal() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(s => observer.observe(s));
})();
