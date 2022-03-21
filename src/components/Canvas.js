import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";
import Eraser from "../tools/Eraser";
import Circle from "../tools/Circle";
import Line from "../tools/Line";

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);

    axios
      .get(`https://paint-online-ua.herokuapp.com/image?id=${params.id}`)
      .then((res) => {
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.src = res.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.stroke();
        };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket("wss://paint-online-ua.herokuapp.com");

      canvasState.setSocket(socket);

      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));

      socket.onopen = () => {
        console.log("connection success");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        switch (msg.method) {
          case "connection":
            console.log(`User ${msg.username} connected`);
            break;
          case "draw":
            drawHandler(msg);
            break;

          default:
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    let lineWidth, strokeStyle, fillStyle;
    canvasState.pushToUndo(canvasRef.current.toDataURL());

    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        lineWidth = ctx.lineWidth;
        strokeStyle = ctx.strokeStyle;

        Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;

        break;
      case "rect":
        lineWidth = ctx.lineWidth;
        strokeStyle = ctx.strokeStyle;
        fillStyle = ctx.fillStyle;
        console.log(fillStyle);
        Rect.rectDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color,
          figure.lineWidth,
          figure.strokeColor
        );
        console.log(fillStyle);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;
        break;
      case "eraser":
        lineWidth = ctx.lineWidth;
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
        ctx.lineWidth = lineWidth;
        break;
      case "circle":
        lineWidth = ctx.lineWidth;
        strokeStyle = ctx.strokeStyle;
        fillStyle = ctx.fillStyle;

        Circle.circleDraw(
          ctx,
          figure.x,
          figure.y,
          figure.radius,
          figure.color,
          figure.lineWidth,
          figure.strokeColor
        );

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = fillStyle;

        break;
      case "line":
        Line.lineDraw(
          ctx,
          figure.startX,
          figure.startY,
          figure.x,
          figure.y,
          figure.color,
          figure.lineWidth
        );
        break;
      case "finish":
        ctx.beginPath();

        break;

      default:
        break;
    }
  };
  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const mouseUpHandler = () => {
    axios
      .post(`https://paint-online-ua.herokuapp.com/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((res) => console.log(res.data));
  };
  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>PLS write your username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={() => mouseDownHandler()}
        onMouseUp={() => mouseUpHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
});

export default Canvas;
