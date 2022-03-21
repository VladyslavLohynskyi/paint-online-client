import Page from "./components/Page";

import "./styles/app.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/paint-online-client/:id" element={<Page />} />

          <Route
            path="/paint-online-client/"
            element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
