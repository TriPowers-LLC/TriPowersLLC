import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
  { label: "Admin Dashboard", href: "/admin", role: "admin" },
  { label: "Applications", href: "/admin/applications", role: "admin" },
  { label: "My Applications", href: "/myapplications", role: "applicant" },
  { label: "Login", href: "/login", role: "guest" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const userRole = role || "guest";
  const firstName =
    user?.firstName ||
    user?.first_name ||
    user?.name?.split(" ")[0] ||
    user?.username ||
    "";

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!link.role) return true;
    return link.role === userRole;
  });

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-blue-900 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={logo}
            alt="TriPowers LLC logo"
            className="h-12 w-12 rounded-md object-cover"
          />

          <div className="min-w-0 leading-tight">
            <span className="block truncate text-base font-bold tracking-wide text-white md:text-lg">
              TriPowers LLC
            </span>
            <span className="hidden text-xs text-blue-200 md:block">
              Technology • Staffing • Mission Support
            </span>
          </div>
        </Link>

        <button
          className="sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <ul className="hidden items-center space-x-6 text-sm font-medium sm:flex">
          {visibleLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href} className="transition hover:text-orange-400">
                {link.label}
              </Link>
            </li>
          ))}

          {isAuthenticated && firstName && (
            <li className="text-blue-200 whitespace-nowrap">
              Hi {firstName}
            </li>
          )}

          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="transition hover:text-orange-400"
                type="button"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {open && (
        <ul className="space-y-3 bg-blue-900 px-4 pb-6 pt-2 text-center sm:hidden">
          {visibleLinks.map((link) => (
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

          {isAuthenticated && firstName && (
            <li className="py-2 text-blue-200">
              Hi {firstName}
            </li>
          )}

          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="block w-full py-2 hover:text-orange-400"
                type="button"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;