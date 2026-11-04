import React, { useEffect, useState, useCallback } from 'react';
import { Comment } from '../types';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api';
import { CommentItem } from './CommentItem';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface CommentsSectionProps {
  articleId: number | string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  articleId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New comment form state
  const [newBody, setNewBody] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchCommentsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(articleId);
      setComments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load comments.',
      );
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchCommentsData();
  }, [fetchCommentsData]);

  // Handle Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newBody.trim()) {
      setValidationError('Comment body cannot be blank.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);
    try {
      const created = await createComment(articleId, { body: newBody.trim() });
      // Append the new comment to the list without reloading the page
      setComments((prev) => [...prev, created]);
      // Clear the textarea after successful submission
      setNewBody('');
    } catch (err) {
      setAddError(
        err instanceof Error ? err.message : 'Failed to post comment.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Comment (in-place)
  const handleUpdateComment = async (commentId: number, body: string) => {
    const updated = await updateComment(articleId, commentId, { body });
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? updated : c)),
    );
  };

  // Handle Delete Comment (in-place removal)
  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(articleId, commentId);
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  return (
    <section className="comments-section" id="comments">
      <div className="comments-header">
        <h2 className="comments-title">
          Comments{' '}
          {!loading && (
            <span className="comments-count">({comments.length})</span>
          )}
        </h2>
      </div>

      {loading && <LoadingSpinner message="Loading comments..." />}

      {error && !loading && (
        <ErrorMessage
          message={error}
          onRetry={fetchCommentsData}
        />
      )}

      {!loading && !error && (
        <>
          {comments.length === 0 ? (
            <div className="comments-empty">
              <p className="no-comments-text">No comments yet.</p>
              <p className="comments-subtext">
                Be the first to leave a comment below!
              </p>
            </div>
          ) : (
            <ul className="comments-list">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </ul>
          )}

          {/* Add a Comment Form */}
          <div className="comment-add-card">
            <h3 className="comment-add-title">Add a Comment</h3>

            {addError && (
              <div className="error-banner" role="alert">
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddComment} noValidate>
              <div className="form-group">
                <label htmlFor="new-comment-body" className="sr-only">
                  Write a comment
                </label>
                <textarea
                  id="new-comment-body"
                  className={`form-textarea ${validationError ? 'input-error' : ''}`}
                  rows={4}
                  placeholder="Share your thoughts on this article..."
                  value={newBody}
                  onChange={(e) => {
                    setNewBody(e.target.value);
                    if (validationError && e.target.value.trim()) {
                      setValidationError(null);
                    }
                  }}
                  disabled={isSubmitting}
                />
                {validationError && (
                  <p className="validation-message" role="alert">
                    {validationError}
                  </p>
                )}
              </div>

              <div className="comment-add-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
};
