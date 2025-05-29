import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "../../components/blog/CommentSection";
import LikeButton from "../../components/blog/LikeButton";
import ShareButtons from "../../components/blog/ShareButtons";
import ArticleAuthor from "../../components/blog/ArticleAuthor";
import RelatedArticles from "../../components/blog/RelatedArticles";

// Cette fonction serait remplacée par une requête à la base de données
async function getArticle(slug: string) {
  // Simulation d'un article
  return {
    id: "1",
    title: "Comment créer un blog avec Next.js",
    slug: "comment-creer-un-blog-avec-nextjs",
    content: "<p>Contenu de l'article...</p>",
    coverImage: "/images/article-cover.jpg",
    publishedAt: "2023-10-15",
    author: {
      id: "1",
      name: "John Doe",
      image: "/images/author.jpg",
    },
    categories: [{ id: "1", name: "Développement", slug: "developpement" }],
    tags: [{ id: "1", name: "Next.js", slug: "nextjs" }],
    viewCount: 1250,
    likeCount: 42,
    commentCount: 8,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center justify-between mb-8">
            <ArticleAuthor author={article.author} date={article.publishedAt} />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{article.viewCount}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{article.likeCount}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{article.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="max-w-4xl mx-auto mb-10 relative aspect-video">
          <Image 
            src={article.coverImage} 
            alt={article.title} 
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        {/* Article Content */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          
          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {article.categories.map(category => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            
            {article.tags.map(tag => (
              <Link 
                key={tag.id} 
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          
          {/* Like and Share */}
          <div className="mt-10 flex items-center justify-between">
            <LikeButton articleId={article.id} initialLikeCount={article.likeCount} />
            <ShareButtons title={article.title} slug={article.slug} />
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <CommentSection articleId={article.id} />
        </div>
        
        {/* Related Articles */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <RelatedArticles articleId={article.id} categoryIds={article.categories.map(c => c.id)} />
        </div>
      </div>
    </div>
  );
}