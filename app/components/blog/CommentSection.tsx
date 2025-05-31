"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCommentsByArticleId, addComment } from "../../../lib/api";
import { Comment } from "../../../types";

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les commentaires au chargement du composant
  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await getCommentsByArticleId(articleId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const comment = await addComment(articleId, newComment);
      if (comment) {
        setComments(prev => [comment, ...prev]);
        setNewComment("");
      } else {
        setError("Impossible d'ajouter le commentaire. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Commentaires ({comments.length})</h2>

      {/* Liste des commentaires */}
      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  {/* Placeholder pour l'image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{comment.author.name}</h3>
                  <p className="text-sm text-gray-500">{comment.date}</p>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p>{comment.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de commentaire */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Ajouter un commentaire</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Écrivez votre commentaire ici..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}