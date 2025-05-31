'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'header-blur shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo avec animation */}
          <Link href="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-full">
              <Image 
                src="/image/ram.png" 
                alt="Blog Logo" 
                width={60} 
                height={60}
                className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
            </div>
            <span className="ml-3 text-2xl font-bold gradient-text hidden sm:block">
              ModernBlog
            </span>
          </Link>

          {/* Navigation Desktop avec animations */}
          <nav className="hidden md:flex space-x-8">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/categories', label: 'Catégories' },
              { href: '/about', label: 'À propos' },
              { href: '/contact', label: 'Contact' }
            ].map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="relative text-gray-700 hover:text-primary transition-all duration-300 font-medium group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Boutons d'authentification */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="px-6 py-2 text-primary hover:text-primary-dark transition-all duration-300 font-medium relative group"
            >
              Connexion
              <span className="absolute inset-0 border border-primary rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              href="/register" 
              className="btn-primary animate-float"
            >
              Inscription
            </Link>
          </div>

          {/* Menu mobile */}
          <button 
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 mt-1 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 mt-1 ${
              isMenuOpen ? '-rotate-45 -translate-y-1' : ''
            }`}></span>
          </button>
        </div>

        {/* Menu mobile avec animation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <nav className="py-4 space-y-4">
            {[
              { href: '/', label: 'Accueil' },
              { href: '/categories', label: 'Catégories' },
              { href: '/about', label: 'À propos' },
              { href: '/contact', label: 'Contact' }
            ].map((item, index) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-300 animate-fade-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-4 space-y-2">
              <Link 
                href="/login" 
                className="block w-full text-center px-4 py-2 text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="block w-full text-center btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}