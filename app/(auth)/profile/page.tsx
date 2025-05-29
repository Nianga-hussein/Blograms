"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  // Simuler les données utilisateur
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Passionné de technologie et de développement web. J'aime partager mes connaissances à travers des articles de blog.",
    image: "/images/author.jpg",
    joinedDate: "Janvier 2023",
  });

  // Simuler les articles likés
  const [likedArticles, setLikedArticles] = useState([
    {
      id: "1",
      title: "Comment créer un blog avec Next.js",
      slug: "comment-creer-un-blog-avec-nextjs",
      excerpt: "Découvrez comment créer un blog moderne avec Next.js et Tailwind CSS.",
      publishedAt: "15 Oct 2023",
    },
    {
      id: "2",
      title: "Les meilleures pratiques pour le SEO en 2023",
      slug: "meilleures-pratiques-seo-2023",
      excerpt: "Optimisez votre site web pour les moteurs de recherche avec ces conseils à jour.",
      publishedAt: "5 Nov 2023",
    },
  ]);

  // Simuler les commentaires
  const [comments, setComments] = useState([
    {
      id: "1",
      articleTitle: "Comment créer un blog avec Next.js",
      articleSlug: "comment-creer-un-blog-avec-nextjs",
      content: "Super article ! J'ai appris beaucoup de choses.",
      publishedAt: "20 Oct 2023",
    },
    {
      id: "2",
      articleTitle: "Les meilleures pratiques pour le SEO en 2023",
      articleSlug: "meilleures-pratiques-seo-2023",
      content: "Très instructif, merci pour ces conseils.",
      publishedAt: "10 Nov 2023",
    },
  ]);

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-10 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white mb-4 sm:mb-0 sm:mr-6">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 mt-1">Membre depuis {user.joinedDate}</p>
                <p className="mt-3 max-w-2xl">{user.bio}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "profile" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab("liked")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "liked" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Articles Likés
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "comments" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                Commentaires
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nom complet</p>
                        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Biographie</h3>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-900">{user.bio}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Modifier le profil
                  </button>
                </div>
              </div>
            )}

            {activeTab === "liked" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Articles que vous avez aimés</h3>
                {likedArticles.length > 0 ? (
                  <div className="space-y-4">
                    {likedArticles.map((article) => (
                      <div key={article.id} className="bg-gray-50 p-4 rounded-md">
                        <Link href={`/${article.slug}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-500">
                          {article.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-600">{article.excerpt}</p>
                        <p className="mt-2 text-xs text-gray-500">Publié le {article.publishedAt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Vous n'avez pas encore aimé d'articles.</p>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vos commentaires</h3>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-900">{comment.content}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <Link href={`/${comment.articleSlug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Sur : {comment.articleTitle}
                          </Link>
                          <p className="text-xs text-gray-500">{comment.publishedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Vous n'avez pas encore commenté d'articles.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}