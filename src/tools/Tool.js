export default class Tool {
  constructor(canvas, socket, id) {
    this.canvas = canvas;
    this.socket = socket;

    this.id = id;
    this.ctx = canvas.getContext("2d");
    this.destroyEvents();
  }

  set fillColor(color) {
    console.log(color);
    this.ctx.fillStyle = color;
  }
  set strokeColor(color) {
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.ctx.lineWidth = width;
  }

  destroyEvents() {
    this.canvas.onmousemove = null;
    this.canvas.onmousedown = null;
    this.canvas.onmouseup = null;
  }
}
