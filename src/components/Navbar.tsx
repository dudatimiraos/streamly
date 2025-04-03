"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFilm, FaHome, FaTv, FaCreditCard } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Início", href: "/", icon: FaHome },
    { name: "Filmes e Séries", href: "/filmes-series", icon: FaFilm },
    { name: "Assinaturas", href: "/assinaturas", icon: FaCreditCard },
    { name: "Dashboard", href: "/dashboard", icon: FaTv },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1a3075] via-[#962ffc] to-[#9422a8] shadow-md text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <img src="/logo-streamly.png" alt="Streamly" className="w-9 h-9" />
            <Link href="/" className="flex-shrink-0 font-bold text-xl text-[#e728b7]">
              Streamly
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href) ? "bg-gray-100/20" : "hover:bg-gray-200/20"
                    }`}
                  >
                    <Icon className="mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Botão menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href) ? "bg-blue-700" : "hover:bg-blue-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
