import React from 'react';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-900/20 border-red-800">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-red-400 font-semibold mb-1">Erro ao carregar reviews</h3>
            <p className="text-red-300 text-sm">{error.message}</p>
            {error.details && (
              <p className="text-red-400 text-xs mt-2">{error.details}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="card text-center py-12">
        <span className="text-6xl mb-4 block">🎮</span>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Nenhuma review encontrada
        </h3>
        <p className="text-gray-500 text-sm">
          Seja o primeiro a avaliar um jogo!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header da lista */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100">
          Feed de Reviews
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {reviews.length} {reviews.length === 1 ? 'review encontrada' : 'reviews encontradas'}
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
