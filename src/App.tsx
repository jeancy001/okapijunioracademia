import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./app/HomePage";
import NavPage from "./app/NavPage";
import MyClass from "./components/MyClass";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import Footer from "./app/Footer";

function App() {
  return (
    <div>
      <NavPage />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/myClass"
          element={
            <ProtectedRoute>
              <MyClass />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer/>
    </div>
  );
}

export default App;
