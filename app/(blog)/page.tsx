import Image from "next/image";
import Link from "next/link";
import FeaturedArticles from "../components/blog/FeaturedArticles";
import RecentArticles from "../components/blog/RecentArticles";
import SearchBar from "../components/blog/SearchBar";
import CategoryList from "../components/blog/CategoryList";

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Explorez Notre Blog</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Découvrez des articles passionnants sur divers sujets</p>
          <SearchBar className="max-w-2xl mx-auto" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Parcourir par catégorie</h2>
          <CategoryList />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Articles à la Une</h2>
          <FeaturedArticles />
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-gray-50">
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

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Abonnez-vous à notre newsletter pour recevoir les derniers articles et mises à jour</p>
          
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-grow px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}