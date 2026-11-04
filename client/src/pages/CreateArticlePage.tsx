import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../api';

export const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [errors, setErrors] = useState<{ title?: string; contents?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const newArticle = await createArticle({
        title: title.trim(),
        contents: contents.trim(),
      });
      // Redirect to the newly created article's detail view
      navigate(`/articles/${newArticle.articleId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create article.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container form-page-container">
      <div className="breadcrumb">
        <Link to="/">&larr; Back to Articles</Link>
      </div>

      <div className="form-card">
        <h1 className="form-title">Create New Article</h1>
        <p className="form-subtitle">
          Fill out the details below to publish a new article.
        </p>

        {submitError && (
          <div className="error-banner" role="alert">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="article-title" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Understanding React Hooks"
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
            <label htmlFor="article-contents" className="form-label">
              Contents <span className="required-star">*</span>
            </label>
            <textarea
              id="article-contents"
              className={`form-textarea ${errors.contents ? 'input-error' : ''}`}
              rows={8}
              placeholder="Write the full content of your article here..."
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
              {isSubmitting ? 'Publishing...' : 'Publish Article'}
            </button>
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};
