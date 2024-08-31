let isRunning = false;
let isReset = true;
let startTime;
let elapsedTime = 0;
let timerInterval;
let historyList = [];

// Load history from local storage on startup
window.onload = () => {
    const savedHistory = JSON.parse(localStorage.getItem('stopwatchHistory'));
    if (savedHistory) {
        historyList = savedHistory;
        updateHistoryList();
    }
};

function updateTime() {
    elapsedTime = Date.now() - startTime;
    const totalMilliseconds = elapsedTime % 1000;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('time').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(totalMilliseconds).padStart(3, '0').slice(0, 2)}`;
}

function startStopwatch() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10); // Update every 10ms for precise time
}

function stopStopwatch() {
    clearInterval(timerInterval);
}

function resetStopwatch() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById('time').textContent = "00:00:00.00";
}

function saveTimeToHistory() {
    const currentTime = document.getElementById('time').textContent;
    historyList.push(currentTime);
    updateHistoryList();
    // Save history to local storage
    localStorage.setItem('stopwatchHistory', JSON.stringify(historyList));
}

function updateHistoryList() {
    const historyListElement = document.getElementById('history-list');
    historyListElement.innerHTML = ''; // Clear existing list
    historyList.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${index + 1}: ${time}`;
        historyListElement.appendChild(li);
    });
}

function clearHistory() {
    historyList = [];
    updateHistoryList();
    localStorage.removeItem('stopwatchHistory'); // Clear history from local storage
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!isRunning && isReset) {
            startStopwatch();
            isRunning = true;
            isReset = false;
        } else if (isRunning) {
            stopStopwatch();
            isRunning = false;
            saveTimeToHistory(); // Save time when stopping
        } else if (!isRunning && !isReset) {
            resetStopwatch();
            isReset = true;
        }
    }
});

document.getElementById('history-toggle').addEventListener('click', () => {
    const historyListElement = document.getElementById('history-list');
    historyListElement.classList.toggle('hidden'); // Toggle history list visibility
});

document.getElementById('clear-history').addEventListener('click', clearHistory);
