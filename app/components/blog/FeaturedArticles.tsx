import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedArticles: FC = () => {
  // Simulation d'articles à la une
  const featuredArticles = [
    {
      id: '1',
      title: 'Comment créer un blog avec Next.js',
      slug: 'comment-creer-un-blog-avec-nextjs',
      excerpt: 'Découvrez comment créer un blog moderne avec Next.js et Tailwind CSS.',
      coverImage: '/images/article-cover.jpg',
      publishedAt: '2023-10-15',
      author: {
        id: '1',
        name: 'John Doe',
        image: '/images/author.jpg',
      },
      viewCount: 1250,
      likeCount: 42,
      commentCount: 8,
    },
    {
      id: '2',
      title: 'Les meilleures pratiques pour le SEO en 2023',
      slug: 'meilleures-pratiques-seo-2023',
      excerpt: 'Optimisez votre site web pour les moteurs de recherche avec ces conseils à jour.',
      coverImage: '/images/article-cover-2.jpg',
      publishedAt: '2023-11-05',
      author: {
        id: '2',
        name: 'Jane Smith',
        image: '/images/author-2.jpg',
      },
      viewCount: 980,
      likeCount: 36,
      commentCount: 5,
    },
    {
      id: '3',
      title: 'Introduction à TypeScript pour les développeurs JavaScript',
      slug: 'introduction-typescript-developpeurs-javascript',
      excerpt: 'Apprenez les bases de TypeScript et comment l\'intégrer dans vos projets JavaScript.',
      coverImage: '/images/article-cover-3.jpg',
      publishedAt: '2023-09-20',
      author: {
        id: '3',
        name: 'Alex Johnson',
        image: '/images/author-3.jpg',
      },
      viewCount: 1500,
      likeCount: 58,
      commentCount: 12,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredArticles.map((article) => (
        <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
          <Link href={`/${article.slug}`}>
            <div className="relative h-48 w-full">
              <Image 
                src={article.coverImage || '/images/placeholder.jpg'} 
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          
          <div className="p-5">
            <Link href={`/${article.slug}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">{article.title}</h3>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
            
            <div className="flex items-center mb-4">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                <Image 
                  src={article.author.image || '/images/placeholder-author.jpg'} 
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{article.author.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex text-sm text-gray-500 justify-between">
              <span>{article.viewCount} vues</span>
              <span>{article.likeCount} j'aime</span>
              <span>{article.commentCount} commentaires</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedArticles;