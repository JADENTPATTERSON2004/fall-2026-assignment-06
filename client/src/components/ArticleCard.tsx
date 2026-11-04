import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Truncate preview to ~150 chars if longer
  const preview =
    article.contents.length > 150
      ? `${article.contents.slice(0, 150).trim()}...`
      : article.contents;

  return (
    <article className="article-card">
      <div className="article-card-header">
        <h2 className="article-card-title">
          <Link to={`/articles/${article.articleId}`}>{article.title}</Link>
        </h2>
      </div>
      <p className="article-card-preview">{preview}</p>
      <div className="article-card-footer">
        <Link
          to={`/articles/${article.articleId}`}
          className="btn btn-outline btn-sm"
        >
          Read Article &rarr;
        </Link>
      </div>
    </article>
  );
};
