import { useState } from "react";
import { Menu, X, Home, Info, BookOpen, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NavPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={18} />, label: "Home", href: "/" },
    { icon: <Info size={18} />, label: "About Us", href: "#about" },
    { icon: <BookOpen size={18} />, label: "Courses", href: "#courses" },
    { icon: <Phone size={18} />, label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] shadow-xl sticky top-0 z-50 backdrop-blur-md bg-opacity-90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center">

        {/* LOGO + TITLE */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/logo.png"
            alt="Okapi Junior Academia Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl tracking-wide flex items-center gap-1 drop-shadow-sm">
            <span className="text-yellow-300">Okapi</span>
            <span className="text-white">Junior</span>
            <span className="text-green-300">Academia</span>
          </span>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center space-x-8 text-white font-semibold text-sm sm:text-base">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors duration-300"
            >
              {item.icon}
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? <X size={32} className="transition-transform duration-300" /> : <Menu size={32} className="transition-transform duration-300" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden bg-[#1D4ED8] text-white px-6 py-5 space-y-4 shadow-inner border-t border-white/10 transform transition-transform duration-300 ${
          menuOpen ? "max-h-screen opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
        } origin-top`}
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 text-lg sm:text-xl font-medium hover:text-yellow-300 transition-colors duration-300"
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default NavPage;
