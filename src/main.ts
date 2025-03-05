import { Parent, shadowPawn } from "./backend/piecesBuilder";
import { board, matrix } from "./frontend/main";
const pathSet: Set<string> = new Set<string>();
const enPassantSet: Set<string> = new Set<string>();

const mainBoard = document.getElementById("mainBoard") as HTMLDivElement;
mainBoard.innerHTML = board;
let preId: string = "";
let player1: number = 0;
let player2: number = 0;

//valid turn or not checking using boolean value (true for white and false for black)
let turn: boolean = true;

mainBoard.addEventListener("click", (event) => {
    const targetedCell = event.target as HTMLButtonElement;

    console.log(player1, player2);
    console.log(matrix);

    if (targetedCell) {
        let id: string | null = targetedCell.getAttribute("id");

        //this is the first click after selecting
        if (!preId && id && targetedCell.innerText && isValidTurn(id)) {
            const position: string[] = id.split("-");
            highlightPath(Number(position[0]), Number(position[1]));
            preId = id;
            return;
        }

        //this is second click and valid path taken step
        if (preId && id && pathSet.has(id)) {
            removePath();
            setValues(id, preId);
            preId = "";
            turn = !turn;
            return;
        }

        //this is second but not valid path
        if (preId) {
            removePath();
            preId = "";
            targetedCell.click();
        }

    }
});

//this function checks valid team taking turn or not
function isValidTurn(id: string): boolean {
    const currPos: string[] = id.split("-");
    let piece: Parent | null = matrix[Number(currPos[0])][Number(currPos[1])];

    if (piece) {
        return piece.team == turn;
    }

    return false;
}

//this function will set current postion of piece in matrix and UI also
function setValues(nextId: string, currId: string): void {
    const currPos: string[] = currId.split("-");
    const nextPos: string[] = nextId.split("-");

    setAndCalculate(Number(currPos[0]), Number(currPos[1]), Number(nextPos[0]), Number(nextPos[1]));

    const nextPostionEle = document.getElementById(nextId) as HTMLButtonElement;
    const prePostionEle = document.getElementById(currId) as HTMLButtonElement;

    nextPostionEle.innerHTML = prePostionEle.innerHTML;
    prePostionEle.innerHTML = "";
}

function setAndCalculate(currRow: number, currCol: number, nextRow: number, nextCol: number): void {
    //calculation part
    if (matrix[nextRow][nextCol] && matrix[nextRow][nextCol].name != "ShadowPawn") {
        if (turn) {
            player1 += matrix[nextRow][nextCol].points;
        } else {
            player2 += matrix[nextRow][nextCol].points;
        }
    }

    if (matrix[currRow][currCol]?.name == "Pawn") {
        handleEnPassant(currRow, currCol, nextRow, nextCol);
    }

    matrix[nextRow][nextCol] = matrix[currRow][currCol];
    matrix[nextRow][nextCol]?.setPosition(nextRow, nextCol);
    matrix[currRow][currCol] = null;
}

//en passant rule handling
function handleEnPassant(currRow: number, currCol: number, nextRow: number, nextCol: number): void {

    if (matrix[nextRow][nextCol]?.name == "ShadowPawn") {

        if (turn) {
            player1 += matrix[nextRow][nextCol].points;
        } else {
            player2 += matrix[nextRow][nextCol].points;
        }

        let r: number = nextRow == 2 ? 3 : 4;
        matrix[r][nextCol] = null;
        const btn = document.getElementById(`${r}-${nextCol}`) as HTMLButtonElement;
        btn.innerHTML = "";
    }

    if (Math.abs(nextRow - currRow) == 2) {
        let tempTeam: boolean | undefined = matrix[currRow][currCol]?.team;

        if (tempTeam != undefined) {
            let r: number = nextRow == 3 ? 2 : 5;
            matrix[r][nextCol] = new shadowPawn("ShadowPawn", tempTeam, [r, nextCol]);
            enPassantSet.add(`${r}-${nextCol}`);
        }
    }


    enPassantSet.forEach((val) => {

        let coordinates: string[] = val.split("-");
        let r: number = Number(coordinates[0]);
        let c: number = Number(coordinates[1]);

        if (r == 2 && (c - 1 >= 0 && (matrix[3][c - 1]?.name != "Pawn" || matrix[3][c - 1]?.team == matrix[r][c]?.team)) && (c + 1 < 8 && (matrix[3][c + 1]?.name != "Pawn" || matrix[3][c + 1]?.team == matrix[r][c]?.team))) {
            console.log("visited1");
            matrix[r][c] = null;
            enPassantSet.delete(val);
        }

        else if (r == 5 && (c - 1 >= 0 && (matrix[4][c - 1]?.name != "Pawn" || matrix[4][c - 1]?.team == matrix[r][c]?.team)) && (c + 1 < 8 && (matrix[4][c + 1]?.name != "Pawn" || matrix[4][c + 1]?.team == matrix[r][c]?.team))) {
            console.log("visited2");
            matrix[r][c] = null;
            enPassantSet.delete(val);
        }
    });
}
//This function highlights the current selected piece path
function highlightPath(r: number, c: number): void {
    let piece = matrix[r][c];

    if (piece) {
        const moves = piece.getMoves(matrix);

        for (let arr of moves) {
            pathSet.add(`${arr[0]}-${arr[1]}`);
            const path = document.getElementById(`${arr[0]}-${arr[1]}`) as HTMLButtonElement;

            if (path.innerHTML) {
                path.classList.add("redMark");
            } else {
                path.innerHTML = "&#9679";
                path.classList.add("path");
            }
        }
    }
}

//this function removes highligted path from board
function removePath() {

    pathSet.forEach((val) => {

        const btn = document.getElementById(val) as HTMLButtonElement;
        const pos: string[] = val.split("-");

        if (!matrix[Number(pos[0])][Number(pos[1])] || matrix[Number(pos[0])][Number(pos[1])]?.name == "ShadowPawn") {
            btn.innerHTML = "";
            btn.classList.remove("path");
        } else {
            btn.classList.remove("redMark");
            btn.classList.remove("path");
        }
    });
    pathSet.clear();
}