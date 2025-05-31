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
  index?: number;
}

const ArticleCard: FC<ArticleCardProps> = ({ article, index = 0 }) => {
  const { title, slug, excerpt, coverImage, publishedAt, author, viewCount, likeCount, commentCount } = article;
  
  const formattedDate = new Date(publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article 
      className="article-card group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/${slug}`} className="block">
        {/* Image avec overlay gradient */}
        <div className="article-card-image relative">
          <Image 
            src={coverImage || '/images/placeholder.jpg'} 
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge catégorie */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-sm font-semibold rounded-full">
              Technologie
            </span>
          </div>
          
          {/* Stats overlay */}
          <div className="absolute bottom-4 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              <span>{viewCount}</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              <span>{likeCount}</span>
            </div>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="p-6 relative z-10">
          {/* Titre */}
          <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-muted mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Auteur */}
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                  src={author.image || '/images/default-avatar.jpg'} 
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-sm text-card-foreground">{author.name}</p>
                <p className="text-xs text-muted">{formattedDate}</p>
              </div>
            </div>
            
            {/* Bouton de lecture */}
            <div className="flex items-center space-x-1 text-primary group-hover:text-primary-dark transition-colors duration-300">
              <span className="text-sm font-semibold">Lire</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Actions rapides */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default ArticleCard;