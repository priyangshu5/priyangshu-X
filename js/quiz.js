/* ============================================================
   QUIZ.JS — Interactive Quiz Engine with Categories
   PRIYANGSHUX8 | Knowledge Challenge System
   ============================================================ */

let quizCategory = 'general';
let quizQuestions = [];
let quizCurrentIndex = 0;
let quizScore = 0;
let quizAnswered = false;

// Question bank
const quizBank = {
    general: [
        { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], answer: 2 },
        { q: 'How many continents are there on Earth?', options: ['5', '6', '7', '8'], answer: 2 },
        { q: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 1 },
        { q: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
        { q: 'What year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: 2 },
        { q: 'What is the chemical symbol for gold?', options: ['Ag', 'Au', 'Fe', 'Go'], answer: 1 },
        { q: 'How many bones are in the adult human body?', options: ['186', '206', '226', '256'], answer: 1 },
        { q: 'What is the speed of light in km/s (approx)?', options: ['150,000', '200,000', '300,000', '400,000'], answer: 2 },
        { q: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Rembrandt'], answer: 2 },
        { q: 'What is the largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'], answer: 1 }
    ],
    anime: [
        { q: 'What anime features a boy who becomes the "Hokage"?', options: ['One Piece', 'Naruto', 'Bleach', 'Fairy Tail'], answer: 1 },
        { q: 'In Attack on Titan, what are the giant creatures called?', options: ['Titans', 'Giants', 'Colossi', 'Behemoths'], answer: 0 },
        { q: 'What is the name of the death notebook in Death Note?', options: ['Shinigami Note', 'Death Note', 'Kill Book', 'Soul Note'], answer: 1 },
        { q: 'Who is the main protagonist of Dragon Ball Z?', options: ['Vegeta', 'Gohan', 'Goku', 'Piccolo'], answer: 2 },
        { q: 'What studio created Spirited Away?', options: ['Madhouse', 'Ghibli', 'Toei', 'Sunrise'], answer: 1 },
        { q: 'In One Piece, what is Luffy\'s dream?', options: ['Find treasure', 'Become Pirate King', 'Sail the world', 'Defeat Marines'], answer: 1 },
        { q: 'What color is Pikachu?', options: ['Blue', 'Red', 'Yellow', 'Green'], answer: 2 },
        { q: 'In Demon Slayer, what is Tanjiro\'s breathing style?', options: ['Water', 'Fire', 'Wind', 'Thunder'], answer: 0 },
        { q: 'What anime features the "Survey Corps"?', options: ['AOT', 'Code Geass', 'Tokyo Ghoul', 'Parasyte'], answer: 0 },
        { q: 'Who is known as the "Fullmetal Alchemist"?', options: ['Roy Mustang', 'Edward Elric', 'Alphonse', 'Scar'], answer: 1 }
    ],
    growth: [
        { q: 'What habit is most linked to productivity?', options: ['Multitasking', 'Deep Work', 'Procrastination', 'Busy Work'], answer: 1 },
        { q: 'What is the "growth mindset" concept by Carol Dweck?', options: ['Fixed abilities', 'Abilities can grow', 'Natural talent only', 'Luck matters most'], answer: 1 },
        { q: 'How many minutes of meditation daily is recommended for beginners?', options: ['5-10', '30-45', '60', '90'], answer: 0 },
        { q: 'What is the 80/20 rule also known as?', options: ['Murphy\'s Law', 'Pareto Principle', 'Newton\'s Law', 'Moore\'s Law'], answer: 1 },
        { q: 'Which hormone is known as the "stress hormone"?', options: ['Dopamine', 'Serotonin', 'Cortisol', 'Oxytocin'], answer: 2 },
        { q: 'What is journaling primarily used for?', options: ['Time travel', 'Self-reflection', 'Cooking', 'Coding'], answer: 1 },
        { q: 'How many hours of sleep do adults typically need?', options: ['5-6', '7-9', '10-12', '3-4'], answer: 1 },
        { q: 'What does "SMART" in SMART goals stand for?', options: ['Simple', 'Specific Measurable Achievable Relevant Time-bound', 'Strong', 'Slow'], answer: 1 },
        { q: 'What is the best way to build a habit?', options: ['Willpower alone', 'Consistency & small steps', 'Motivation bursts', 'Waiting'], answer: 1 },
        { q: 'What emotion is most associated with burnout?', options: ['Joy', 'Excitement', 'Emotional exhaustion', 'Curiosity'], answer: 2 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initQuizCategoryButtons();
    resetQuiz();
});

function initQuizCategoryButtons() {
    document.querySelectorAll('.quiz-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quiz-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            quizCategory = btn.getAttribute('data-cat');
            resetQuiz();
        });
    });
}

function resetQuiz() {
    quizQuestions = [...quizBank[quizCategory]];
    // Shuffle
    for (let i = quizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
    }
    quizCurrentIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    document.getElementById('quiz-score-display').textContent = 'Score: 0';
    document.getElementById('quiz-progress-display').textContent = 'Question 0/10';
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next-btn').style.display = 'none';
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (quizCurrentIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }
    const question = quizQuestions[quizCurrentIndex];
    document.getElementById('quiz-question').textContent = question.q;
    document.getElementById('quiz-progress-display').textContent = `Question ${quizCurrentIndex + 1}/${quizQuestions.length}`;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next-btn').style.display = 'none';

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    question.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectQuizAnswer(i));
        optionsContainer.appendChild(btn);
    });
    quizAnswered = false;
}

function selectQuizAnswer(selectedIndex) {
    if (quizAnswered) return;
    quizAnswered = true;
    const question = quizQuestions[quizCurrentIndex];
    const correctIndex = question.answer;

    // Highlight correct/incorrect
    const optionButtons = document.querySelectorAll('.quiz-option');
    optionButtons.forEach((btn, i) => {
        btn.classList.add('disabled');
        if (i === correctIndex) btn.classList.add('correct');
        if (i === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('incorrect');
    });

    if (selectedIndex === correctIndex) {
        quizScore++;
        document.getElementById('quiz-feedback').textContent = '✅ Correct!';
        document.getElementById('quiz-feedback').style.color = '#22c55e';
    } else {
        document.getElementById('quiz-feedback').textContent = '❌ Wrong! The correct answer is highlighted.';
        document.getElementById('quiz-feedback').style.color = '#ef4444';
    }
    document.getElementById('quiz-score-display').textContent = 'Score: ' + quizScore;
    document.getElementById('quiz-next-btn').style.display = 'inline-flex';
}

function nextQuizQuestion() {
    quizCurrentIndex++;
    renderQuizQuestion();
}

function endQuiz() {
    const total = quizQuestions.length;
    const percentage = Math.round((quizScore / total) * 100);
    let message = '';
    if (percentage >= 90) message = '🏆 Legendary! You\'re a master!';
    else if (percentage >= 70) message = '🔥 Great job! Keep pushing!';
    else if (percentage >= 50) message = '👍 Not bad! Room to grow.';
    else message = '🌱 Keep learning. Every step counts.';

    document.getElementById('quiz-question').textContent = `Quiz Complete!`;
    document.getElementById('quiz-options').innerHTML = `<p style="text-align:center; font-size:1.2rem;">${message}</p><p style="text-align:center;">You scored ${quizScore}/${total} (${percentage}%)</p>`;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next-btn').style.display = 'none';
    document.getElementById('quiz-progress-display').textContent = 'Complete';
}