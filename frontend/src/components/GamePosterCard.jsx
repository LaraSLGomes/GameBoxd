import React from 'react';

const GamePosterCard = ({ review }) => {
  // Gera URL do placeholder.co com o Game ID
  const posterUrl = `https://placehold.co/400x600/2c3440/ffffff?text=Game+ID+${review.gameId}`;

  // Formata a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Renderiza as estrelas baseado no rating (laranja Letterboxd-style)
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center justify-center space-x-0.5 mb-2">
        {/* Estrelas cheias */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-letterboxd-orange text-lg">★</span>
        ))}
        
        {/* Meia estrela */}
        {hasHalfStar && (
          <span className="text-letterboxd-orange text-lg relative">
            <span className="absolute">☆</span>
            <span className="absolute overflow-hidden w-1/2">★</span>
          </span>
        )}
        
        {/* Estrelas vazias */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600 text-lg">☆</span>
        ))}
      </div>
    );
  };

  // Trunca o comentário para não ficar muito grande
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="group">
      {/* Poster Card (vertical, estilo filme) */}
      <div className="card-poster aspect-[2/3] mb-3 relative">
        <img
          src={posterUrl}
          alt={`Game ${review.gameId}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay no hover (opcional) */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold">
            VIEW REVIEW
          </span>
        </div>
      </div>

      {/* Informações abaixo do poster */}
      <div className="text-center px-2">
        {/* Estrelas */}
        {renderStars(review.rating)}

        {/* Comentário truncado */}
        {review.comment && (
          <p className="text-letterboxd-text-secondary text-sm leading-relaxed mb-2">
            {truncateText(review.comment)}
          </p>
        )}

        {/* Data e Game ID */}
        <div className="flex items-center justify-center space-x-2 text-xs text-letterboxd-text-secondary">
          <span className="font-semibold text-letterboxd-green">Game #{review.gameId}</span>
          <span>•</span>
          <span>{formatDate(review.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default GamePosterCard;
