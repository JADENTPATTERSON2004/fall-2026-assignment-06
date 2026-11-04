import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article } from '../types';
import { getArticle, deleteArticle } from '../api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) {
      setError('Article ID is missing.');
      setLoading(false);
      return;
    }

    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getArticle(articleId);
        setArticle(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load article.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]);

  const handleDelete = async () => {
    if (!articleId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this article? This will also delete all of its comments.',
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteArticle(articleId);
      // Redirect back to article list on successful deletion
      navigate('/');
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete article.',
      );
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <LoadingSpinner message="Loading article..." />
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="page-container">
        <div className="breadcrumb">
          <Link to="/">&larr; Back to Articles</Link>
        </div>
        <ErrorMessage
          message={error || 'Article not found.'}
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="breadcrumb">
        <Link to="/">&larr; Back to Articles</Link>
      </div>

      <article className="article-detail-card">
        {deleteError && (
          <div className="error-banner" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <span>{deleteError}</span>
          </div>
        )}

        <div className="article-detail-header">
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-actions">
            <Link
              to={`/articles/${article.articleId}/edit`}
              className="btn btn-outline"
            >
              Edit Article
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Article'}
            </button>
          </div>
        </div>

        <div className="article-detail-body">
          <p className="article-detail-contents">{article.contents}</p>
        </div>
      </article>

      {/* Comments Section placeholder - will be populated in Part 2 */}
      <section className="comments-section" id="comments">
        <div className="comments-placeholder">
          <h2 className="comments-title">Comments</h2>
          <p className="text-muted">Comments feature will load here.</p>
        </div>
      </section>
    </main>
  );
};
