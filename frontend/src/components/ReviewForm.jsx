import React, { useState } from 'react';
import { createReview } from '../services/api';

const ReviewModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    gameId: '',
    rating: 5,
    comment: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.gameId) {
        throw { message: 'ID do jogo é obrigatório' };
      }

      const reviewData = {
        gameId: parseInt(formData.gameId),
        rating: parseFloat(formData.rating),
        comment: formData.comment || null
      };

      await createReview(reviewData);

      setFormData({ gameId: '', rating: 5, comment: '' });
      
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      console.error('Erro ao criar review:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStarInput = () => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <div className="flex items-center justify-center space-x-2">
        {stars.map((star) => {
          const fullStarActive = formData.rating >= star;
          const halfStarActive = formData.rating >= star - 0.5 && formData.rating < star;
          const fullStarHovered = hoveredStar >= star;
          const halfStarHovered = hoveredStar >= star - 0.5 && hoveredStar < star;
          
          return (
            <div key={star} className="relative inline-block">
              <button
                type="button"
                onClick={() => handleStarClick(star - 0.5)}
                onMouseEnter={() => setHoveredStar(star - 0.5)}
                onMouseLeave={() => setHoveredStar(0)}
                className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              />
              <button
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
                style={{ clipPath: 'inset(0 0 0 50%)' }}
              />
              <div className="text-5xl transition-all transform hover:scale-110 relative pointer-events-none">
                {fullStarActive || fullStarHovered ? (
                  <span className="text-letterboxd-orange">★</span>
                ) : halfStarActive || halfStarHovered ? (
                  <span className="relative inline-block">
                    <span className="text-gray-600">☆</span>
                    <span className="absolute left-0 top-0 text-letterboxd-orange overflow-hidden" style={{ width: '50%' }}>★</span>
                  </span>
                ) : (
                  <span className="text-gray-600">☆</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-letterboxd-card border border-gray-700 rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-letterboxd-card border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-light text-white">Adicionar Review</h2>
          <button
            onClick={onClose}
            className="text-letterboxd-text-secondary hover:text-white text-3xl transition-colors leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-red-400 font-semibold">{error.message}</p>
                  {error.details && (
                    <p className="text-red-300 text-sm mt-1">{error.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-letterboxd-text-primary mb-2 uppercase tracking-wider">
              Game ID <span className="text-letterboxd-green">*</span>
            </label>
            <input
              type="number"
              name="gameId"
              value={formData.gameId}
              onChange={handleChange}
              className="input-letterboxd w-full"
              placeholder="Digite o ID do jogo"
              required
              min="1"
            />
            <p className="text-xs text-letterboxd-text-secondary mt-1">
              Digite o ID do jogo que deseja avaliar
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-letterboxd-text-primary mb-3 uppercase tracking-wider text-center">
              Avaliação <span className="text-letterboxd-green">*</span>
            </label>
            {renderStarInput()}
            <p className="text-center text-letterboxd-text-secondary mt-2 text-sm">
              {formData.rating.toFixed(1)} estrelas
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-letterboxd-text-primary mb-2 uppercase tracking-wider">
              Comentário <span className="text-letterboxd-text-secondary text-xs normal-case">(Opcional)</span>
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="input-letterboxd w-full min-h-[140px] resize-none"
              placeholder="Compartilhe sua opinião sobre o jogo..."
              maxLength={1000}
            />
            <p className="text-xs text-letterboxd-text-secondary mt-1 text-right">
              {formData.comment.length}/1000 caracteres
            </p>
          </div>


          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-letterboxd flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </span>
              ) : (
                'Enviar Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
