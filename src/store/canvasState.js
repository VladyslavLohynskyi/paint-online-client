import { makeAutoObservable } from "mobx";

class CanvasState {
  canvas = null;
  socket = null;
  sessionid = null;
  undoList = [];
  redoList = [];
  username = "";
  disableFill = true;
  disableStroke = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDisableFill(bool) {
    this.disableFill = bool;
  }
  setDisableStroke(bool) {
    this.disableStroke = bool;
  }
  setSessionId(sessionid) {
    this.sessionid = sessionid;
  }
  setSocket(socket) {
    this.socket = socket;
  }

  setUsername(username) {
    this.username = username;
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    const ctx = this.canvas.getContext("2d");

    if (this.undoList.length > 0) {
      const dataUrl = this.undoList.pop();
      this.redoList.push(this.canvas.toDataURL());
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    } else {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.heigth);
    }
  }
  redo() {
    const ctx = this.canvas.getContext("2d");

    if (this.redoList.length > 0) {
      const dataUrl = this.redoList.pop();
      this.undoList.push(this.canvas.toDataURL());
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
    }
  }
}

export default new CanvasState();
