import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GraphPage from "./pages/GraphPage";
import DetailsPage from "./pages/DetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/graph/:station" element={<GraphPage />} />
      <Route path="/details/:station" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;