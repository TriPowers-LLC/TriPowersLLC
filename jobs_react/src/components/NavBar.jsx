import React from "react";
import logo from "../assets/logo.svg"; // Adjust the path as necessary

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white shadow-md z-50">
      <src src={logo} alt="Logo" className="h-10 w-10 ml-4" /> {/* Logo */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wider">TriPowers LLC</div>
        <ul className="flex space-x-6 text-sm font-medium">
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