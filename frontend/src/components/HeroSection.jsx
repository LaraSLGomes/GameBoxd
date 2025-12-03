import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-letterboxd-bg py-16 border-b border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-4">
          Registre os jogos que você jogou.
        </h2>
        <p className="text-3xl md:text-4xl font-light text-letterboxd-text-secondary">
          Salve aqueles que deseja jogar.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
