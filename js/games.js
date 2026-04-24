/* ============================================================
   GAMES.JS — Memory Match, Tic Tac Toe, Reflex Tap
   PRIYANGSHUX8 | Elite Mini-Game Suite
   ============================================================ */

// ----- MEMORY MATCH GAME -----
let memoryCards = [];
let memoryFlippedCards = [];
let memoryMoves = 0;
let memoryPairsFound = 0;
let memoryLocked = false;

const memoryEmojis = ['🔥', '⚡', '🌙', '🔴', '💀', '👁', '🖤', '✨'];

function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    // Create pairs
    const cards = [...memoryEmojis, ...memoryEmojis];
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    memoryCards = cards;
    memoryFlippedCards = [];
    memoryMoves = 0;
    memoryPairsFound = 0;
    memoryLocked = false;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-pairs').textContent = '0';

    grid.innerHTML = '';
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.textContent = '?';
        card.addEventListener('click', () => flipMemoryCard(card));
        grid.appendChild(card);
    });
}

function flipMemoryCard(card) {
    if (memoryLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memoryFlippedCards.length >= 2) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    memoryFlippedCards.push(card);

    if (memoryFlippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').textContent = memoryMoves;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryFlippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        memoryPairsFound++;
        document.getElementById('memory-pairs').textContent = memoryPairsFound;
        memoryFlippedCards = [];
        if (memoryPairsFound === memoryEmojis.length) {
            setTimeout(() => {
                alert('🎉 Congratulations! You found all pairs in ' + memoryMoves + ' moves!');
            }, 400);
        }
    } else {
        // No match
        memoryLocked = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '?';
            card2.textContent = '?';
            memoryFlippedCards = [];
            memoryLocked = false;
        }, 800);
    }
}

function resetMemoryGame() {
    initMemoryGame();
}

// ----- TIC TAC TOE -----
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttCurrentPlayer = 'X';
let tttGameOver = false;

function initTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttCurrentPlayer = 'X';
    tttGameOver = false;
    document.getElementById('tictactoe-status').innerHTML = 'Your turn — <strong>X</strong>';
    const grid = document.getElementById('tictactoe-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tictactoe-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => tttCellClick(cell, i));
        grid.appendChild(cell);
    }
}

function tttCellClick(cell, index) {
    if (tttGameOver) return;
    if (tttBoard[index] !== '') return;
    tttBoard[index] = tttCurrentPlayer;
    cell.textContent = tttCurrentPlayer;
    cell.classList.add(tttCurrentPlayer === 'X' ? 'x' : 'o');

    if (checkTTTWin()) {
        tttGameOver = true;
        document.getElementById('tictactoe-status').innerHTML = `<strong>${tttCurrentPlayer}</strong> wins! 🎉`;
        highlightTTTWinningCells();
        return;
    }
    if (tttBoard.every(cell => cell !== '')) {
        tttGameOver = true;
        document.getElementById('tictactoe-status').textContent = "It's a draw! 🤝";
        return;
    }

    tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('tictactoe-status').innerHTML = `Your turn — <strong>${tttCurrentPlayer}</strong>`;
}

function checkTTTWin() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]            // diagonals
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            window._tttWinningPattern = pattern;
            return true;
        }
    }
    return false;
}

function highlightTTTWinningCells() {
    const pattern = window._tttWinningPattern;
    if (!pattern) return;
    const cells = document.querySelectorAll('.tictactoe-cell');
    pattern.forEach(i => {
        cells[i].style.background = 'rgba(34, 197, 94, 0.4)';
        cells[i].style.borderColor = '#22c55e';
    });
}

function resetTicTacToe() {
    initTicTacToe();
}

// ----- REFLEX TAP GAME -----
let reflexScore = 0;
let reflexBest = 0;
let reflexActive = false;
let reflexTimeout = null;

function startReflexRound() {
    const arena = document.getElementById('reflex-arena');
    const target = document.getElementById('reflex-target');
    const prompt = document.getElementById('reflex-prompt');
    if (!arena || !target) return;

    reflexActive = true;
    reflexScore = 0;
    document.getElementById('reflex-score').textContent = '0';
    prompt.textContent = 'Get ready...';
    target.classList.add('hidden');

    // Show target after random delay
    const delay = 800 + Math.random() * 2000;
    reflexTimeout = setTimeout(() => {
        if (!reflexActive) return;
        showReflexTarget();
    }, delay);

    // Update best from storage
    const storedBest = localStorage.getItem('priyangshux8_reflex_best');
    if (storedBest) {
        reflexBest = parseInt(storedBest);
        document.getElementById('reflex-best').textContent = reflexBest;
    }
}

function showReflexTarget() {
    const arena = document.getElementById('reflex-arena');
    const target = document.getElementById('reflex-target');
    const prompt = document.getElementById('reflex-prompt');
    if (!arena || !target) return;

    const arenaRect = arena.getBoundingClientRect();
    const maxX = arenaRect.width - 50;
    const maxY = arenaRect.height - 50;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    target.style.left = randomX + 'px';
    target.style.top = randomY + 'px';
    target.classList.remove('hidden');
    target.style.animation = 'none';
    target.offsetHeight; // trigger reflow
    target.style.animation = 'glowPulse 0.5s ease-in-out infinite';
    prompt.textContent = 'TAP IT!';
    target._appearTime = Date.now();

    target.onclick = (e) => {
        e.stopPropagation();
        if (!reflexActive) return;
        const reactionTime = Date.now() - target._appearTime;
        reflexScore++;
        document.getElementById('reflex-score').textContent = reflexScore;
        prompt.textContent = `Hit! (${reactionTime}ms) — Score: ${reflexScore}`;
        target.classList.add('hidden');
        target.onclick = null;

        if (reflexScore > reflexBest) {
            reflexBest = reflexScore;
            document.getElementById('reflex-best').textContent = reflexBest;
            localStorage.setItem('priyangshux8_reflex_best', reflexBest);
        }

        // Next target after short delay
        setTimeout(() => {
            if (reflexActive) showReflexTarget();
        }, 600);
    };

    // Miss timeout
    setTimeout(() => {
        if (target.classList.contains('hidden')) return;
        if (reflexActive) {
            reflexActive = false;
            target.classList.add('hidden');
            prompt.textContent = `Too slow! Final score: ${reflexScore}. Click to restart.`;
            if (reflexTimeout) clearTimeout(reflexTimeout);
        }
    }, 2000);
}

// Arena click to start
document.addEventListener('DOMContentLoaded', () => {
    const arena = document.getElementById('reflex-arena');
    if (arena) {
        arena.addEventListener('click', function(e) {
            if (e.target === arena || e.target.id === 'reflex-prompt') {
                if (!reflexActive) startReflexRound();
            }
        });
    }
});

// Initialize games when DOM ready
function initGames() {
    initMemoryGame();
    initTicTacToe();
}
document.addEventListener('DOMContentLoaded', initGames);