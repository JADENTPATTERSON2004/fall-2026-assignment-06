import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getArticle, updateArticle } from '../api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const EditArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ title?: string; contents?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) {
      setLoadError('Invalid article ID.');
      setLoading(false);
      return;
    }

    const loadArticle = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const article = await getArticle(articleId);
        setTitle(article.title);
        setContents(article.contents);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : 'Failed to load article.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const validate = (): boolean => {
    const newErrors: { title?: string; contents?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required and cannot be blank.';
    }

    if (!contents.trim()) {
      newErrors.contents = 'Contents are required and cannot be blank.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleId) return;

    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateArticle(articleId, {
        title: title.trim(),
        contents: contents.trim(),
      });
      // Redirect to the updated article's detail view
      navigate(`/articles/${articleId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update article.',
      );
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container form-page-container">
        <LoadingSpinner message="Loading article for editing..." />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page-container form-page-container">
        <div className="breadcrumb">
          <Link to="/">&larr; Back to Articles</Link>
        </div>
        <ErrorMessage message={loadError} />
      </main>
    );
  }

  return (
    <main className="page-container form-page-container">
      <div className="breadcrumb">
        <Link to={`/articles/${articleId}`}>&larr; Back to Article</Link>
      </div>

      <div className="form-card">
        <h1 className="form-title">Edit Article</h1>
        <p className="form-subtitle">Update your article title or contents.</p>

        {submitError && (
          <div className="error-banner" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="edit-article-title" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="edit-article-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="validation-message" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-article-contents" className="form-label">
              Contents <span className="required-star">*</span>
            </label>
            <textarea
              id="edit-article-contents"
              className={`form-textarea ${errors.contents ? 'input-error' : ''}`}
              rows={8}
              value={contents}
              onChange={(e) => {
                setContents(e.target.value);
                if (errors.contents) {
                  setErrors((prev) => ({ ...prev, contents: undefined }));
                }
              }}
              disabled={isSubmitting}
            />
            {errors.contents && (
              <p className="validation-message" role="alert">
                {errors.contents}
              </p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <Link to={`/articles/${articleId}`} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};
