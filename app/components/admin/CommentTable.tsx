"use client";

export default function CommentTable({ limit = 10 }: { limit?: number }) {
  // Simuler les commentaires
  const comments = [
    {
      id: "1",
      author: "Marie Dupont",
      content: "Super article, très instructif !",
      articleTitle: "Comment créer un blog avec Next.js",
      articleSlug: "comment-creer-un-blog-avec-nextjs",
      createdAt: "18 Oct 2023",
      status: "approved",
    },
    {
      id: "2",
      author: "Pierre Martin",
      content: "J'ai une question concernant la partie sur les API routes...",
      articleTitle: "Comment créer un blog avec Next.js",
      articleSlug: "comment-creer-un-blog-avec-nextjs",
      createdAt: "19 Oct 2023",
      status: "pending",
    },
    {
      id: "3",
      author: "Sophie Lefebvre",
      content: "Merci pour ces conseils, j'ai pu améliorer mon référencement !",
      articleTitle: "Les meilleures pratiques pour le SEO en 2023",
      articleSlug: "meilleures-pratiques-seo-2023",
      createdAt: "7 Nov 2023",
      status: "approved",
    },
  ].slice(0, limit);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {comment.author}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {comment.content}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <a href={`/${comment.articleSlug}`} className="text-indigo-600 hover:text-indigo-900" target="_blank" rel="noopener noreferrer">
                  {comment.articleTitle}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {comment.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {comment.status === 'approved' ? 'Approuvé' : 'En attente'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                  {comment.status === 'approved' ? 'Rejeter' : 'Approuver'}
                </button>
                <button className="text-red-600 hover:text-red-900">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}