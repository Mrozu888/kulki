import { board } from "./Board"
import { selectedColor, pathColor, cellColor, size } from "./Data";

/**
 *  class of a cell in board
 */
export class Cell {
    /** cell value */
    public value: string
    /** move value, used to search the shortest path */
    public move: number = size * size
    /** id of cell [x_y] */
    public id: string
    /** HTML div od cell in variable */
    public HTMLCellElement: HTMLTableCellElement
    /**
     *  creating a cell
     * 
     * @param x index of an array
     * @param y index of an array
     */
    constructor(x: number, y: number) {
        this.value = ""
        this.id = x + "_" + y
    }
    /**
     * setting the HTML div to variable
     * 
     * @param element DOM element
     */
    public setHTMLCellElement(element: HTMLTableCellElement) {
        this.HTMLCellElement = element
        this.HTMLCellElement.onclick = () => this.changeValueClick()
        this.HTMLCellElement.onmousemove = () => this.changeValueMousemove()
    }
    /** onclick actions */
    private changeValueClick() {
        let x: number = parseInt(this.id[0])
        let y: number = parseInt(this.id[2])
        let temp: number = 0
        if (x >= 0 && x < size && y - 1 >= 0 && y - 1 < size)
            if (board.array[y - 1][x].HTMLCellElement.children.length == 0) temp++
        if (x >= 0 && x < size && y + 1 >= 0 && y + 1 < size)
            if (board.array[y + 1][x].HTMLCellElement.children.length == 0) temp++
        if (x - 1 >= 0 && x - 1 < size && y >= 0 && y < size)
            if (board.array[y][x - 1].HTMLCellElement.children.length == 0) temp++
        if (x + 1 >= 0 && x + 1 < size && y >= 0 && y < size)
            if (board.array[y][x + 1].HTMLCellElement.children.length == 0) temp++

        if (temp > 0 || this.value == "F") {
            if (this.value == "X") {
                board.array.forEach(row => row.forEach(el => {
                    el.HTMLCellElement.style.backgroundColor = cellColor
                }))
                if (board.startCellId != "") board.array[parseInt(board.startCellId[2])][parseInt(board.startCellId[0])].value = "X"
                this.value = "S"
                this.HTMLCellElement.style.backgroundColor = pathColor
                this.HTMLCellElement.style.width = "45px"
                this.HTMLCellElement.style.height = "45px"
                board.setStartCellId(this.id)
            }
            else if (board.startCellId == this.id) {
                this.value = "X"
                board.array.forEach(row => row.forEach(el => {
                    el.HTMLCellElement.style.backgroundColor = cellColor
                }))
                board.setStartCellId("")
            }
            else if (this.value == "F" && this.HTMLCellElement.style.backgroundColor == pathColor) {
                board.removeCellsListneres()
                board.array.forEach(row => row.forEach(el => {
                    if (el.HTMLCellElement.style.backgroundColor == pathColor) el.HTMLCellElement.style.backgroundColor = selectedColor
                }))
                setTimeout(() => {
                    this.value = "X";
                    this.HTMLCellElement.appendChild(board.array[parseInt(board.startCellId[2])][parseInt(board.startCellId[0])].HTMLCellElement.children[0])
                    board.array[parseInt(board.startCellId[2])][parseInt(board.startCellId[0])].value = ""
                    board.array[parseInt(board.startCellId[2])][parseInt(board.startCellId[0])].HTMLCellElement.innerHTML = ""
                    board.setStartCellId("")
                    if (board.checkBalls() == false) board.insertNextBalls()
                    board.array.forEach(row => row.forEach(el => {
                        el.HTMLCellElement.style.backgroundColor = cellColor
                        el.HTMLCellElement.onclick = () => el.changeValueClick()
                        el.HTMLCellElement.onmousemove = () => el.changeValueMousemove()
                    }))

                    board.updateScore()
                    setTimeout(() => {
                        board.endGame()
                    }, 100);
                }, 1000);
            }
        }

    }
    /** on mouseover actions */
    changeValueMousemove() {
        board.array.forEach(row => row.forEach(el => {
            if (el.value == "F") el.value = ""
        }))
        if (board.startCellId != "" && this.value != "S" && this.value != "X") {
            this.value = "F";
            board.findPath()
        }
    }
}