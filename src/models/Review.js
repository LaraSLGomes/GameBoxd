const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'game_id',
    comment: 'ID do jogo (referência externa ao Game Service)'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Rating deve ser no mínimo 1'
      },
      max: {
        args: [5],
        msg: 'Rating deve ser no máximo 5'
      },
      isDecimal: {
        msg: 'Rating deve ser um número válido'
      }
    },
    comment: 'Avaliação de 1.0 a 5.0 estrelas'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Comentário deve ter no máximo 1000 caracteres'
      }
    },
    comment: 'Comentário opcional sobre o jogo'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true
});

module.exports = Review;
