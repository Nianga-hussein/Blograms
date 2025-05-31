'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Mail, Star, TrendingUp, Clock, Eye, Heart } from 'lucide-react';

// Composants simulés pour la démo
const FeaturedArticles = () => {
  const articles = [
    {
      id: 1,
      title: "L'Intelligence Artificielle Révolutionne le Design",
      excerpt: "Découvrez comment l'IA transforme radicalement notre approche du design moderne et créatif.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      category: "IA & Design",
      readTime: "8 min",
      views: "2.5k",
      likes: 156
    },
    {
      id: 2,
      title: "Tendances Web Design 2025",
      excerpt: "Les dernières innovations qui définissent l'avenir du design web et de l'expérience utilisateur.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      category: "Web Design",
      readTime: "12 min",
      views: "3.8k",
      likes: 203
    },
    {
      id: 3,
      title: "Animation CSS Avancée",
      excerpt: "Maîtrisez les techniques d'animation CSS pour créer des expériences utilisateur immersives.",
      image: "https://images.unsplash.com/photo-1558655146-364adbe3d577?w=600&h=400&fit=crop",
      category: "Développement",
      readTime: "15 min",
      views: "1.9k",
      likes: 89
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <div 
          key={article.id}
          className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 overflow-hidden"
          style={{ 
            animation: `fadeInUp 1s ease-out forwards ${index * 0.2}s`,
            opacity: 0
          }}
        >
          <div className="relative overflow-hidden">
            <img 
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                {article.category}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center space-x-3 text-white">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{article.views}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{article.likes}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center mb-3 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.readTime}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            <button className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
              Lire la suite
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentArticles = () => {
  const articles = [
    { id: 1, title: "Micro-interactions en Design", date: "2 jours", category: "UX/UI" },
    { id: 2, title: "Optimisation Performance Web", date: "5 jours", category: "Tech" },
    { id: 3, title: "Psychologie des Couleurs", date: "1 semaine", category: "Design" },
    { id: 4, title: "API REST vs GraphQL", date: "1 semaine", category: "Dev" },
    { id: 5, title: "Accessibilité Web 2025", date: "2 semaines", category: "A11y" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article, index) => (
        <div 
          key={article.id}
          className="group flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          style={{ 
            animation: `fadeInUp 1s ease-out forwards ${index * 0.1}s`,
            opacity: 0
          }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {article.title}
            </h4>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs mr-2">
                {article.category}
              </span>
              <span>Il y a {article.date}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-300" />
        </div>
      ))}
    </div>
  );
};

const SearchBar = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-500 ${isFocused ? 'transform scale-105' : ''}`}>
        <input
          type="text"
          placeholder="Rechercher des articles passionnants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-8 py-6 text-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/20 transition-all duration-300"
        />
        <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
      </div>
      {isFocused && (
        <div 
          className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
          style={{ 
            animation: 'fadeInUp 0.3s ease-out forwards',
            opacity: 0
          }}
        >
          <div className="p-6">
            <p className="text-gray-600 text-center">Commencez à taper pour voir les suggestions...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 4}s`
          }}
        >
          <div 
            className="bg-white/10 rounded-full backdrop-blur-sm"
            style={{
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-30px) rotate(3deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .gradient-bg {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
        {/* Parallax Background Effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        <FloatingElements />

        <div className="container mx-auto px-6 z-10 text-center text-white relative">
          <div 
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards',
              opacity: 0
            }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
              Bienvenue sur
              <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Notre Blog
              </span>
            </h1>
          </div>
          
          <p 
            className="text-xl md:text-3xl mb-16 max-w-4xl mx-auto opacity-90 leading-relaxed"
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.3s',
              opacity: 0
            }}
          >
            Découvrez des articles passionnants sur la technologie, le design et l'innovation qui façonnent notre avenir
          </p>
          
          <div 
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.6s',
              opacity: 0
            }}
          >
            <SearchBar className="max-w-3xl mx-auto mb-12" />
          </div>
          
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.9s',
              opacity: 0
            }}
          >
            <button className="group px-12 py-6 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center">
              Explorer les Articles
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <button className="px-12 py-6 glass-effect text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-500 hover:scale-110">
              Dernières Tendances
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 border-2 border-white/60 rounded-full flex justify-center glass-effect">
            <div className="w-2 h-4 bg-white rounded-full mt-3 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div 
              className="inline-flex items-center px-6 py-3 bg-blue-100 rounded-full mb-6"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards',
                opacity: 0
              }}
            >
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-600 font-semibold">Articles à la Une</span>
            </div>
            <h2 
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.2s',
                opacity: 0
              }}
            >
              Contenus Exceptionnels
            </h2>
            <p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.4s',
                opacity: 0
              }}
            >
              Explorez nos contenus les plus populaires et découvrez les dernières tendances qui révolutionnent l'industrie
            </p>
          </div>
          
          <div 
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.6s',
              opacity: 0
            }}
          >
            <FeaturedArticles />
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div 
              className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full mb-6"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards',
                opacity: 0
              }}
            >
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-600 font-semibold">Fraîchement Publié</span>
            </div>
            <h2 
              className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-green-900 to-blue-900 bg-clip-text text-transparent"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.2s',
                opacity: 0
              }}
            >
              Articles Récents
            </h2>
            <p 
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.4s',
                opacity: 0
              }}
            >
              Restez à la pointe avec nos dernières publications et analyses approfondies
            </p>
          </div>
          
          <div 
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.6s',
              opacity: 0
            }}
          >
            <RecentArticles />
          </div>
          
          <div 
            className="text-center mt-16"
            style={{ 
              animation: 'fadeInUp 1s ease-out forwards 0.8s',
              opacity: 0
            }}
          >
            <button className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center mx-auto">
              Voir tous les articles
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 text-center text-white relative z-10">
          <div className="max-w-4xl mx-auto">
            <div 
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards',
                opacity: 0
              }}
            >
              <Mail className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-semibold">Newsletter Exclusive</span>
            </div>
            
            <h2 
              className="text-5xl md:text-7xl font-bold mb-8"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.2s',
                opacity: 0
              }}
            >
              Restez Connecté
            </h2>
            
            <p 
              className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.4s',
                opacity: 0
              }}
            >
              Rejoignez notre communauté de passionnés et recevez en exclusivité nos derniers articles, analyses et tendances directement dans votre boîte mail
            </p>
            
            <div 
              className="max-w-2xl mx-auto"
              style={{ 
                animation: 'fadeInUp 1s ease-out forwards 0.6s',
                opacity: 0
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4 p-2 glass-effect rounded-2xl">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-8 py-6 bg-transparent text-white placeholder-white/70 focus:outline-none text-lg"
                />
                <button className="px-12 py-6 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all duration-500 hover:scale-105 flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  S'abonner
                </button>
              </div>
              <p className="text-sm mt-4 opacity-70">
                Plus de 10,000 professionnels nous font déjà confiance
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}