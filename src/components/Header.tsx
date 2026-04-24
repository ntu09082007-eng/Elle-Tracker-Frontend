import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/realtime", label: "Kết quả" },
    { to: "/stats", label: "Thống kê" },
    { to: "/prediction", label: "Dự đoán" },
    { to: "/about", label: "Giới thiệu & Hướng dẫn" },
  ];

  return (
    <header className="bg-white shadow-lg w-full border-b border-gray-200">
      <div className="w-full px-8 md:px-16 lg:px-24 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <Link
              to="/realtime"
              className="hover:opacity-90 transition-opacity duration-200 font-bold text-gray-900"
            >
              <span>FChoice 2025 Tracker</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  location.pathname === link.to
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden bg-gray-100 text-gray-900 p-2 hover:bg-gray-200 rounded-lg transition-colors shadow-md"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <nav className="xl:hidden mt-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center ${
                  location.pathname === link.to
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
