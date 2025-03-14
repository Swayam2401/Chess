import { Parent, shadowPawn } from "./backend/piecesBuilder";
import { board, matrix } from "./frontend/main";
const pathSet: Set<string> = new Set<string>();
const enPassant: number[] = [-1, -1];

const mainBoard = document.getElementById("mainBoard") as HTMLDivElement;
const palyer1Box = document.getElementById("player1-box") as HTMLDivElement;
const palyer2Box = document.getElementById("player2-box") as HTMLDivElement;
const palyer1Points = document.getElementById("player1-points") as HTMLSpanElement;
const palyer2Points = document.getElementById("player2-points") as HTMLSpanElement;


mainBoard.innerHTML = board;
let preId: string = "";
let player1: number = 0;
let player2: number = 0;

palyer1Points.innerText = "0";
palyer2Points.innerText = "0";

//valid turn or not checking using boolean value (true for white and false for black)
let turn: boolean = true;

mainBoard.addEventListener("click", (event) => {
    const targetedCell = event.target as HTMLButtonElement;

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
            highLightTurn();
            palyer1Points.innerText = player1 + "";
            palyer2Points.innerText = player2 + "";
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
}

function setAndCalculate(currRow: number, currCol: number, nextRow: number, nextCol: number): void {

    //this will remove previous enPassant before calculation of points
    if (matrix[currRow][currCol]?.name != "Pawn") {
        removeEnpassant();
    }

    //this will include points in team wise
    if (matrix[nextRow][nextCol]) {
        if (turn) {
            player1 += matrix[nextRow][nextCol].points;
        } else {
            player2 += matrix[nextRow][nextCol].points;
        }
    }

    //this condition will handle pawn rules like enPassant
    if (matrix[currRow][currCol]?.name == "Pawn") {
        handleEnPassant(currRow, currCol, nextRow, nextCol);
    }

    //this will update backend as well as frontend
    matrix[currRow][currCol]?.updatePostion(matrix, nextRow, nextCol);
}

//en passant rule handling
function handleEnPassant(currRow: number, currCol: number, nextRow: number, nextCol: number): void {

    // This condition for removing actual Pawn of shadowPawn 
    if (matrix[nextRow][nextCol]?.name == "ShadowPawn") {
        let r: number = nextRow == 2 ? 3 : 4;
        matrix[r][nextCol] = null;
        const btn = document.getElementById(`${r}-${nextCol}`) as HTMLButtonElement;
        btn.innerHTML = "";
    }

    //this will remove postion of previous shadowPawn or enPassant
    removeEnpassant();

    //this condition will create new enPassant
    if (Math.abs(nextRow - currRow) == 2) {
        let tempTeam: boolean | undefined = matrix[currRow][currCol]?.team;

        if (tempTeam != undefined) {
            let r: number = nextRow == 3 ? 2 : 5;
            matrix[r][nextCol] = new shadowPawn("ShadowPawn", tempTeam, [r, nextCol]);
            enPassant[0] = r;
            enPassant[1] = nextCol;
        }
    }
}

//Handling enPassant
function removeEnpassant(): void {
    if (enPassant[0] != -1) {
        matrix[enPassant[0]][enPassant[1]] = matrix[enPassant[0]][enPassant[1]]?.name == "ShadowPawn" ? null : matrix[enPassant[0]][enPassant[1]];
        enPassant[0] = enPassant[1] = -1;
    }
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

// for knowing whoes turn white or black
function highLightTurn(): void {
    if (turn) {
        palyer2Box.classList.remove("highLightTurn");
        palyer1Box.classList.add("highLightTurn");
        return;
    }

    palyer1Box.classList.remove("highLightTurn");
    palyer2Box.classList.add("highLightTurn");
}