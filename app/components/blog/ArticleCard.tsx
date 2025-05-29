import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

interface Author {
  id: string;
  name: string;
  image: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: Author;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  const { title, slug, excerpt, coverImage, publishedAt, author, viewCount, likeCount, commentCount } = article;
  
  // Formater la date
  const formattedDate = new Date(publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <Link href={`/${slug}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={coverImage || '/images/placeholder.jpg'} 
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/${slug}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">{title}</h2>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center mb-4">
          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
            <Image 
              src={author.image || '/images/placeholder-author.jpg'} 
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        <div className="flex text-sm text-gray-500 justify-between">
          <span>{viewCount} vues</span>
          <span>{likeCount} j'aime</span>
          <span>{commentCount} commentaires</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;