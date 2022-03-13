import Page from "./components/Page";

import "./styles/app.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/:id" element={<Page />} />

          <Route
            path="/"
            element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
