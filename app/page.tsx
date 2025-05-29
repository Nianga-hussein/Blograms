import Image from "next/image";
import Link from "next/link";
import FeaturedArticles from "./components/blog/FeaturedArticles";
import RecentArticles from "./components/blog/RecentArticles";
import SearchBar from "./components/blog/SearchBar";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="Blog Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Bienvenue sur Notre Blog</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Découvrez des articles passionnants sur divers sujets</p>
          <SearchBar className="max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Articles à la Une</h2>
          <FeaturedArticles />
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Articles Récents</h2>
          <RecentArticles />
          <div className="text-center mt-10">
            <Link 
              href="/articles" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Voir tous les articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
