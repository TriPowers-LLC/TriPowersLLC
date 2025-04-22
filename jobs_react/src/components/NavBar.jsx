import React from "react";
import logo from "../assets/logo.svg";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-8">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          {/* <span className="text-xl font-bold tracking-wider">TriPowers LLC</span> */}
        </div>

        {/* Nav Links */}
        <ul className="flex flex-row items-center space-x-6 text-sm font-medium">
          <li><a href="#home" className="hover:text-orange-400 transition">Home</a></li>
          <li><a href="#about" className="hover:text-orange-400 transition">About</a></li>
          <li><a href="#services" className="hover:text-orange-400 transition">Services</a></li>
          <li><a href="#jobs" className="hover:text-orange-400 transition">Job Board</a></li>
          <li><a href="#portfolio" className="hover:text-orange-400 transition">Portfolio</a></li>
          <li><a href="#contact" className="hover:text-orange-400 transition">Contact</a></li>
          <li><a href="#admin" className="hover:text-orange-400 transition">Admin Panel</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
