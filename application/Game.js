class Game {
    constructor(boardSize, countOfMines) {
        this.board = new GameBoard(boardSize);
        this.isLose = false;
        this.isWin = false;
        this.normalCells = boardSize * boardSize - countOfMines;
        this.arrNum = this.board.arrNum;
        this.countOfMines = countOfMines;
    }

    generateNumbers() {
        this.board.board.forEach((row, i) => {
            row.forEach((cell, j) => {
                let counter = 0;
                if (!cell.isMine) {
                    [-1, 0, 1].forEach((x) => {
                        [-1, 0, 1].forEach((y) => {
                            if (x === 0 && y === 0) return;
                            if (this.board.board[i + x]?.[j + y]?.isMine) {
                                counter++;
                            }
                        });
                    });
                } else {
                    counter = -1;
                }
                this.arrNum[i][j] = counter;
            });
        });
    }
}
