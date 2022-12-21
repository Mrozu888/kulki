import { lineLength, size, pathColor, cellColor } from "./Data"
import { Cell } from "./Cell"
import { Ball } from "./Ball"

/** root HTML object where table is created */
const root: HTMLDivElement = document.getElementById("root") as HTMLDivElement;
/** nextBalls HTML object which shows three next balls  */
const nextBallsElement: HTMLDivElement = document.getElementById("nextBalls") as HTMLDivElement;
/**
 * board objact contains virtual array of Cells 
 * 
 * need to init new Board to create 
 */
export class Board {
    /** array of cells which will be generated later*/
    public array: Array<Array<Cell>> = [[]]
    /** size of an array */
    public size: number
    /** variable to save id of clicked started cell */
    public startCellId: string = ""
    /** variable for throwing out balls */
    private ballsArr: Array<string> = []
    /** variable for temporary saving balls' id */
    private tempBallsArr: Array<string> = []
    /** score sum */
    private sum: number = 0
    /** game score */
    public score: number = 0
    /**
     * The constructor of Board
     * 
     * @param boardSize setting the size of an array
     */
    constructor(boardSize: number) {
        this.size = boardSize
        this.generateArray()
        this.generateTable()
        this.generateBalls(3)
        this.drawBalls()
    }

    /** function that's generates array of Cells */
    generateArray() {
        for (let y = 0; y < this.size; y++) {
            this.array[y] = []
            for (let x = 0; x < this.size; x++) this.array[y][x] = new Cell(x, y);
        }
    }

    /** function that's generates HTMLs table */
    generateTable() {
        document.querySelector("table")?.remove()
        let table: HTMLTableElement;
        let tBody: HTMLTableSectionElement;
        table = document.createElement('table')
        tBody = table.createTBody();
        for (let y = 0; y < this.array.length; y++) {
            let row: HTMLTableRowElement = table.insertRow();
            for (let x = 0; x < this.array[y].length; x++) {
                let cell: HTMLTableCellElement = row.insertCell();
                this.array[y][x].setHTMLCellElement(cell)
            }
        }
        root.appendChild(table)
    }

    /** function that's generates first three balls in the array */
    generateBalls(n: number) {
        let randomX: number
        let randomY: number
        for (let i = 0; i < n; i++) {
            while (true) {
                randomX = Math.floor(Math.random() * this.size)
                randomY = Math.floor(Math.random() * this.size)
                if (this.array[randomY][randomX].value == '') {
                    this.array[randomY][randomX].value = 'X'
                    this.array[randomY][randomX].HTMLCellElement.appendChild(new Ball().HTMLBallElement)
                    break
                }
            }
        }
    }

    /** functions that's creating three next balls */
    drawBalls() {
        for (let i = 0; i < 3; i++) nextBallsElement.appendChild(new Ball().HTMLBallElement)
    }

    /** function that's inserting three drawed balls*/
    insertNextBalls() {
        let emptyCells: number = 0
        this.array.forEach(row => row.forEach(el => {
            if (el.value == "") emptyCells++
        }))
        if (emptyCells > 2) {
            for (let i = 0; i < 3; i++) {
                let randomX: number
                let randomY: number
                while (true) {
                    randomX = Math.floor(Math.random() * this.size)
                    randomY = Math.floor(Math.random() * this.size)
                    if (this.array[randomY][randomX].value == '') {
                        this.array[randomY][randomX].value = 'X'
                        this.array[randomY][randomX].HTMLCellElement.appendChild(nextBallsElement.children[0])
                        break
                    }
                }
            }
            this.drawBalls()
        }

    }

    /** funtion that's sets the id of starting cell */
    setStartCellId(id: string) { this.startCellId = id }

    removeCellsListneres() {
        this.array.forEach(row => row.forEach(el => {
            el.HTMLCellElement.onclick = () => ""
            el.HTMLCellElement.onmousemove = () => ""
        }))
    }

    /** funtion that's starts to find the path to selected cell */
    findPath() {
        let x: number = parseInt(this.startCellId[0])
        let y: number = parseInt(this.startCellId[2])
        this.array.forEach(row => row.forEach(el => {
            el.move = size * size
        }))
        this.findNextPath(x, y, 0)
    }

    /**
     * function that's searches the path
     * 
     * @param x x index of an array
     * @param y y index of an array
     * @param num number of step from start cell
     */
    findNextPath(x: number, y: number, num: number) {
        let cell = this.array[y][x]
        if (cell.value != "X" && cell.move > num) {
            cell.move = num
            if (cell.value == "F") {
                cell.HTMLCellElement.style.backgroundColor = pathColor
                this.array.forEach(row => row.forEach(el => {
                    // if (el.id == this.startCellId) el.HTMLCellElement.style.backgroundColor = pathColor
                    if (el.value == "S" || el.id == this.startCellId) el.HTMLCellElement.style.backgroundColor = pathColor
                    else el.HTMLCellElement.style.backgroundColor = cellColor
                }))
                this.checkPath(x, y, num)
            }
            else {
                if (x < this.size - 1) this.findNextPath(x + 1, y, num + 1)
                if (x > 0) this.findNextPath(x - 1, y, num + 1)
                if (y < this.size - 1) this.findNextPath(x, y + 1, num + 1)
                if (y > 0) this.findNextPath(x, y - 1, num + 1)
            }
        }
    }

    /**
     * function that's checking cells around to find the path
     * 
     * @param x x index of an array
     * @param y y index of an array
     * @param num number of step from start cell
     * @returns to finish the function
     */
    checkPath(x: number, y: number, num: number) {
        if (this.array[y - 1]?.[x] != undefined) {
            if (this.array[y - 1][x].move < num && this.array[y - 1][x].value != "X") {
                this.checkPath(x, y - 1, this.array[y - 1][x].move)
                this.array[y][x].HTMLCellElement.style.backgroundColor = pathColor
                return ""
            }
        }
        if (this.array[y + 1]?.[x] != undefined) {
            if (this.array[y + 1][x].move < num && this.array[y + 1][x].value != "X") {
                this.checkPath(x, y + 1, this.array[y + 1][x].move)
                this.array[y][x].HTMLCellElement.style.backgroundColor = pathColor
                return ""
            }
        }
        if (this.array[y]?.[x - 1] != undefined) {
            if (this.array[y][x - 1].move < num && this.array[y][x - 1].value != "X") {
                this.checkPath(x - 1, y, this.array[y][x - 1].move)
                this.array[y][x].HTMLCellElement.style.backgroundColor = pathColor
                return ""
            }
        }
        if (this.array[y]?.[x + 1] != undefined) {
            if (this.array[y][x + 1].move < num && this.array[y][x + 1].value != "X") {
                this.checkPath(x + 1, y, this.array[y][x + 1].move)
                this.array[y][x].HTMLCellElement.style.backgroundColor = pathColor
                return ""
            }
        }
    }
    /** checking if there is the ball */
    checkBalls() {
        this.array.forEach(row => row.forEach(el => {
            if (el.HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = el.HTMLCellElement.children[0] as HTMLDivElement
                this.checkColorsAround(parseInt(el.id[0]), parseInt(el.id[2]), child.style.backgroundColor)
            }
        }))
        if (this.ballsArr.length >= lineLength) {
            this.ballsArr.forEach(el => {
                if (this.array[parseInt(el[2])][parseInt(el[0])].HTMLCellElement.children.length > 0)
                    this.array[parseInt(el[2])][parseInt(el[0])].HTMLCellElement.children[0].remove()
                this.array[parseInt(el[2])][parseInt(el[0])].value = ""
            });
            this.score += this.ballsArr.length
            this.ballsArr = []
            return true
        }
        this.score += this.ballsArr.length
        this.ballsArr = []
        return false
    }
    /**
     * checking if declared color around the ball
     * 
     * @param x x index of an array
     * @param y y index of an array
     * @param color color of the balls
     */
    checkColorsAround(x: number, y: number, color: string) {
        let first: number = x - 1
        let second: number = y + 1
        if (first >= 0 && first < size && second >= 0 && second < size) {
            if (this.array[second][first].HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = this.array[second][first].HTMLCellElement.children[0] as HTMLDivElement
                if (child.style.backgroundColor == color) {

                    this.tempBallsArr.push(x + "_" + y)
                    this.checkColorDir(x, y, -1, 1, color)
                    if (this.tempBallsArr.length >= lineLength) {
                        this.tempBallsArr.forEach(element => {
                            if (this.ballsArr.indexOf(element) < 0) this.ballsArr.push(element)
                        });

                    }
                    this.tempBallsArr = []
                }
            }
        }
        first = x + 1
        second = y
        if (first >= 0 && first < size && second >= 0 && second < size) {
            if (this.array[second][first].HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = this.array[second][first].HTMLCellElement.children[0] as HTMLDivElement
                if (child.style.backgroundColor == color) {

                    this.tempBallsArr.push(x + "_" + y)
                    this.checkColorDir(x, y, 1, 0, color)
                    if (this.tempBallsArr.length >= lineLength) {
                        this.tempBallsArr.forEach(element => {
                            if (this.ballsArr.indexOf(element) < 0) this.ballsArr.push(element)
                        });
                    }
                    this.tempBallsArr = []
                }
            }
        }
        first = x + 1
        second = y + 1
        if (first >= 0 && first < size && second >= 0 && second < size) {
            if (this.array[second][first].HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = this.array[second][first].HTMLCellElement.children[0] as HTMLDivElement
                if (child.style.backgroundColor == color) {

                    this.tempBallsArr.push(x + "_" + y)
                    this.checkColorDir(x, y, 1, 1, color)
                    if (this.tempBallsArr.length >= lineLength) {
                        this.tempBallsArr.forEach(element => {
                            if (this.ballsArr.indexOf(element) < 0) this.ballsArr.push(element)
                        });

                    }
                    this.tempBallsArr = []
                }
            }
        }
        first = x
        second = y + 1
        if (first >= 0 && first < size && second >= 0 && second < size) {
            if (this.array[second][first].HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = this.array[second][first].HTMLCellElement.children[0] as HTMLDivElement
                if (child.style.backgroundColor == color) {

                    this.tempBallsArr.push(x + "_" + y)
                    this.checkColorDir(x, y, 0, 1, color)
                    if (this.tempBallsArr.length >= lineLength) {
                        this.tempBallsArr.forEach(element => {
                            if (this.ballsArr.indexOf(element) < 0) this.ballsArr.push(element)
                        });

                    }
                    this.tempBallsArr = []
                }
            }
        }


    }
    /**
     * checking if declared number of balls is in row
     * 
     * @param x x index of an array
     * @param y y index of an array
     * @param i horizontal move
     * @param j vertical move
     * @param color color of the balls
     * @returns number of same color in row
     */
    checkColorDir(x: number, y: number, i: number, j: number, color: string): number {
        let first: number = x + i
        let second: number = y + j
        if (first >= 0 && first < size && second >= 0 && second < size) {
            if (this.array[second][first].HTMLCellElement.children.length > 0) {
                let child: HTMLDivElement = this.array[second][first].HTMLCellElement.children[0] as HTMLDivElement
                if (child.style.backgroundColor == color) {
                    this.tempBallsArr.push(first + "_" + second)
                    return 1 + this.checkColorDir(first, second, i, j, color)
                }
                else return 0
            }
            else return 0
        }
        else return 0
    }
    /** function that's updating the score board */
    updateScore() {
        const scoreBoard: HTMLHeadElement = document.getElementById("scoreBoard")
        scoreBoard.innerHTML = "Wynik: " + this.score
    }
    /** ending the game if there is no more free space */
    endGame() {
        let emptyCells: number = 0
        this.array.forEach(row => row.forEach(el => {
            if (el.value == "") emptyCells++
        }))
        if (emptyCells == 0) {
            this.removeCellsListneres()
            alert("Twój wynik: " + this.score)
        }
    }
}
/** declaring the board */
export const board = new Board(size)