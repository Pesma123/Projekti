
// ---------- Konfiguracija (svi hiperparametri na jednom mjestu) ----------
const CONFIG = {
    gridSize: 10,          // 10x10 polja
    cellSize: 50,          // svako polje 50x50 piksela
    alpha: 0.1,            // stopa učenja
    gamma: 0.9,            // faktor diskontovanja
    epsilonMin: 0.05,
    epsilonStart: 0.3,
    epsilonDecay: 5000,    // veći broj = sporije opadanje epsilona
    maxStepsPerEpisode: 200,
    totalEpisodes: 300,
    stepHistoryWindow: 50, // koliko zadnjih epizoda ulazi u prosjek
    wallDensity: 0.25,     // gustina zidova pri nasumičnom generisanju
    animationStepDelayMs: 20,
    animationPathDelayMs: 300,
    rewardWall: -5,
    rewardStep: -1,
    rewardGoal: 100,
    maxMazeGenAttempts: 100,
};

const ACTIONS = ['up', 'down', 'left', 'right'];

// ---------- Sigurno dohvatanje DOM elemenata ----------
function getEl(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Element sa id="${id}" nije pronađen u DOM-u.`);
    }
    return el;
}

function setText(id, value) {
    const el = getEl(id);
    if (el) el.textContent = value;
}

// ---------- Podešavanja mreže ----------
const canvas = getEl('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
if (ctx) ctx.font = '30px serif';

let walls = new Set();      // pozicije zidova, npr. "3,4"
const start = { x: 0, y: CONFIG.gridSize - 1 };   // donji lijevi ugao
const goal  = { x: CONFIG.gridSize - 1, y: 0 };   // gornji desni ugao

function key(x, y) { return `${x},${y}`; }

// ---------- Crtanje mreže ----------
function drawGrid() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < CONFIG.gridSize; x++) {
        for (let y = 0; y < CONFIG.gridSize; y++) {
            ctx.strokeStyle = '#ddd';
            ctx.strokeRect(x * CONFIG.cellSize, y * CONFIG.cellSize, CONFIG.cellSize, CONFIG.cellSize);

            if (walls.has(key(x, y))) {
                ctx.fillStyle = '#333';
                ctx.fillRect(x * CONFIG.cellSize, y * CONFIG.cellSize, CONFIG.cellSize, CONFIG.cellSize);
            }
        }
    }

    const heatmapEl = getEl('showHeatmap');
    if (heatmapEl && heatmapEl.checked) {
        drawHeatmap();
    }

    ctx.fillStyle = 'black';
    ctx.fillText('🧀', goal.x * CONFIG.cellSize + 10, goal.y * CONFIG.cellSize + 35);
}

function drawMouseAt(pos) {
    if (!ctx) return;
    ctx.fillText('🐭', pos.x * CONFIG.cellSize + 10, pos.y * CONFIG.cellSize + 35);
}

drawGrid();
drawMouseAt(start);

// ---------- Klik na canvas = postavi/ukloni zid ----------
if (canvas) {
    canvas.addEventListener('click', (e) => {
        if (isTraining) return; // ne diraj zidove dok se trenira

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / CONFIG.cellSize);
        const y = Math.floor((e.clientY - rect.top) / CONFIG.cellSize);
        const k = key(x, y);

        if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y)) return;

        if (walls.has(k)) walls.delete(k);
        else walls.add(k);

        drawGrid();
        drawMouseAt(start);
    });
}

// ============================================================
// Q-LEARNING AGENT
// ============================================================

let Q = {}; // Q[state] = { up, down, left, right }

function getQ(state, action) {
    const k = key(state.x, state.y);
    if (!Q[k]) Q[k] = { up: 0, down: 0, left: 0, right: 0 };
    return Q[k][action];
}

function setQ(state, action, value) {
    const k = key(state.x, state.y);
    if (!Q[k]) Q[k] = { up: 0, down: 0, left: 0, right: 0 };
    Q[k][action] = value;
}

function move(state, action) {
    let { x, y } = state;
    if (action === 'up') y -= 1;
    if (action === 'down') y += 1;
    if (action === 'left') x -= 1;
    if (action === 'right') x += 1;

    if (x < 0 || x >= CONFIG.gridSize || y < 0 || y >= CONFIG.gridSize || walls.has(key(x, y))) {
        return { next: state, reward: CONFIG.rewardWall, done: false };
    }
    if (x === goal.x && y === goal.y) {
        return { next: { x, y }, reward: CONFIG.rewardGoal, done: true };
    }
    return { next: { x, y }, reward: CONFIG.rewardStep, done: false };
}

function chooseAction(state, epsilon) {
    if (Math.random() < epsilon) {
        return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    }
    let best = ACTIONS[0];
    let bestVal = getQ(state, best);
    for (const a of ACTIONS) {
        const val = getQ(state, a);
        if (val > bestVal) {
            best = a;
            bestVal = val;
        }
    }
    return best;
}

function getEpsilon(episodeNum) {
    return Math.max(CONFIG.epsilonMin, CONFIG.epsilonStart - episodeNum / CONFIG.epsilonDecay);
}

function getAlgorithm() {
    const el = getEl('algoSelect');
    return el ? el.value : 'qlearning';
}

// ---------- Jedinstvena funkcija za jedan korak učenja ----------
// Koristi je i instant trening (runOneEpisode) i vizuelni trening (stepOnce),
// tako da formula za Q-learning/SARSA update postoji samo na JEDNOM mjestu.
function learnStep(state, action, epsilon, algorithm) {
    const { next, reward, done } = move(state, action);

    let nextAction = null;
    let nextValue;

    if (algorithm === 'sarsa') {
        // SARSA: koristi akciju koju STVARNO biramo sljedeći put
        nextAction = chooseAction(next, epsilon);
        nextValue = getQ(next, nextAction);
    } else {
        // Q-learning: koristi NAJBOLJU moguću sljedeću akciju
        nextValue = Math.max(...ACTIONS.map(a => getQ(next, a)));
    }

    const oldQ = getQ(state, action);
    setQ(state, action, oldQ + CONFIG.alpha * (reward + CONFIG.gamma * nextValue - oldQ));

    return { next, done, nextAction };
}

function runOneEpisode(episodeNum) {
    let state = { ...start };
    let steps = 0;
    const epsilon = getEpsilon(episodeNum);
    const algorithm = getAlgorithm();

    // za SARSA moramo unaprijed izabrati akciju
    let action = chooseAction(state, epsilon);

    while (steps < CONFIG.maxStepsPerEpisode) {
        const { next, done, nextAction } = learnStep(state, action, epsilon, algorithm);

        state = next;
        // SARSA prenosi već izabranu akciju; Q-learning bira novu nezavisno
        action = algorithm === 'sarsa' ? nextAction : chooseAction(state, epsilon);

        steps++;
        if (done) break;
    }
    return steps;
}

// ============================================================
// TRENIRANJE - vizuelno (korak po korak) sa mogućnošću ubrzanja
// ============================================================

let isTraining = false;
let skipRequested = false;
let currentEpisode = 0;
let totalEpisodesGlobal = CONFIG.totalEpisodes;
let stepHistory = [];     // zadnjih N epizoda - za prosjek
let allStepCounts = [];   // sve epizode - za graf

function updateStatsAfterEpisode(steps, episodeNum) {
    stepHistory.push(steps);
    if (stepHistory.length > CONFIG.stepHistoryWindow) stepHistory.shift();
    const avg = stepHistory.reduce((a, b) => a + b, 0) / stepHistory.length;

    allStepCounts.push(steps);

    setText('epNum', episodeNum);
    setText('avgSteps', avg.toFixed(1));
    drawChart();
}

function trainEpisodeVisible(episodeNum, speed) {
    if (!isTraining) return;

    if (skipRequested) {
        finishInstantly(episodeNum);
        return;
    }

    let state = { ...start };
    let steps = 0;
    const epsilon = getEpsilon(episodeNum);

    function stepOnce() {
        if (!isTraining) return;

        if (skipRequested) {
            finishInstantly(episodeNum);
            return;
        }

        const algorithm = getAlgorithm();
        const action = chooseAction(state, epsilon);
        const { next, done } = learnStep(state, action, epsilon, algorithm);

        state = next;
        steps++;

        drawGrid();
        drawMouseAt(state);

        setText('epNum', episodeNum);
        setText('stepNum', steps);
        setText('epsVal', epsilon.toFixed(3));

        if (done || steps >= CONFIG.maxStepsPerEpisode) {
            updateStatsAfterEpisode(steps, episodeNum);
            currentEpisode = episodeNum + 1;

            if (currentEpisode <= totalEpisodesGlobal && isTraining) {
                setTimeout(() => trainEpisodeVisible(currentEpisode, speed), 10);
            } else {
                finishTraining();
            }
            return;
        }

        setTimeout(stepOnce, speed);
    }

    stepOnce();
}

// ---------- Ubrzanje - ostatak epizoda odradi se instant, bez crtanja svakog koraka ----------
function finishInstantly(fromEpisode) {
    for (let ep = fromEpisode; ep <= totalEpisodesGlobal; ep++) {
        const steps = runOneEpisode(ep);
        updateStatsAfterEpisode(steps, ep);
    }
    finishTraining(true);
}

function finishTraining(wasSkipped) {
    isTraining = false;
    skipRequested = false;
    drawGrid();
    drawMouseAt(start);
    setText('status', wasSkipped
        ? 'Status: treniranje gotovo! (ubrzano do kraja)'
        : 'Status: treniranje gotovo!');
}

// ============================================================
// GRAF NAPRETKA (broj koraka po epizodi kroz vrijeme)
// ============================================================

const chartCanvas = getEl('chart');
const chartCtx = chartCanvas ? chartCanvas.getContext('2d') : null;

function drawChart() {
    if (!chartCtx) return;
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    if (allStepCounts.length === 0) return;

    const maxSteps = Math.max(...allStepCounts, 1);
    const w = chartCanvas.width / allStepCounts.length;

    chartCtx.strokeStyle = '#2196F3';
    chartCtx.lineWidth = 2;
    chartCtx.beginPath();
    allStepCounts.forEach((s, i) => {
        const x = i * w;
        const y = chartCanvas.height - (s / maxSteps) * chartCanvas.height;
        if (i === 0) chartCtx.moveTo(x, y);
        else chartCtx.lineTo(x, y);
    });
    chartCtx.stroke();
}

// ============================================================
// DUGMAD
// ============================================================

function resetStatsDisplay(statusMessage) {
    setText('status', statusMessage);
    setText('epNum', '0');
    setText('stepNum', '0');
    setText('avgSteps', '-');
}

const btnResetTraining = getEl('btnResetTraining');
if (btnResetTraining) {
    btnResetTraining.addEventListener('click', () => {
        if (isTraining) return; // ne diraj dok se trenira

        Q = {};
        stepHistory = [];
        allStepCounts = [];
        currentEpisode = 0;

        drawGrid();
        drawMouseAt(start);
        drawChart();

        resetStatsDisplay('Status: trening resetovan, labirint zadržan');
    });
}

const btnTrain = getEl('btnTrain');
if (btnTrain) {
    btnTrain.addEventListener('click', () => {
        if (isTraining) return;
        isTraining = true;
        skipRequested = false;
        allStepCounts = [];
        stepHistory = [];
        currentEpisode = 1;
        totalEpisodesGlobal = CONFIG.totalEpisodes;

        setText('epTotal', totalEpisodesGlobal);
        setText('status', 'Status: treniranje u toku...');

        trainEpisodeVisible(currentEpisode, CONFIG.animationStepDelayMs);
    });
}

const btnSkip = getEl('btnSkip');
if (btnSkip) {
    btnSkip.addEventListener('click', () => {
        if (!isTraining) return;
        skipRequested = true;
        setText('status', 'Status: ubrzavam do kraja...');
    });
}

const btnReset = getEl('btnReset');
if (btnReset) {
    btnReset.addEventListener('click', () => {
        isTraining = false;
        skipRequested = false;
        walls.clear();
        Q = {};
        stepHistory = [];
        allStepCounts = [];
        currentEpisode = 0;
        drawGrid();
        drawMouseAt(start);
        drawChart();
        resetStatsDisplay('Status: resetovano');
    });
}

const btnPlay = getEl('btnPlay');
if (btnPlay) {
    btnPlay.addEventListener('click', () => {
        if (isTraining) return;

        let state = { ...start };
        let path = [{ ...state }];

        for (let i = 0; i < 100; i++) {
            const action = chooseAction(state, 0);
            const { next, done } = move(state, action);
            state = next;
            path.push({ ...state });
            if (done) break;
        }

        animatePath(path);
    });
}

const btnRandom = getEl('btnRandom');
if (btnRandom) {
    btnRandom.addEventListener('click', () => {
        if (isTraining) return; // ne mijenjaj labirint dok se trenira

        generateRandomMaze(CONFIG.wallDensity);

        // resetuj i Q-tabelu jer je stari labirint drugačiji
        Q = {};
        stepHistory = [];
        allStepCounts = [];
        drawChart();
        resetStatsDisplay('Status: novi labirint generisan');
    });
}

const showHeatmapEl = getEl('showHeatmap');
if (showHeatmapEl) {
    showHeatmapEl.addEventListener('change', () => {
        drawGrid();
        drawMouseAt(start);
    });
}

function animatePath(path) {
    let i = 0;
    const interval = setInterval(() => {
        drawGrid();
        drawMouseAt(path[i]);
        i++;
        if (i >= path.length) clearInterval(interval);
    }, CONFIG.animationPathDelayMs);
}

// ============================================================
// GENERISANJE NASUMIČNOG LABIRINTA
// ============================================================

function isPathPossible(testWalls) {
    // BFS od starta do cilja - provjerava da li postoji put
    const visited = new Set();
    const queue = [{ ...start }];
    visited.add(key(start.x, start.y));

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.x === goal.x && current.y === goal.y) {
            return true;
        }

        const neighbors = [
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y }
        ];

        for (const n of neighbors) {
            if (
                n.x >= 0 && n.x < CONFIG.gridSize &&
                n.y >= 0 && n.y < CONFIG.gridSize &&
                !testWalls.has(key(n.x, n.y)) &&
                !visited.has(key(n.x, n.y))
            ) {
                visited.add(key(n.x, n.y));
                queue.push(n);
            }
        }
    }

    return false;
}

function generateRandomMaze(wallDensity = CONFIG.wallDensity) {
    let attempts = 0;
    let newWalls;

    do {
        newWalls = new Set();
        for (let x = 0; x < CONFIG.gridSize; x++) {
            for (let y = 0; y < CONFIG.gridSize; y++) {
                // preskoči start i cilj poziciju
                if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y)) {
                    continue;
                }
                if (Math.random() < wallDensity) {
                    newWalls.add(key(x, y));
                }
            }
        }
        attempts++;
    } while (!isPathPossible(newWalls) && attempts < CONFIG.maxMazeGenAttempts);

    if (attempts >= CONFIG.maxMazeGenAttempts) {
        console.warn('Nisam uspio generisati validan labirint, pokušaj ponovo');
        return;
    }

    walls = newWalls;
    drawGrid();
    drawMouseAt(start);
}

// ============================================================
// Q-VALUE HEATMAP
// ============================================================

function getMaxQ(x, y) {
    const k = key(x, y);
    if (!Q[k]) return 0;
    return Math.max(Q[k].up, Q[k].down, Q[k].left, Q[k].right);
}

function valueToColor(value, minVal, maxVal) {
    // normalizuj vrijednost u opseg 0-1
    let ratio = (value - minVal) / (maxVal - minVal + 0.0001);
    ratio = Math.max(0, Math.min(1, ratio));

    // crveno (loše) -> žuto -> zeleno (dobro)
    const r = Math.floor(255 * (1 - ratio));
    const g = Math.floor(255 * ratio);
    const b = 50;

    return `rgba(${r}, ${g}, ${b}, 0.5)`; // 0.5 = providno da se vidi grid
}

function drawHeatmap() {
    if (!ctx) return;
    // pronađi min/max Q vrijednosti trenutno naučene
    let allValues = [];
    for (let x = 0; x < CONFIG.gridSize; x++) {
        for (let y = 0; y < CONFIG.gridSize; y++) {
            if (!walls.has(key(x, y))) {
                allValues.push(getMaxQ(x, y));
            }
        }
    }

    if (allValues.length === 0) return;

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    for (let x = 0; x < CONFIG.gridSize; x++) {
        for (let y = 0; y < CONFIG.gridSize; y++) {
            if (walls.has(key(x, y))) continue; // zidove ne bojimo

            const q = getMaxQ(x, y);
            ctx.fillStyle = valueToColor(q, minVal, maxVal);
            ctx.fillRect(x * CONFIG.cellSize, y * CONFIG.cellSize, CONFIG.cellSize, CONFIG.cellSize);
        }
    }
}