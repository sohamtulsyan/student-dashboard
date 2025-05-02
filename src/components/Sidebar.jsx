"use client";

import React, { useState, useRef } from "react";
import { usePathname } from "next/navigation"; // Use Next.js's usePathname for the current route
import Link from "next/link"; // Use Next.js's Link component
import {
  Home,
  CheckSquare,
  Calendar,
  Users,
  LogOut,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: <Home />, path: "/home" },
  { label: "Tasks", icon: <CheckSquare />, path: "/tasks" },
  { label: "Deadlines", icon: <Calendar />, path: "/deadlines" },
  { label: "Forums", icon: <Users />, path: "/forums" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef(null);
  const pathname = usePathname(); // Get the current pathname

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setExpanded(false);
    }, 500);
  };

  return (
    <div
      className={`fixed h-screen bg-gray-200 transition-all duration-300 shadow-md flex flex-col justify-between ${
        expanded ? "w-48" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <div
          className={`flex items-center justify-center h-20 transition-all duration-300 ${
            expanded ? "justify-start pl-4" : "justify-center"
          }`}
        >
          <img
            src="/logo.svg"
            alt="HUB logo"
            className={`transition-all justify-start duration-300 ${
              expanded ? "w-15" : "w-10"
            }`}
          />
          {expanded && (
            <span className="ml-2 text-3xl font-bold transition-all duration-300">
              HUB
            </span>
          )}
        </div>

        {navItems.map((item) => (
          <Link key={item.label} href={item.path}>
            <div
              className={`flex items-center gap-3 p-3 mx-2 my-2 rounded-xl transition-all duration-200
                ${
                  pathname === item.path
                    ? "bg-yellow-100 text-yellow-600"
                    : "hover:bg-gray-300"
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span
                className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  expanded ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div
        className={`mb-6 flex flex-col items-center gap-6 ${
          expanded ? "items-start pl-4" : "items-center"
        }`}
      >
        <img
          src="/profile.png"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="text-center text-xs font-bold">
          {expanded && (
            <>
              <span className="text-yellow-500">SOHAM</span>
              <br />
              <span className="text-black">TULSYAN</span>
            </>
          )}
        </div>
        {[<LogOut />, <Settings />].map((icon, i) => (
          <div key={i} className="hover:text-gray-600 cursor-pointer">
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}
