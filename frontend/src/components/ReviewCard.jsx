import React from 'react';

const ReviewCard = ({ review }) => {
  // Formata a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderiza as estrelas baseado no rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center space-x-1">
        {/* Estrelas cheias */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>
        ))}
        
        {/* Meia estrela */}
        {hasHalfStar && (
          <span className="text-yellow-400 text-xl relative">
            <span className="absolute">☆</span>
            <span className="absolute overflow-hidden w-1/2">★</span>
          </span>
        )}
        
        {/* Estrelas vazias */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600 text-xl">☆</span>
        ))}
        
        <span className="text-sm text-gray-400 ml-2">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="card hover:border-primary-600 transition-all">
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-primary-400 font-semibold text-sm">Game ID</span>
            <span className="bg-dark-100 px-3 py-1 rounded-full text-primary-300 font-bold">
              #{review.gameId}
            </span>
          </div>
          {renderStars(review.rating)}
        </div>
        
        <span className="text-xs text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      {/* Comentário */}
      {review.comment && (
        <div className="mt-4">
          <p className="text-gray-300 leading-relaxed">
            {review.comment}
          </p>
        </div>
      )}

      {/* Footer do Card */}
      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
        <span className="text-xs text-gray-500">Review ID: {review.id}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
