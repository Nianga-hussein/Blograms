import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from './ArticleCard';

const RecentArticles: FC = () => {
  // Simulation d'articles récents
  const recentArticles = [
    {
      id: '4',
      title: 'Comment optimiser les performances de votre application React',
      slug: 'optimiser-performances-application-react',
      excerpt: 'Découvrez les meilleures techniques pour améliorer les performances de vos applications React.',
      coverImage: '/images/article-cover-4.jpg',
      publishedAt: '2023-11-10',
      author: {
        id: '1',
        name: 'John Doe',
        image: '/images/author.jpg',
      },
      viewCount: 750,
      likeCount: 28,
      commentCount: 6,
    },
    {
      id: '5',
      title: 'Les bases de l\'accessibilité web pour les développeurs',
      slug: 'bases-accessibilite-web-developpeurs',
      excerpt: 'Apprenez comment rendre vos sites web accessibles à tous les utilisateurs.',
      coverImage: '/images/article-cover-5.jpg',
      publishedAt: '2023-11-08',
      author: {
        id: '2',
        name: 'Jane Smith',
        image: '/images/author-2.jpg',
      },
      viewCount: 620,
      likeCount: 32,
      commentCount: 4,
    },
    {
      id: '6',
      title: 'Introduction à Tailwind CSS',
      slug: 'introduction-tailwind-css',
      excerpt: 'Découvrez comment utiliser Tailwind CSS pour créer des interfaces modernes rapidement.',
      coverImage: '/images/article-cover-6.jpg',
      publishedAt: '2023-11-05',
      author: {
        id: '3',
        name: 'Alex Johnson',
        image: '/images/author-3.jpg',
      },
      viewCount: 880,
      likeCount: 45,
      commentCount: 9,
    },
    {
      id: '7',
      title: 'Créer une API REST avec Node.js et Express',
      slug: 'creer-api-rest-nodejs-express',
      excerpt: 'Guide étape par étape pour créer une API REST robuste avec Node.js et Express.',
      coverImage: '/images/article-cover-7.jpg',
      publishedAt: '2023-11-02',
      author: {
        id: '1',
        name: 'John Doe',
        image: '/images/author.jpg',
      },
      viewCount: 720,
      likeCount: 38,
      commentCount: 7,
    },
    {
      id: '8',
      title: 'Les principes SOLID en programmation orientée objet',
      slug: 'principes-solid-programmation-orientee-objet',
      excerpt: 'Comprendre et appliquer les principes SOLID pour un code plus maintenable.',
      coverImage: '/images/article-cover-8.jpg',
      publishedAt: '2023-10-28',
      author: {
        id: '2',
        name: 'Jane Smith',
        image: '/images/author-2.jpg',
      },
      viewCount: 950,
      likeCount: 52,
      commentCount: 11,
    },
    {
      id: '9',
      title: 'Débuter avec GraphQL',
      slug: 'debuter-avec-graphql',
      excerpt: 'Apprenez les bases de GraphQL et comment l\'intégrer dans vos applications.',
      coverImage: '/images/article-cover-9.jpg',
      publishedAt: '2023-10-25',
      author: {
        id: '3',
        name: 'Alex Johnson',
        image: '/images/author-3.jpg',
      },
      viewCount: 820,
      likeCount: 41,
      commentCount: 8,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recentArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default RecentArticles;