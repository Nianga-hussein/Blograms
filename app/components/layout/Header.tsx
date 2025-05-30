"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/image/ram.png" alt="Blog Logo" width={80} height={80} />
          
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Accueil
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Catégories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Inscription
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 pb-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catégories
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}