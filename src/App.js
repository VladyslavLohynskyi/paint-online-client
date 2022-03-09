import Canvas from "./components/Canvas";
import SettigBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import "./styles/app.scss";
function App() {
  return (
    <div className="App">
      <Toolbar />
      <SettigBar />
      <Canvas />
    </div>
  );
}

export default App;
