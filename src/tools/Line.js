import canvasState from "../store/canvasState";
import Tool from "./Tool";

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }
  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }
  mouseUpHandler(e) {
    console.log(this.ctx.lineWidth);
    this.mouseDown = false;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: "line",
          x: this.currentX,
          y: this.currentY,
          startX: this.startX,
          startY: this.startY,
          color: this.ctx.strokeStyle,
          lineWidth: this.ctx.lineWidth,
        },
      })
    );
  }
  mouseDownHandler(e) {
    this.mouseDown = true;
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;

    this.saved = this.canvas.toDataURL();
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.currentY = e.pageY - e.target.offsetTop;
      this.currentX = e.pageX - e.target.offsetLeft;

      this.draw(this.currentX, this.currentY);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();

      this.ctx.moveTo(this.startX, this.startY);

      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }
  static lineDraw(ctx, startX, startY, x, y, color, lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
  }
}
