import {
  Article,
  Comment,
  CreateArticleDTO,
  UpdateArticleDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // Body is not JSON
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

// ==================== Articles API ====================

export async function getArticles(titleContains?: string): Promise<Article[]> {
  const url = new URL(`${API_BASE_URL}/articles`);
  if (titleContains && titleContains.trim() !== '') {
    url.searchParams.set('title_contains', titleContains.trim());
  }
  const res = await fetch(url.toString());
  return handleResponse<Article[]>(res);
}

export async function getArticle(articleId: number | string): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`);
  return handleResponse<Article>(res);
}

export async function createArticle(
  data: CreateArticleDTO,
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function updateArticle(
  articleId: number | string,
  data: UpdateArticleDTO,
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function deleteArticle(
  articleId: number | string,
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
    method: 'DELETE',
  });
  return handleResponse<Article>(res);
}

// ==================== Comments API ====================

export async function getComments(
  articleId: number | string,
): Promise<Comment[]> {
  const res = await fetch(`${API_BASE_URL}/articles/${articleId}/comments`);
  return handleResponse<Comment[]>(res);
}

export async function getComment(
  articleId: number | string,
  commentId: number | string,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
  );
  return handleResponse<Comment>(res);
}

export async function createComment(
  articleId: number | string,
  data: CreateCommentDTO,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
  return handleResponse<Comment>(res);
}

export async function updateComment(
  articleId: number | string,
  commentId: number | string,
  data: UpdateCommentDTO,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );
  return handleResponse<Comment>(res);
}

export async function deleteComment(
  articleId: number | string,
  commentId: number | string,
): Promise<Comment> {
  const res = await fetch(
    `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
    {
      method: 'DELETE',
    },
  );
  return handleResponse<Comment>(res);
}
