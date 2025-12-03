import React from 'react';

const Navbar = ({ onLogReviewClick }) => {
  return (
    <nav className="bg-letterboxd-card border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              GamerBoxd
            </h1>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-letterboxd-text-secondary hover:text-white transition-colors text-sm">
                GAMES
              </a>
              <a href="#" className="text-letterboxd-text-secondary hover:text-white transition-colors text-sm">
                REVIEWS
              </a>
              <a href="#" className="text-letterboxd-text-secondary hover:text-white transition-colors text-sm">
                LISTS
              </a>
            </div>
          </div>

          <button
            onClick={onLogReviewClick}
            className="btn-letterboxd"
          >
            Adicionar Review
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
