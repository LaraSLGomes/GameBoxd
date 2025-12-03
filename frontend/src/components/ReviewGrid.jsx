import React from 'react';
import GamePosterCard from './GamePosterCard';

const ReviewGrid = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-letterboxd-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-letterboxd-card border border-red-800/50 rounded-md p-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-red-400 font-semibold mb-1">Error loading reviews</h3>
            <p className="text-red-300 text-sm">{error.message}</p>
            {error.details && (
              <p className="text-letterboxd-text-secondary text-xs mt-2">{error.details}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-50">🎮</div>
        <h3 className="text-2xl font-light text-letterboxd-text-secondary mb-2">
          No reviews yet
        </h3>
        <p className="text-letterboxd-text-secondary text-sm">
          Be the first to log a game review!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header da seção */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-white mb-2">
          Recent Reviews
        </h2>
        <p className="text-letterboxd-text-secondary text-sm">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Grid de Posters (estilo Letterboxd) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {reviews.map((review) => (
          <GamePosterCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewGrid;
