import Tool from "./Tool";

export default class Circle extends Tool {
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
    this.mouseDown = false;

    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: "circle",
          x: this.centerX,
          y: this.centerY,
          radius: this.radius,
          color: this.ctx.fillStyle,
        },
      })
    );
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

      this.centerX = (this.startX + currentX) / 2;
      this.centerY = (this.startY + currentY) / 2;
      this.radius = Math.abs((currentX - this.startX) / 2);

      this.draw(this.centerX, this.centerY, this.radius);
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
  static circleDraw(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
  }
}
