import { Parent, King, Queen, Rook, Bishop, Knight, Pawn } from "../backend/piecesBuilder";
let board: string = "";
const matrix: (Parent | null)[][] = [[], [], [], [], [], [], [], []];

//for unicode values of chess pieces
const piecesPostion: string[][] = [
    ["\u265C", "\u265E", "\u265D", "\u265B", "\u265A", "\u265D", "\u265E", "\u265C"],
    ["\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F", "\u265F"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659", "\u2659"],
    ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2657", "\u2658", "\u2656"]
];

board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled></button>`;

for (let i = 65; i < 73; i++) {
    board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled>${String.fromCharCode(i)}</button>`;
}

board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled></button>`;

let flag: boolean = false;

for (let i = 0; i < 8; i++) {
    board += `<button type="button" class="chess-marks similar" disabled>${8 - i}</button>`;
    flag = !flag
    let flag2: boolean = flag;

    for (let j = 0; j < 8; j++) {
        board += `<button type="button" class="${flag2 ? "bg-light" : "bg-dark"} similar" id = "${i}-${j}">${piecesPostion[i][j]}</button>`;
        flag2 = !flag2;

        matrix[i][j] = getObj(piecesPostion[i][j], i, j);
    }
    board += `<button type="button" class="chess-marks similar" disabled>${8 - i}</button>`;
}

board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled></button>`;

for (let i = 65; i < 73; i++) {
    board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled>${String.fromCharCode(i)}</button>`;
}

board += `<button type="button" class="chess-marks similar top-bottom-marks" disabled></button>`;

function getObj(key: string, r: number, c: number): Parent | null {

    switch (key) {
        case "\u2658": return new Knight(key, true, [r, c]);
        case "\u265E": return new Knight(key, false, [r, c]);
        case "\u265C": return new Rook(key, false, [r, c]);
        case "\u2656": return new Rook(key, true, [r, c]);
        case "\u2657": return new Bishop(key, true, [r, c]);
        case "\u265D": return new Bishop(key, false, [r, c]);
        case "\u265B": return new Queen(key, false, [r, c]);
        case "\u2655": return new Queen(key, true, [r, c]);
        case "\u265F": return new Pawn(key, false, [r, c]);
        case "\u2659": return new Pawn(key, true, [r, c]);
        case "\u265A": return new King(key, false, [r, c]);
        case "\u2654": return new King(key, true, [r, c]);
    }

    return null;
}

export { board, matrix };

