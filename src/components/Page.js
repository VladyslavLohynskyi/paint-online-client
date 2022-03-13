import Canvas from "./Canvas";
import SettigBar from "./SettingBar";
import Toolbar from "./Toolbar";
import "../styles/app.scss";

function Page() {
  return (
    <div className="App">
      <Toolbar />
      <SettigBar />
      <Canvas />
    </div>
  );
}

export default Page;
