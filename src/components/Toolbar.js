import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/toolbar.scss";
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import Rect from "../tools/Rect";

const Toolbar = observer(() => {
  const onChangeFillColor = (e) => {
    toolState.setFillColor(e.target.value);
  };
  const download = () => {
    const dataURL = canvasState.canvas.toDataURL();
    console.log(dataURL);
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = canvasState.sessionid + ".jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div className="toolbar">
      <button
        className="toolbar__btn brush"
        onClick={() => {
          toolState.setTool(
            new Brush(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          );
          canvasState.setDisableFill(true);
          canvasState.setDisableStroke(false);
        }}
      ></button>
      <button
        className="toolbar__btn rect"
        onClick={() => {
          toolState.setTool(
            new Rect(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          );

          canvasState.setDisableFill(false);
          canvasState.setDisableStroke(false);
        }}
      ></button>
      <button
        className="toolbar__btn circle"
        onClick={() => {
          toolState.setTool(
            new Circle(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          );
          canvasState.setDisableFill(false);
          canvasState.setDisableStroke(false);
        }}
      ></button>
      <button
        className="toolbar__btn eraser"
        onClick={() => {
          toolState.setTool(
            new Eraser(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          );
          canvasState.setDisableFill(true);
          canvasState.setDisableStroke(true);
        }}
      ></button>
      <button
        className="toolbar__btn line"
        onClick={() => {
          toolState.setTool(
            new Line(
              canvasState.canvas,
              canvasState.socket,
              canvasState.sessionid
            )
          );
          canvasState.setDisableFill(true);
          canvasState.setDisableStroke(false);
        }}
      ></button>

      <input
        disabled={canvasState.disableFill}
        onChange={(e) => onChangeFillColor(e)}
        style={{ marginLeft: 10, cursor: "pointer" }}
        type="color"
      />
      <button
        className="toolbar__btn undo"
        onClick={() => {
          canvasState.undo();
        }}
      ></button>
      <button
        className="toolbar__btn redo"
        onClick={() => {
          canvasState.redo();
        }}
      ></button>
      <button
        className="toolbar__btn save"
        onClick={() => {
          download();
        }}
      ></button>
    </div>
  );
});

export default Toolbar;
