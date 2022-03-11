import Tool from "./Tool";

export default class Circle extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
  }
  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }
  mouseUpHandler(e) {
    this.mouseDown = false;
  }
  mouseDownHandler(e) {
    this.mouseDown = true;

    this.ctx.beginPath();
    this.startX = e.pageX - e.target.offsetLeft;
    this.startY = e.pageY - e.target.offsetTop;
    this.saved = this.canvas.toDataURL();
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      let currentY = e.pageY - e.target.offsetTop;
      let currentX = e.pageX - e.target.offsetLeft;

      let centerX = (this.startX + currentX) / 2;
      let centerY = (this.startY + currentY) / 2;
      let radius = Math.abs((currentX - this.startX) / 2);

      this.draw(centerX, centerY, radius);
    }
  }

  draw(x, y, radius) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
}
