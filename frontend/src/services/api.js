import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta recebida:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getReviewsByGame = async (gameId) => {
  try {
    const response = await api.get(`/reviews/game/${gameId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    const message = error.response.data?.error || error.response.data?.message || 'Erro desconhecido';
    const details = error.response.data?.details || '';
    
    return {
      message,
      details,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    return {
      message: 'Servidor não está respondendo',
      details: 'Verifique se o Review Service está rodando na porta 3000',
      status: 503
    };
  } else {
    return {
      message: 'Erro ao fazer requisição',
      details: error.message,
      status: 500
    };
  }
};

export default api;
