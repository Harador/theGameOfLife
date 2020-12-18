'use script';
//DOM-элементы
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const startBut = document.getElementById('start');
const stepBut = document.getElementById('step');
const resetBut = document.getElementById('reset');
const generateBut = document.getElementById('generate');
const sizeBut = document.getElementById('size');
const densityBut = document.getElementById('density');
const aboutButton = document.getElementById('aboutButton');
const aboutContent = document.getElementById('aboutContent');
const loopCounter = document.getElementById('loop');
const columnPC = document.getElementById('columnPC');
const speedValue = document.getElementById('speedValue');
const speedInfo = document.getElementById("speed");
const infiniteButton = document.getElementById('infinite');
const canvasColorButton = document.getElementById('canvasColor');
const cellColorButton = document.getElementById('cellColor');

const modal = document.getElementById('modal');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const dencitySelect = document.getElementById('densitySelect');
const frequencyRandomInput = document.getElementById('frequencyRandomInput');
const submitSettings = document.getElementById('submitSettings');
const closeModal = document.getElementById('closeModal');

//конфигурации холста
let canW = 300;
let canH = 450;

if (window.innerWidth > 499) {
    editSize(500, 500)
    columnPC.classList.toggle('deactive');
}

function editSize(w, h) {
    canvas.width = w;
    canvas.height = h;
    canW = w;
    canH = h;
}
let frequencyRandom = 700;
let cellColor = 'green';
let cellSize = 5;
let interval = 50;
let timer;
let isTimer = false;
let wCells = canW / cellSize;
let hCells = canH / cellSize;
let loop = 0;
let matrix = getMatrix();
let isInfinite = false;

//События
cellColorButton.addEventListener('change', function () {
    cellColor = cellColorButton.value;
    drawMatrix();

})
canvasColorButton.addEventListener('change', function () {
    canvas.style.backgroundColor = canvasColorButton.value;
})
infiniteButton.addEventListener('click', infinite);

submitSettings.addEventListener('click', function () {
    if (isTimer || loop > 0) {
        reset();
    }
    let w = widthInput.value;
    let h = heightInput.value;
    editSize(w, h);
    let dencity = dencitySelect.value;
    cellSize = +dencity.split('x')[0];
    wCells = canW / cellSize;
    hCells = canH / cellSize;
    matrix = getMatrix();
    frequencyRandom = frequencyRandomInput.value;
    if (h > 500) {
        modal.style.height = +h + 300 + 'px';
    }

})
widthInput.addEventListener('blur', checkInput);
heightInput.addEventListener('blur', checkInput);

function checkInput() {
    let val = this.value;
    if (val < 100 || val > 2000) {
        this.value = 500;
        return 1;
    }
    if (val % 100) {
        this.value = val - val % 100
    }
}
closeModal.addEventListener('click', function () {
    modal.classList.add('deactive')
})
sizeBut.addEventListener('click', function () {
    modal.classList.remove('deactive');
})
densityBut.addEventListener('click', function () {
    modal.classList.remove('deactive');
})
speedValue.addEventListener('change', function () {
    getSpeed();
    speedValue.onmousemove = getSpeed;
    speedValue.onmouseup = function () {
        speedValue.onmousemove = null;
    }
    speedValue.ontouchmove = getSpeed;
    speedValue.ontouchend = function () {
        speedValue.ontouchmove = null;
    }
})

aboutButton.addEventListener('click', function () {
    aboutContent.classList.toggle('deactive');
    aboutButton.classList.toggle('active');
})
resetBut.addEventListener('click', reset)
canvas.addEventListener('mousedown', function (event) {
    brushPaintCells(event);
    canvas.onmousemove = function (event) {
        brushPaintCells(event);
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
});
canvas.addEventListener('ontouchstart ', function (event) {
    brushPaintCells(event);
    canvas.ontouchmove = function (event) {
        brushPaintCells(event);
    }
    canvas.ontouchend = function () {
        canvas.ontouchmove = null;
    }
});
startBut.addEventListener('click', function () {
    if (!isTimer) {
        Life()
        startBut.innerHTML = 'Пауза';
    } else {
        startBut.innerHTML = 'Продолжить';
        clearTimeout(timer);
        isTimer = false;
    }

});

stepBut.addEventListener('click', function () {
    if (isTimer) {
        clearTimeout(timer);
        isTimer = false;
        startBut.innerHTML = 'Продолжить';
    }
    Life();
    clearTimeout(timer);
    isTimer = false;
})

generateBut.addEventListener('click', function () {
    if (isTimer) {
        reset();
    }
    getRandomMatrix(0.4, 0.8);
    drawMatrix();
    if (loop > 0) {
        loop = 0;
        loopCounter.innerHTML = 'цикл неактивен';
    }
    startBut.innerHTML = 'Старт';
})


//Логика игры и другие функции.
function getSpeed() {
    if (speedValue.value == 100) {
        interval = 1;
        speedInfo.innerHTML = 'Скорость: 100';
    } else if (speedValue.value == 0) {
        interval = 100;
        speedInfo.innerHTML = 'Скорость: 1';
    } else {
        interval = 100 - speedValue.value;
        speedInfo.innerHTML = 'Скорость: ' + (100 - interval);
    }
}
function reset() {
    clearTimeout(timer);
    isTimer = false;
    clearCanvas();
    matrix = getMatrix();
    startBut.innerHTML = "Старт";
    if (loop > 0) {
        loop = 0;
        loopCounter.innerHTML = 'цикл неактивен';
    }
    if (isInfinite) {
        infiniteButton.classList.remove('activeInfinity');
        isInfinite = false;
    }
}
function infinite() {
    if (isInfinite) {
        isInfinite = false;
        infiniteButton.classList.remove('activeInfinity');
    } else {
        infiniteButton.classList.add('activeInfinity');
        if (loop > 0) {
            loop = 0;
            clearTimeout(timer);
        }
        startBut.innerHTML = 'Пауза';
        getRandomMatrix(0.4, 0.7);
        clearCanvas();
        isInfinite = true;
        Life();

    }
}

function getRandomMatrix(min, max) {
    let randomChance;
    do { randomChance = Math.random(); } while (randomChance < min || randomChance > max);
    for (let i = 0; i < hCells; i++) {
        for (let j = 0; j < wCells; j++) {
            if (Math.random() >= randomChance) {
                matrix[i][j] = 1;
            }
        }
    }
}

function Life() {
    let matrix2 = [];
    for (let i = 0; i < hCells; i++) {
        matrix2[i] = [];
        for (let j = 0; j < wCells; j++) {
            let sum = sumNeighbors(matrix, i, j)
            let cell = matrix[i][j]
            if (cell == 1 && (sum < 2 || sum > 3)) {
                matrix2[i][j] = 0;
            } else if (cell == 1 && (sum == 2 || sum == 3)) {
                matrix2[i][j] = 1;
            } else if (cell == 0 && sum == 3) {
                matrix2[i][j] = 1;
            } else {
                matrix2[i][j] = 0;
            }
        }
    }
    loop += 1;
    loopCounter.innerHTML = `${loop} цикл`;
    if (isInfinite) {
        if (loop % frequencyRandom == 0) {
            getRandomMatrix(0.8, 1);
        } else {
            matrix = matrix2;
        }
    } else {
        matrix = matrix2;
    }
    clearCanvas();
    drawMatrix();
    isTimer = true;
    timer = setTimeout(Life, interval);
}


function drawMatrix() {
    for (let i = 0; i < hCells; i++) {
        for (let j = 0; j < wCells; j++) {
            if (matrix[i][j] == 1) {
                drawCell(j * cellSize, i * cellSize)
            }
        }
    }
}

function sumNeighbors(matrix, y, x) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            //формулы замыкают игровое поле
            sum += matrix[(y + i + hCells) % hCells][(x + j + wCells) % wCells];
        }
    }
    return sum -= matrix[y][x];
}

function getMatrix() {
    let matrix = [];
    for (let i = 0; i < hCells; i++) {
        matrix[i] = [];
        for (let j = 0; j < wCells; j++) {
            matrix[i][j] = 0;
        }
    }
    return matrix;
}

function brushPaintCells() {
    let x = Math.floor(event.offsetX / cellSize);
    let y = Math.floor(event.offsetY / cellSize);
    matrix[y][x] = 1;
    drawCell(x * cellSize, y * cellSize);
}

function drawCell(x, y) {
    ctx.fillStyle = cellColor;
    ctx.fillRect(x, y, cellSize, cellSize)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canW, canH);
}


function drawGrid() {
    ctx.lineWidth = '0.3';
    ctx.strokeStyle = cellColor;
    for (let i = cellSize; i < canW; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canH);
        ctx.stroke();
    }
    for (let i = cellSize; i < canH; i += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canW, i);
        ctx.stroke();
    }
}
drawGrid();