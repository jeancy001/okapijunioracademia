import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  BookOpen,
  Phone,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContex";
import { useNavigate } from "react-router-dom";

function NavPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user data (from context / localStorage)
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="bg-gradient-to-r from-sky-400 to-blue-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Junior Okapi Academia Logo"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-bold text-xl tracking-wide">
            <span className="text-red-400">Okapi</span>
            <span className="text-green-400">Junior</span>
            <span className="text-blue-200">Academia</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden md:flex space-x-8 text-white font-medium items-center">
          <li className="flex items-center space-x-1 hover:text-yellow-300 transition">
            <Home size={18} />
            <a href="#">Home</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-yellow-300 transition">
            <Info size={18} />
            <a href="#about">About</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-yellow-300 transition">
            <BookOpen size={18} />
            <a href="#courses">Courses</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-yellow-300 transition">
            <GraduationCap size={18} />
            <a href="/myClass">My Class</a>
          </li>
          <li className="flex items-center space-x-1 hover:text-yellow-300 transition">
            <Phone size={18} />
            <a href="#contact">Contact</a>
          </li>

          {/* LOGOUT BUTTON WHEN USER IS LOGGED IN */}
          {user && (
            <li
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-yellow-300 transition cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </li>
          )}
        </ul>

        {/* DESKTOP BUTTON */}
        {!user && (
          <div className="hidden md:block">
            <a
              href="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold px-4 py-2 rounded-full shadow-lg transition duration-300"
            >
              Join Now
            </a>
          </div>
        )}

        {/* MOBILE MENU ICON */}
        <div
          className="md:hidden text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 text-white px-6 py-4 space-y-3">
          <a href="#" className="flex items-center space-x-2">
            <Home size={18} /> <span>Home</span>
          </a>
          <a href="#about" className="flex items-center space-x-2">
            <Info size={18} /> <span>About</span>
          </a>
          <a href="#courses" className="flex items-center space-x-2">
            <BookOpen size={18} /> <span>Courses</span>
          </a>
          <a href="/myClass" className="flex items-center space-x-2">
            <GraduationCap size={18} /> <span>My Class</span>
          </a>
          <a href="#contact" className="flex items-center space-x-2">
            <Phone size={18} /> <span>Contact</span>
          </a>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold py-2 rounded-full shadow-lg transition duration-300 hover:scale-105"
            >
              Join Now
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-full shadow-lg transition duration-300 flex items-center justify-center space-x-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavPage;
