const axios = require('axios');
const Review = require('../models/Review');

class ReviewController {
  async createReview(req, res) {
    try {
      const { gameId, rating, comment } = req.body;

      if (!gameId || !rating) {
        return res.status(400).json({
          error: 'gameId e rating são obrigatórios'
        });
      }

      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({
          error: 'Rating deve ser um número entre 1.0 e 5.0'
        });
      }

      // Pega a URL do Game Service (servidor do amigo) do arquivo .env
      const gameServiceUrl = process.env.GAME_SERVICE_URL;
      
      // Verifica se a URL foi configurada no .env
      if (!gameServiceUrl) {
        console.error('❌ GAME_SERVICE_URL não configurada no .env');
        return res.status(500).json({
          error: 'Configuração do serviço de jogos não encontrada'
        });
      }

      // Tenta conectar ao Game Service para validar se o jogo existe
      try {
        // Faz requisição HTTP GET para o servidor do amigo
        const gameResponse = await axios.get(`${gameServiceUrl}/games/${gameId}`, {
          timeout: 5000  // Espera até 5 segundos pela resposta
        });

        // Verifica se o jogo foi encontrado
        if (gameResponse.status !== 200) {
          return res.status(400).json({
            error: 'Jogo inválido ou não encontrado'
          });
        }

        console.log(`✅ Jogo ${gameId} validado no Game Service`);

      } catch (gameError) {
        // Game Service retornou um erro (ex: 404 Not Found)
        if (gameError.response) {
          console.log(`❌ Game Service retornou status ${gameError.response.status} para gameId ${gameId}`);
          return res.status(400).json({
            error: 'Jogo inválido ou não encontrado',
            details: `Game Service retornou status ${gameError.response.status}`
          });
        } 
        // Game Service não respondeu (servidor offline ou timeout)
        else if (gameError.request) {
          console.error('❌ Game Service não respondeu:', gameError.message);
          return res.status(503).json({
            error: 'Serviço de jogos indisponível no momento',
            details: 'Não foi possível conectar ao Game Service'
          });
        } 
        else {
          console.error('❌ Erro ao validar jogo:', gameError.message);
          return res.status(500).json({
            error: 'Erro ao validar jogo',
            details: gameError.message
          });
        }
      }

      const review = await Review.create({
        gameId,
        rating: ratingNum,
        comment: comment || null
      });

      console.log(`✅ Review criada com sucesso - ID: ${review.id}`);

      return res.status(201).json({
        message: 'Review criada com sucesso',
        review: {
          id: review.id,
          gameId: review.gameId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        }
      });

    } catch (error) {
      console.error('❌ Erro ao criar review:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Erro de validação',
          details: error.errors.map(e => e.message)
        });
      }

      return res.status(500).json({
        error: 'Erro interno ao criar review',
        details: error.message
      });
    }
  }

  async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll({
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        count: reviews.length,
        reviews
      });
    } catch (error) {
      console.error('❌ Erro ao buscar reviews:', error);
      return res.status(500).json({
        error: 'Erro ao buscar reviews',
        details: error.message
      });
    }
  }

  async getReviewsByGame(req, res) {
    try {
      const { gameId } = req.params;

      const reviews = await Review.findAll({
        where: { gameId },
        order: [['createdAt', 'DESC']]
      });

      // Calcula a média de rating (igual Letterboxd)
      let averageRating = 0;
      if (reviews.length > 0) {
        const sumRatings = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
        averageRating = (sumRatings / reviews.length).toFixed(1); // Ex: 4.3
      }

      return res.status(200).json({
        gameId: parseInt(gameId),
        count: reviews.length,
        averageRating: parseFloat(averageRating), // Média geral do jogo
        reviews
      });
    } catch (error) {
      console.error('❌ Erro ao buscar reviews do jogo:', error);
      return res.status(500).json({
        error: 'Erro ao buscar reviews do jogo',
        details: error.message
      });
    }
  }

  // Novo endpoint: Estatísticas completas de um jogo
  async getGameStats(req, res) {
    try {
      const { gameId } = req.params;

      const reviews = await Review.findAll({
        where: { gameId }
      });

      if (reviews.length === 0) {
        return res.status(200).json({
          gameId: parseInt(gameId),
          totalReviews: 0,
          averageRating: 0,
          distribution: {
            "5.0": 0,
            "4.5": 0,
            "4.0": 0,
            "3.5": 0,
            "3.0": 0,
            "2.5": 0,
            "2.0": 0,
            "1.5": 0,
            "1.0": 0
          }
        });
      }

      // Calcula média
      const sumRatings = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
      const averageRating = (sumRatings / reviews.length).toFixed(1);

      // Conta distribuição de notas (quantas pessoas deram cada nota)
      const distribution = {
        "5.0": 0, "4.5": 0, "4.0": 0,
        "3.5": 0, "3.0": 0, "2.5": 0,
        "2.0": 0, "1.5": 0, "1.0": 0
      };

      reviews.forEach(review => {
        const ratingKey = parseFloat(review.rating).toFixed(1);
        if (distribution.hasOwnProperty(ratingKey)) {
          distribution[ratingKey]++;
        }
      });

      return res.status(200).json({
        gameId: parseInt(gameId),
        totalReviews: reviews.length,
        averageRating: parseFloat(averageRating),
        distribution // Ex: { "5.0": 10, "4.5": 5, "4.0": 3, ... }
      });
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas do jogo:', error);
      return res.status(500).json({
        error: 'Erro ao buscar estatísticas do jogo',
        details: error.message
      });
    }
  }

  // Endpoint PATCH para o Game Service buscar apenas a média (como seu amigo pediu)
  async getAverageRating(req, res) {
    try {
      const { id: gameId } = req.params;

      const reviews = await Review.findAll({
        where: { gameId: parseInt(gameId) }
      });

      if (reviews.length === 0) {
        return res.status(200).json({
          gameId: parseInt(gameId),
          averageRating: 0,
          totalReviews: 0
        });
      }

      // Calcula média
      const sumRatings = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
      const averageRating = (sumRatings / reviews.length).toFixed(1);

      return res.status(200).json({
        gameId: parseInt(gameId),
        averageRating: parseFloat(averageRating),
        totalReviews: reviews.length
      });
    } catch (error) {
      console.error('❌ Erro ao buscar média de rating:', error);
      return res.status(500).json({
        error: 'Erro ao buscar média de rating',
        details: error.message
      });
    }
  }

  async getReviewById(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({
          error: 'Review não encontrada'
        });
      }

      return res.status(200).json(review);
    } catch (error) {
      console.error('❌ Erro ao buscar review:', error);
      return res.status(500).json({
        error: 'Erro ao buscar review',
        details: error.message
      });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({
          error: 'Review não encontrada'
        });
      }

      await review.destroy();

      return res.status(200).json({
        message: 'Review deletada com sucesso'
      });
    } catch (error) {
      console.error('❌ Erro ao deletar review:', error);
      return res.status(500).json({
        error: 'Erro ao deletar review',
        details: error.message
      });
    }
  }
}

module.exports = new ReviewController();
