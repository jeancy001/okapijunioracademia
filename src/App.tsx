import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./app/HomePage";
import NavPage from "./app/NavPage";
import Footer from "./app/Footer";
import Contacts from "./components/Contacts";

function App() {
  return (
    <div className="">
      <NavPage />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contacts/>}/>
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
