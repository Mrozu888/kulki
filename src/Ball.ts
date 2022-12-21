/**
 * Ball interface
 */
interface BallVars {
    /** DOM HTML Element */
    HTMLBallElement: HTMLDivElement;
    /** ball colors */
    readonly colors: Array<string>;
}
/**
 *  class that's creates the ball
 */
export class Ball implements BallVars {
    /** readonly array of colors whiches will be drawing one of them  */
    readonly colors: Array<string> = ["red", "green", "blue", "orange", "white", "yellow", "#222"]

    /** drawn color */
    private color: string;

    /** variable which has the HTML object of the ball */
    public HTMLBallElement: HTMLDivElement;

    /** constructor which creates the ball */
    constructor() {
        let ball: HTMLDivElement = document.createElement("div")
        ball.classList.add("ball")
        this.HTMLBallElement = ball
        this.color = this.getRandomColor()
        // this.HTMLBallElement.style.background = "radial-gradient(circle at 10px 10px, " + this.color + ", #000)"
        this.HTMLBallElement.style.backgroundColor = this.color
    }

    /**
     * function that's draws the color
     * 
     * @returns the drawn color
     */
    public getRandomColor() { return this.colors[Math.floor(Math.random() * this.colors.length)]; }
}