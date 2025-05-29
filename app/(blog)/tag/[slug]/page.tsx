import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleCard from "../../../components/blog/ArticleCard";
import SearchBar from "../../../components/blog/SearchBar";

// Cette fonction serait remplacée par une requête à la base de données
async function getTag(slug: string) {
  // Simulation d'un tag
  const tags = {
    "nextjs": {
      id: "1",
      name: "Next.js",
      slug: "nextjs",
    },
    "react": {
      id: "2",
      name: "React",
      slug: "react",
    }
  };
  
  return tags[slug as keyof typeof tags] || null;
}

// Cette fonction serait remplacée par une requête à la base de données
async function getArticlesByTag(tagId: string) {
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
      id: "3",
      title: "Créer une API REST avec Next.js",
      slug: "creer-api-rest-nextjs",
      excerpt: "Apprenez à créer une API REST complète avec Next.js et les API Routes.",
      coverImage: "/images/article-cover-3.jpg",
      publishedAt: "2023-09-20",
      author: {
        id: "1",
        name: "John Doe",
        image: "/images/author.jpg",
      },
      viewCount: 750,
      likeCount: 28,
      commentCount: 3,
    },
  ];
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTag(params.slug);
  
  if (!tag) {
    notFound();
  }

  const articles = await getArticlesByTag(tag.id);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Articles avec le tag #{tag.name}</h1>
          <SearchBar className="max-w-2xl mx-auto mt-8" />
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
            <p className="text-gray-600 mb-8">Il n'y a pas encore d'articles avec ce tag.</p>
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