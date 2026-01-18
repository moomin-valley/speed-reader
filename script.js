// Speed Reader - Main Script

// State
const state = {
    text: '',
    words: [],
    currentIndex: 0,
    isPlaying: false,
    wpm: 300,
    timeoutId: null
};

// DOM Elements
const wordDisplay = document.querySelector('#word-display .word');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const backBtn = document.getElementById('back-btn');
const speedSlider = document.getElementById('speed-slider');
const wpmInput = document.getElementById('wpm-input');
const textInput = document.getElementById('text-input');

// LocalStorage key
const STORAGE_KEY = 'rsvp-reader-wpm';

// Initialize
function init() {
    loadWpm();
    setupEventListeners();
}

// Load WPM from localStorage
function loadWpm() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state.wpm = parseInt(saved, 10);
        speedSlider.value = state.wpm;
        wpmInput.value = state.wpm;
    }
}

// Save WPM to localStorage
function saveWpm() {
    localStorage.setItem(STORAGE_KEY, state.wpm.toString());
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', togglePause);
    backBtn.addEventListener('click', back);
    speedSlider.addEventListener('input', onSliderChange);
    wpmInput.addEventListener('input', onWpmInputChange);
    textInput.addEventListener('input', onTextChange);
}

// Parse text into words
function parseText(text) {
    return text.split(/\s+/).filter(word => word.length > 0);
}

// Get center letter index
function getCenterIndex(word) {
    const letters = word.replace(/[^a-zA-Z]/g, '');
    const len = letters.length;
    if (len === 0) return -1;
    return Math.floor(len / 2);
}

// Calculate display time for a word
function getDisplayTime(word, wpm) {
    const baseTime = 60000 / wpm;
    let time = baseTime;

    // Long word adjustment
    if (word.length > 6) {
        time += (word.length - 6) * 15;
    }

    // Punctuation pause
    if (/[.,;:!?]$/.test(word)) {
        time += 50;
    }

    return time;
}

// Render word with highlighted center letter (fixed position)
function renderWord(word) {
    if (!word) {
        wordDisplay.innerHTML = '<span class="before"></span><span class="center"></span><span class="after"></span>';
        return;
    }

    const centerIndex = getCenterIndex(word);
    if (centerIndex === -1) {
        // No letters - show word in center span
        wordDisplay.innerHTML = `<span class="before"></span><span class="center">${word}</span><span class="after"></span>`;
        return;
    }

    // Find the position of the center letter in the original word
    let letterCount = 0;
    let actualIndex = -1;
    for (let i = 0; i < word.length; i++) {
        if (/[a-zA-Z]/.test(word[i])) {
            if (letterCount === centerIndex) {
                actualIndex = i;
                break;
            }
            letterCount++;
        }
    }

    if (actualIndex === -1) {
        wordDisplay.innerHTML = `<span class="before"></span><span class="center">${word}</span><span class="after"></span>`;
        return;
    }

    const before = word.slice(0, actualIndex);
    const center = word[actualIndex];
    const after = word.slice(actualIndex + 1);

    wordDisplay.innerHTML = `<span class="before">${before}</span><span class="center">${center}</span><span class="after">${after}</span>`;
}

// Text change handler
function onTextChange() {
    state.text = textInput.value;
    state.words = parseText(state.text);
}

// Slider change handler
function onSliderChange() {
    state.wpm = parseInt(speedSlider.value, 10);
    wpmInput.value = state.wpm;
    saveWpm();
}

// WPM input change handler
function onWpmInputChange() {
    let value = parseInt(wpmInput.value, 10);
    if (isNaN(value)) return;
    value = Math.max(100, Math.min(900, value));
    state.wpm = value;
    speedSlider.value = value;
    saveWpm();
}

// Update pause button text
function updatePauseButton() {
    pauseBtn.textContent = state.isPlaying ? 'Pause' : 'Resume';
}

// Start reading
function start() {
    if (state.words.length === 0) {
        onTextChange();
    }
    if (state.words.length === 0) return;

    state.currentIndex = 0;
    state.isPlaying = true;
    updatePauseButton();
    showCurrentWord();
}

// Toggle pause/resume
function togglePause() {
    if (!state.isPlaying && state.words.length > 0) {
        state.isPlaying = true;
        updatePauseButton();
        scheduleNextWord();
    } else {
        state.isPlaying = false;
        updatePauseButton();
        if (state.timeoutId) {
            clearTimeout(state.timeoutId);
            state.timeoutId = null;
        }
    }
}

// Back 10 words
function back() {
    state.currentIndex = Math.max(0, state.currentIndex - 10);
    if (state.words.length > 0) {
        renderWord(state.words[state.currentIndex]);
    }
}

// Show current word and schedule next
function showCurrentWord() {
    if (state.currentIndex >= state.words.length) {
        state.isPlaying = false;
        updatePauseButton();
        return;
    }

    const word = state.words[state.currentIndex];
    renderWord(word);

    if (state.isPlaying && state.currentIndex < state.words.length - 1) {
        scheduleNextWord();
    } else {
        state.isPlaying = false;
        updatePauseButton();
    }
}

// Schedule the next word
function scheduleNextWord() {
    const word = state.words[state.currentIndex];
    const delay = getDisplayTime(word, state.wpm);

    state.timeoutId = setTimeout(() => {
        state.currentIndex++;
        showCurrentWord();
    }, delay);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
