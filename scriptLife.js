'use script';
//DOM-элементы
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const startBut = document.getElementById('start');
const stepBut = document.getElementById('step');
const resetBut = document.getElementById('reset');
const generateBut = document.getElementById('generate');
const sizeBut = document.getElementById('size');
const densityBut = document.getElementById('cellSize');
const aboutButton = document.getElementById('aboutButton');
const aboutContent = document.getElementById('aboutContent');

//Глобальные параметры
let canW = 300;
let canH = 450;
let cellSize = 15;
let interval = 40;
let timer;
let wCells = canW / cellSize;
let hCells = canH / cellSize;

let matrix = getMatrix();

//События
aboutButton.addEventListener('click', function () {
    aboutContent.classList.toggle('deactive');
    aboutButton.classList.toggle('active');
})
resetBut.addEventListener('click', function () {
    clearCanvas();
    matrix = getMatrix();
    //ДОБАВИТЬ ОСТАНОВКУ ЦИКЛА
})
canvas.addEventListener('mousedown', function (event) {
    brushPaintCells(event);
    canvas.onmousemove = function (event) {
        brushPaintCells(event);
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
});

//Логика игры
function Life() {
    let matrix2 = [];
    for (let i = 0; i < hCells; i++) {
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
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, cellSize, cellSize)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canW, canH);
}


function drawGrid() {
    ctx.lineWidth = '0.3';
    ctx.strokeStyle = 'green';
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
