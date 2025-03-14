
export abstract class Parent {

    public moves: number[][];
    public points: number;

    constructor(
        readonly name: string,
        public team: boolean,
        public position: number[],
    ) {
        this.name = name;
        this.points = -1;
        this.team = team;
        this.position[0] = position[0];
        this.position[1] = position[1];
        this.moves = [];
    }

    public getMoves(matrix: (Parent | null)[][]): number[][] {
        return [];
    }

    protected isValidMove(r: number, c: number, matrix: (Parent | null)[][]) {
        return r >= 0 && r < 8 && c >= 0 && c < 8 && (matrix[r][c]?.name == "ShadowPawn" || !matrix[r][c] || matrix[r][c].team != this.team);
    }

    public updatePostion(matrix: (Parent | null)[][], nextRow: number, nextCol: number): void {
        let currRow: number = this.position[0];
        let currCol: number = this.position[1];

        matrix[nextRow][nextCol] = matrix[currRow][currCol];
        matrix[currRow][currCol] = null;

        this.position[0] = nextRow;
        this.position[1] = nextCol;

        const nextPostionEle = document.getElementById(`${nextRow}-${nextCol}`) as HTMLButtonElement;
        const prePostionEle = document.getElementById(`${currRow}-${currCol}`) as HTMLButtonElement;

        nextPostionEle.innerHTML = prePostionEle.innerHTML;
        prePostionEle.innerHTML = "";
    }
}

//King class implementation
export class King extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = Infinity;
        this.moves = [];
    }

    public override getMoves(matrix: (Parent | null)[][]): number[][] {
        const tempMoves: number[][] = [[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]];
        let result: number[][] = [];

        for (let arr of tempMoves) {
            if (this.isValidMove(this.position[0] + arr[0], this.position[1] + arr[1], matrix)) {
                result.push([this.position[0] + arr[0], this.position[1] + arr[1]]);
            }
        }

        return result;
    }


}

//Knight class implementation
export class Knight extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 3;
        this.moves = [];
    }

    public override getMoves(matrix: (Parent | null)[][]): number[][] {
        const tempMoves: number[][] = [[-2, -1], [-1, -2], [-2, 1], [-1, 2], [2, -1], [2, 1], [1, -2], [1, 2]];
        let result: number[][] = [];

        for (let arr of tempMoves) {
            if (this.isValidMove(this.position[0] + arr[0], this.position[1] + arr[1], matrix)) {
                result.push([this.position[0] + arr[0], this.position[1] + arr[1]]);
            }
        }

        return result;
    }


}

//Queen
export class Queen extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 9;
        this.moves = [];
    }

    public override getMoves(matrix: (Parent | null)[][]): number[][] {
        let result: number[][] = [];

        //-x axis
        for (let i = this.position[1] - 1; i >= 0; i--) {
            if (this.isValidMove(this.position[0], i, matrix)) {
                result.push([this.position[0], i]);
            } else {
                break;
            }

            if (matrix[this.position[0]][i] && matrix[this.position[0]][i]?.name != "ShadowPawn" && matrix[this.position[0]][i]?.team != this.team) {
                break;
            }
        }

        //+y axis
        for (let i = this.position[0] - 1; i >= 0; i--) {
            if (this.isValidMove(i, this.position[1], matrix)) {
                result.push([i, this.position[1]]);
            } else {
                break;
            }

            if (matrix[i][this.position[1]] && matrix[i][this.position[1]]?.name != "ShadowPawn" && matrix[i][this.position[1]]?.team != this.team) {
                break;
            }
        }

        //+x axis
        for (let i = this.position[1] + 1; i < 8; i++) {
            if (this.isValidMove(this.position[0], i, matrix)) {
                result.push([this.position[0], i]);
            } else {
                break;
            }

            if (matrix[this.position[0]][i] && matrix[this.position[0]][i]?.name != "ShadowPawn" && matrix[this.position[0]][i]?.team != this.team) {
                break;
            }
        }

        //-y axis
        for (let i = this.position[0] + 1; i < 8; i++) {
            if (this.isValidMove(i, this.position[1], matrix)) {
                result.push([i, this.position[1]]);
            } else {
                break;
            }


            if (matrix[i][this.position[1]] && matrix[i][this.position[1]]?.name != "ShadowPawn" && matrix[i][this.position[1]]?.team != this.team) {
                break;
            }
        }

        //-x-y axis
        for (let i = this.position[0] - 1, j = this.position[1] - 1; i >= 0 && j >= 0; i--, j--) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }


            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x-y axis
        for (let i = this.position[0] - 1, j = this.position[1] + 1; i >= 0 && j < 8; i--, j++) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x+y axis
        for (let i = this.position[0] + 1, j = this.position[1] + 1; i < 8 && j < 8; i++, j++) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x-y axis
        for (let i = this.position[0] + 1, j = this.position[1] - 1; i < 8 && j >= 0; i++, j--) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        return result;
    }
}

//Rook
export class Rook extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 5;
        this.moves = [];
    }

    public override getMoves(matrix: (Parent | null)[][]): number[][] {
        let result: number[][] = [];

        //-x axis
        for (let i = this.position[1] - 1; i >= 0; i--) {
            if (this.isValidMove(this.position[0], i, matrix)) {
                result.push([this.position[0], i]);
            } else {
                break;
            }

            if (matrix[this.position[0]][i] && matrix[this.position[0]][i]?.name != "ShadowPawn" && matrix[this.position[0]][i]?.team != this.team) {
                break;
            }
        }

        //+y axis
        for (let i = this.position[0] - 1; i >= 0; i--) {
            if (this.isValidMove(i, this.position[1], matrix)) {
                result.push([i, this.position[1]]);
            } else {
                break;
            }

            if (matrix[i][this.position[1]] && matrix[i][this.position[1]]?.name != "ShadowPawn" && matrix[i][this.position[1]]?.team != this.team) {
                break;
            }
        }

        //+x axis
        for (let i = this.position[1] + 1; i < 8; i++) {
            if (this.isValidMove(this.position[0], i, matrix)) {
                result.push([this.position[0], i]);
            } else {
                break;
            }

            if (matrix[this.position[0]][i] && matrix[this.position[0]][i]?.name != "ShadowPawn" && matrix[this.position[0]][i]?.team != this.team) {
                break;
            }
        }

        //-y axis
        for (let i = this.position[0] + 1; i < 8; i++) {
            if (this.isValidMove(i, this.position[1], matrix)) {
                result.push([i, this.position[1]]);
            } else {
                break;
            }


            if (matrix[i][this.position[1]] && matrix[i][this.position[1]]?.name != "ShadowPawn" && matrix[i][this.position[1]]?.team != this.team) {
                break;
            }
        }


        return result;
    }
}

//Bishop implementation
export class Bishop extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 3;
        this.moves = [];
    }

    public override getMoves(matrix: (Parent | null)[][]): number[][] {
        let result: number[][] = [];

        //-x-y axis
        for (let i = this.position[0] - 1, j = this.position[1] - 1; i >= 0 && j >= 0; i--, j--) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }


            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x-y axis
        for (let i = this.position[0] - 1, j = this.position[1] + 1; i >= 0 && j < 8; i--, j++) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x+y axis
        for (let i = this.position[0] + 1, j = this.position[1] + 1; i < 8 && j < 8; i++, j++) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        //+x-y axis
        for (let i = this.position[0] + 1, j = this.position[1] - 1; i < 8 && j >= 0; i++, j--) {
            if (this.isValidMove(i, j, matrix)) {
                result.push([i, j]);
            } else {
                break;
            }

            if (matrix[i][j] && matrix[i][j]?.name != "ShadowPawn" && matrix[i][j]?.team != this.team) {
                break;
            }
        }

        return result;
    }


}

//Pawn implementation
export class Pawn extends Parent {

    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 1;
        this.moves = [];
    }

    public override getMoves(matrix: Parent[][]): number[][] {
        let result: number[][] = [];

        if (this.team) {
            if (this.position[0] - 1 >= 0 && !matrix[this.position[0] - 1][this.position[1]]) {
                result.push([this.position[0] - 1, this.position[1]]);

                if (this.position[0] == 6 && this.position[0] - 2 >= 0 && !matrix[this.position[0] - 2][this.position[1]]) {
                    result.push([this.position[0] - 2, this.position[1]]);
                }
            }

            if (this.position[0] - 1 >= 0 && this.position[1] + 1 < 8 && matrix[this.position[0] - 1][this.position[1] + 1] && matrix[this.position[0] - 1][this.position[1] + 1].team != this.team) {
                result.push([this.position[0] - 1, this.position[1] + 1]);
            }

            if (this.position[0] - 1 >= 0 && this.position[1] - 1 >= 0 && matrix[this.position[0] - 1][this.position[1] - 1] && matrix[this.position[0] - 1][this.position[1] - 1].team != this.team) {
                result.push([this.position[0] - 1, this.position[1] - 1]);
            }

        } else {
            if (this.position[0] + 1 < 8 && !matrix[this.position[0] + 1][this.position[1]]) {
                result.push([this.position[0] + 1, this.position[1]]);

                if (this.position[0] == 1 && this.position[0] + 2 < 8 && !matrix[this.position[0] + 2][this.position[1]]) {
                    result.push([this.position[0] + 2, this.position[1]]);
                }
            }

            if (this.position[0] + 1 < 8 && this.position[1] + 1 < 8 && matrix[this.position[0] + 1][this.position[1] + 1] && matrix[this.position[0] + 1][this.position[1] + 1].team != this.team) {
                result.push([this.position[0] + 1, this.position[1] + 1]);
            }

            if (this.position[0] + 1 < 8 && this.position[1] - 1 >= 0 && matrix[this.position[0] + 1][this.position[1] - 1] && matrix[this.position[0] + 1][this.position[1] - 1].team != this.team) {
                result.push([this.position[0] + 1, this.position[1] - 1]);
            }
        }

        return result;
    }


}

export class shadowPawn extends Parent {
    constructor(
        name: string,
        team: boolean,
        position: number[],
    ) {
        super(name, team, position);
        this.points = 1;
        this.moves = [];
    }
}