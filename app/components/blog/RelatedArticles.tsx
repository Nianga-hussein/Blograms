import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: {
    name: string;
  };
}

export default function RelatedArticles({ articleId, categoryIds }: { articleId: string; categoryIds: string[] }) {
  // Simuler des articles similaires
  // Dans une application réelle, vous récupéreriez ces données depuis votre API
  const relatedArticles: Article[] = [
    {
      id: "2",
      title: "Les meilleures pratiques pour le SEO en 2023",
      slug: "meilleures-pratiques-seo-2023",
      excerpt: "Découvrez les techniques les plus efficaces pour améliorer le référencement de votre site web.",
      coverImage: "/images/article-2.jpg",
      publishedAt: "2023-11-05",
      author: {
        name: "Jane Smith",
      },
    },
    {
      id: "3",
      title: "Créer une API REST avec Next.js",
      slug: "creer-api-rest-nextjs",
      excerpt: "Apprenez à créer une API REST complète en utilisant les API Routes de Next.js.",
      coverImage: "/images/article-3.jpg",
      publishedAt: "2023-09-20",
      author: {
        name: "Bob Johnson",
      },
    },
    {
      id: "4",
      title: "Optimiser les performances de votre application Next.js",
      slug: "optimiser-performances-nextjs",
      excerpt: "Des conseils pratiques pour améliorer la vitesse et les performances de votre application Next.js.",
      coverImage: "/images/article-4.jpg",
      publishedAt: "2023-08-15",
      author: {
        name: "Alice Williams",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {relatedArticles.map((article) => (
        <article key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Link href={`/${article.slug}`} className="block">
            <div className="relative h-48">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Link>
          <div className="p-6">
            <Link href={`/${article.slug}`} className="block">
              <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="text-gray-600 mb-4">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Par {article.author.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}