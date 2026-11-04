import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { getArticles } from '../api';
import { ArticleCard } from '../components/ArticleCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchArticlesData = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(query);
      setArticles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load articles.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticlesData(searchQuery);
  }, [fetchArticlesData, searchQuery]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">
            Explore articles or share your thoughts with the community.
          </p>
        </div>
        <Link to="/articles/new" className="btn btn-primary">
          + Create Article
        </Link>
      </div>

      <div className="search-section">
        <SearchBar
          initialValue={searchQuery}
          onSearch={handleSearch}
          placeholder="Search articles by title..."
        />
        {searchQuery && (
          <p className="search-feedback">
            Showing results for: <strong>"{searchQuery}"</strong>
          </p>
        )}
      </div>

      {loading && <LoadingSpinner message="Loading articles..." />}

      {error && !loading && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchArticlesData(searchQuery)}
        />
      )}

      {!loading && !error && (
        <>
          {articles.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon" aria-hidden="true">
                📭
              </span>
              <h3>No articles found</h3>
              <p>
                {searchQuery
                  ? `No articles match your search "${searchQuery}". Try a different keyword.`
                  : 'Be the first one to write an article!'}
              </p>
              {searchQuery ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleSearch('')}
                >
                  Clear Search
                </button>
              ) : (
                <Link to="/articles/new" className="btn btn-primary">
                  Create Article
                </Link>
              )}
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <ArticleCard key={article.articleId} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};
