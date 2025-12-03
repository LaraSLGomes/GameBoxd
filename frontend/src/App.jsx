import React, { useState, useEffect } from 'react';
import Navbar from './components/Header';
import HeroSection from './components/HeroSection';
import ReviewGrid from './components/ReviewGrid';
import ReviewModal from './components/ReviewForm';
import { getAllReviews } from './services/api';

function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carrega as reviews quando o componente é montado
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllReviews();
      
      // O backend retorna { count, reviews }
      if (data.reviews) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Erro ao carregar reviews:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogReviewClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleReviewSuccess = () => {
    // Recarrega a lista de reviews após criar uma nova
    loadReviews();
  };

  return (
    <div className="min-h-screen bg-letterboxd-bg">
      {/* Navbar */}
      <Navbar onLogReviewClick={handleLogReviewClick} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content - Grid de Reviews */}
      <main className="container mx-auto px-6 py-12">
        <ReviewGrid 
          reviews={reviews} 
          loading={loading} 
          error={error}
        />
      </main>

      {/* Modal de Log Review */}
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleReviewSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-letterboxd-text-secondary text-sm font-light">
            GamerBoxd © 2025
          </p>
          <p className="text-letterboxd-text-secondary text-xs mt-2">
            Inspirado no Letterboxd. Desenvolvido com React + Vite + Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
