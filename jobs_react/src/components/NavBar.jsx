import React, { useState } from "react";
import logo from "../assets/logo.jpg"
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",      href: "/"      },
  { label: "About",     href: "/about"     },
  { label: "Services",  href: "/services"  },
  { label: "Careers",   href: "/careers"      },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact",   href: "/contact"   },
  { label: "Admin",     href: "/admin",    role: "admin" },
];

const NavBar = ({userRole = "guest "}) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-blue-900 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center space-x-8">
        {/* Logo + Name container */}
        <img
                      src={logo}
                      alt="Logo"
                      className="App-logo h-14 w-auto" 
        />

        {/* burger (mobile) */}
        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" /* …burger icon… */ />
        </button>

        {/* desktop links */}
        <ul className="hidden sm:flex items-center space-x-8 text-sm font-medium">
          {NAV_LINKS.filter(l => !l.role || l.role === userRole).map(link => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="hover:text-orange-400 transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        
      </div>

      {/* mobile drawer */}
      {open && (
        <ul className="sm:hidden space-y-4 bg-blue-900 px-4 pb-6 text-center">
          {NAV_LINKS.filter(l => !l.role || l.role === userRole).map(link => (
            <li key={link.label}>
              <Link
               to={link.href}
                className="block py-2 hover:text-orange-400"
                onClick={() => setOpen(false)}
          >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;

