import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: number, body: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const handleStartEdit = () => {
    setEditBody(comment.body);
    setValidationError(null);
    setItemError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditBody(comment.body);
    setValidationError(null);
    setItemError(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemError(null);

    if (!editBody.trim()) {
      setValidationError('Comment body cannot be blank.');
      return;
    }

    setValidationError(null);
    setIsSaving(true);
    try {
      await onUpdate(comment.commentId, editBody.trim());
      setIsEditing(false);
    } catch (err) {
      setItemError(
        err instanceof Error ? err.message : 'Failed to update comment.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this comment?',
    );
    if (!confirmed) return;

    setItemError(null);
    setIsDeleting(true);
    try {
      await onDelete(comment.commentId);
    } catch (err) {
      setItemError(
        err instanceof Error ? err.message : 'Failed to delete comment.',
      );
      setIsDeleting(false);
    }
  };

  return (
    <li className="comment-item">
      {itemError && (
        <div className="error-banner comment-error" role="alert">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span>{itemError}</span>
        </div>
      )}

      {isEditing ? (
        <form className="comment-edit-form" onSubmit={handleSaveEdit}>
          <label
            htmlFor={`edit-comment-${comment.commentId}`}
            className="form-label sr-only"
          >
            Edit comment
          </label>
          <textarea
            id={`edit-comment-${comment.commentId}`}
            className={`form-textarea ${validationError ? 'input-error' : ''}`}
            rows={3}
            value={editBody}
            onChange={(e) => {
              setEditBody(e.target.value);
              if (validationError && e.target.value.trim()) {
                setValidationError(null);
              }
            }}
            disabled={isSaving}
            autoFocus
          />
          {validationError && (
            <p className="validation-message" role="alert">
              {validationError}
            </p>
          )}
          <div className="comment-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-view">
          <p className="comment-body">{comment.body}</p>
          <div className="comment-actions">
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={handleStartEdit}
              disabled={isDeleting}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
