"use client";

import Link from "next/link";

export default function ArticleTable({ limit = 10 }: { limit?: number }) {
  // Simuler les articles
  const articles = [
    {
      id: "1",
      title: "Comment créer un blog avec Next.js",
      slug: "comment-creer-un-blog-avec-nextjs",
      status: "published",
      publishedAt: "15 Oct 2023",
      viewCount: 1250,
    },
    {
      id: "2",
      title: "Les meilleures pratiques pour le SEO en 2023",
      slug: "meilleures-pratiques-seo-2023",
      status: "published",
      publishedAt: "5 Nov 2023",
      viewCount: 980,
    },
    {
      id: "3",
      title: "Créer une API REST avec Next.js",
      slug: "creer-api-rest-nextjs",
      status: "draft",
      publishedAt: null,
      viewCount: 0,
    },
  ].slice(0, limit);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{article.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {article.publishedAt || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {article.viewCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/articles/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-900">
                  Éditer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}