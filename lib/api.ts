import { Article, Comment, Like, Category, Tag } from '../types';

// Fonction pour récupérer les articles à la une
export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/api/articles?featured=true', { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Erreur lors de la récupération des articles à la une');
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Fonction pour récupérer les articles récents
export async function getRecentArticles(): Promise<Article[]> {
  try {
    const response = await fetch('/api/articles?limit=6', { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Erreur lors de la récupération des articles récents');
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Fonction pour récupérer un article par son slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`/api/articles/${slug}`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Erreur lors de la récupération de l\'article');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

// Fonction pour récupérer les commentaires d'un article
export async function getCommentsByArticleId(articleId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`/api/comments?articleId=${articleId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des commentaires');
    const data = await response.json();
    return data.comments;
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

// Fonction pour ajouter un commentaire
export async function addComment(articleId: string, content: string): Promise<Comment | null> {
  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, content }),
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout du commentaire');
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

// Fonction pour ajouter/retirer un like
export async function toggleLike(articleId: string): Promise<{ success: boolean; liked: boolean }> {
  try {
    const response = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    });
    if (!response.ok) throw new Error('Erreur lors de la gestion du like');
    const data = await response.json();
    return { success: true, liked: !!data.id };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, liked: false };
  }
}