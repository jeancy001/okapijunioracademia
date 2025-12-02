import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./app/HomePage";
import NavPage from "./app/NavPage";
import Footer from "./app/Footer";

function App() {
  return (
    <div>
      <NavPage />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
