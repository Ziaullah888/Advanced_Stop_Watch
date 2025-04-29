// Create floating particles
const particlesContainer = document.querySelector('.particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.opacity = Math.random();
    particlesContainer.appendChild(particle);
}

let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 1;
let lapTimes = [];

const timeElements = {
    hours: document.querySelector('.hours'),
    minutes: document.querySelector('.minutes'),
    seconds: document.querySelector('.seconds'),
    milliseconds: document.querySelector('.milliseconds')
};

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapContainer = document.getElementById('lapContainer');
const bestLapElement = document.getElementById('bestLap');
const avgLapElement = document.getElementById('avgLap');
const totalLapsElement = document.getElementById('totalLaps');

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);

function start() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10);
        startBtn.innerHTML = '<i class="fas fa-flag"></i>Lap';
        startBtn.removeEventListener('click', start);
        startBtn.addEventListener('click', addLap);
    }
}

function stop() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.innerHTML = '<i class="fas fa-play"></i>Start';
        startBtn.removeEventListener('click', addLap);
        startBtn.addEventListener('click', start);
    }
}

function reset() {
    stop();
    elapsedTime = 0;
    lapCount = 1;
    lapTimes = [];
    updateDisplay(0);
    lapContainer.innerHTML = '';
    updateStats();
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    updateDisplay(elapsedTime);
}

function updateDisplay(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    timeElements.hours.textContent = padNumber(hours);
    timeElements.minutes.textContent = padNumber(minutes);
    timeElements.seconds.textContent = padNumber(seconds);
    timeElements.milliseconds.textContent = padNumber(milliseconds);
}

function addLap() {
    const lapTime = elapsedTime;
    lapTimes.push(lapTime);
    
    const lapItem = document.createElement('div');
    lapItem.classList.add('lap-item');
    lapItem.innerHTML = `
        <span>Lap ${lapCount}</span>
        <span>${formatTime(lapTime)}</span>
    `;
    lapContainer.insertBefore(lapItem, lapContainer.firstChild);
    lapCount++;
    
    updateStats();
}

function updateStats() {
    totalLapsElement.textContent = lapTimes.length;
    
    if (lapTimes.length > 0) {
        const bestLap = Math.min(...lapTimes);
        const avgLap = lapTimes.reduce((a, b) => a + b) / lapTimes.length;
        
        bestLapElement.textContent = formatTime(bestLap);
        avgLapElement.textContent = formatTime(avgLap);
    } else {
        bestLapElement.textContent = '--:--:--';
        avgLapElement.textContent = '--:--:--';
    }
}

function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}.${padNumber(milliseconds)}`;
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}