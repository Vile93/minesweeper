class GameBoard {
    constructor(size) {
        this.size = size;
        this.board = Array(size)
            .fill()
            .map(() => Array(size).fill())
            .map((row) => row.map(() => new Cell()));
        this.arrNum = Array(size)
            .fill()
            .map(() => Array(size).fill())
            .map((row) => row.map(() => null));
    }
}
