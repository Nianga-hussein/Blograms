import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleCard from "../../../components/blog/ArticleCard";
import SearchBar from "../../../components/blog/SearchBar";

// Cette fonction serait remplacée par une requête à la base de données
async function getCategory(slug: string) {
  // Simulation d'une catégorie
  const categories = {
    "developpement": {
      id: "1",
      name: "Développement",
      slug: "developpement",
      description: "Articles sur le développement web, mobile et logiciel."
    },
    "design": {
      id: "2",
      name: "Design",
      slug: "design",
      description: "Articles sur le design d'interface, l'UX et les tendances graphiques."
    }
  };
  
  return categories[slug as keyof typeof categories] || null;
}

// Cette fonction serait remplacée par une requête à la base de données
async function getArticlesByCategory(categoryId: string) {
  // Simulation d'articles
  return [
    {
      id: "1",
      title: "Comment créer un blog avec Next.js",
      slug: "comment-creer-un-blog-avec-nextjs",
      excerpt: "Découvrez comment créer un blog moderne avec Next.js et Tailwind CSS.",
      coverImage: "/images/article-cover.jpg",
      publishedAt: "2023-10-15",
      author: {
        id: "1",
        name: "John Doe",
        image: "/images/author.jpg",
      },
      viewCount: 1250,
      likeCount: 42,
      commentCount: 8,
    },
    {
      id: "2",
      title: "Les meilleures pratiques pour le SEO en 2023",
      slug: "meilleures-pratiques-seo-2023",
      excerpt: "Optimisez votre site web pour les moteurs de recherche avec ces conseils à jour.",
      coverImage: "/images/article-cover-2.jpg",
      publishedAt: "2023-11-05",
      author: {
        id: "2",
        name: "Jane Smith",
        image: "/images/author-2.jpg",
      },
      viewCount: 980,
      likeCount: 36,
      commentCount: 5,
    },
  ];
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category.id);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-xl text-gray-600 mb-8">{category.description}</p>
          <SearchBar className="max-w-2xl mx-auto" />
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-8">Il n'y a pas encore d'articles dans cette catégorie.</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}