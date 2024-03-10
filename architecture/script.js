let game;
const arrNumClass = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
];
const board = document.querySelector('.board');
const gameForm = document.querySelector('.game-form');
const playerStatus = document.querySelector('.player-status');

gameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateFormData(
        document.querySelector('.count-of-mines').value,
        document.querySelector('.field-size').value
    );
});

function validateFormData(countOfMines, fieldSize) {
    if (fieldSize * fieldSize <= countOfMines) {
        document.querySelector(
            '.error-status'
        ).textContent = `Нелогичные настройки (кол-во мин больше (или равно), чем само поле)`;
    } else {
        document.querySelector('.error-status').textContent = ``;
        game = new Game(+fieldSize, +countOfMines);
        board.innerHTML = '';
        generateMines(countOfMines);
        game.generateNumbers();
        render();
    }
}

function render() {
    drawPlayerStatus();
    for (let i = 0; i < game.board.size; i++) {
        const rowCell = document.createElement('div');
        rowCell.className = 'row';
        for (let j = 0; j < game.board.size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'closed');
            rowCell.appendChild(cell);
            cell.addEventListener('click', (e) => {
                validateCell(cell, i, j);
                checkWin();
            });
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                validateFlag(cell, i, j);
                checkWin();
            });
        }
        board.appendChild(rowCell);
    }
}

function validateFlag(cell, row, col) {
    if (!game.isLose && !game.isWin && !game.board.board[row][col].isOpened) {
        if (!game.board.board[row][col].isFlag) {
            game.board.board[row][col].isFlag = true;
            cell.classList.add('flag');
        } else {
            game.board.board[row][col].isFlag = false;
            cell.classList.remove('flag');
        }
    }
}

function validateCell(cell, row, col) {
    if (
        !game.isLose &&
        !game.board.board[row][col].isOpened &&
        !game.board.board[row][col].isFlag
    ) {
        if (game.board.board[row][col].isMine) {
            game.isLose = true;
            cell.classList.add('lose-mine');
            openAllMines();
            drawPlayerStatus();
        } else {
            cell.classList.add('opened', 'was-detected');
            cell.classList.add(arrNumClass[game.arrNum[row][col]]);
            game.board.board[row][col].isOpened = true;
            if (cell.classList.contains('zero')) {
                checkingForEmptiness(row, col);
            }
        }
        cell.classList.remove('closed');
    }
}

function checkingForEmptiness(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            if (game.board.arrNum[row + i]?.[col + j] === 0) {
                if (
                    !document
                        .querySelectorAll('.cell')
                        [
                            game.board.board.length * (row + i) + col + j
                        ].classList.contains('was-detected')
                ) {
                    document
                        .querySelectorAll('.cell')
                        [
                            game.board.board.length * (row + i) + col + j
                        ].classList.add('zero', 'opened', 'was-detected');
                    document
                        .querySelectorAll('.cell')
                        [
                            game.board.board.length * (row + i) + col + j
                        ].classList.remove('closed', 'flag');
                    game.board.board[row + i][col + j].isOpened = true;
                    game.board.board[row + i][col + j].isFlag = false;
                    checkingForEmptiness(row + i, col + j);
                }
            } else if (game.board.arrNum[row + i]?.[col + j]) {
                document
                    .querySelectorAll('.cell')
                    [
                        game.board.board.length * (row + i) + col + j
                    ].classList.add(
                        arrNumClass[game.arrNum[row + i]?.[col + j]],
                        'opened',
                        'was-detected'
                    );
                document
                    .querySelectorAll('.cell')
                    [
                        game.board.board.length * (row + i) + col + j
                    ].classList.remove('closed', 'flag');
                game.board.board[row + i][col + j].isOpened = true;
                game.board.board[row + i][col + j].isFlag = false;
            }
        }
    }
}

function drawPlayerStatus() {
    playerStatus.innerHTML = '';
    if (game.isLose) {
        playerStatus.innerHTML = `Поражение`;
    } else if (game.isWin) {
        playerStatus.innerHTML = `Поздравляю! Вы выиграли!`;
    }
}

function generateMines(countOfMines) {
    for (let i = 0; i < countOfMines; i++) {
        let coordsOfMine = [
            generateValue(game.board.board.length),
            generateValue(game.board.board.length),
        ];
        if (
            game.board.board[coordsOfMine[0]][coordsOfMine[1]].isMine == false
        ) {
            game.board.board[coordsOfMine[0]][coordsOfMine[1]].isMine = true;
        } else {
            coordsOfMine = [
                generateValue(game.board.board.length),
                generateValue(game.board.board.length),
            ];
            i--;
        }
    }
}

function generateValue(size) {
    return Math.floor(Math.random() * size);
}

function openAllMines() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < game.board.board.length; i++) {
        for (let j = 0; j < game.board.board.length; j++) {
            if (
                game.board.board[i][j].isMine &&
                !cells[i * game.board.board.length + j].classList.contains(
                    'lose-mine'
                )
            ) {
                cells[i * game.board.board.length + j].classList.add('mine');
                cells[i * game.board.board.length + j].classList.remove(
                    'closed'
                );
            }
        }
    }
    checkForIncorrectFlags();
}

function checkForIncorrectFlags() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < game.board.board.length; i++) {
        for (let j = 0; j < game.board.board.length; j++) {
            if (
                cells[i * game.board.board.length + j].classList.contains(
                    'flag'
                ) &&
                !game.board.board[i][j].isMine
            ) {
                cells[i * game.board.board.length + j].classList.remove(
                    'flag',
                    'closed'
                );
                cells[i * game.board.board.length + j].classList.add(
                    'incorrect-flag'
                );
            }
        }
    }
}

function checkWin() {
    let counterCells = 0;
    let counterFlags = 0;
    for (let i = 0; i < game.board.board.length; i++) {
        for (let j = 0; j < game.board.board.length; j++) {
            if (
                document
                    .querySelectorAll('.cell')
                    [i * game.board.board.length + j].classList.contains(
                        'was-detected'
                    )
            )
                counterCells++;
            if (
                document
                    .querySelectorAll('.cell')
                    [i * game.board.board.length + j].classList.contains('flag')
            )
                counterFlags++;
        }
    }
    if (
        game.normalCells === counterCells &&
        game.countOfMines === counterFlags
    ) {
        game.isWin = true;
        drawPlayerStatus();
    }
}
