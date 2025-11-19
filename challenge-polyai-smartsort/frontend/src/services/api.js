import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  async classifyImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/classify/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async classifyText(text) {
    const formData = new FormData();
    formData.append('description', text);

    const response = await axios.post(`${API_BASE_URL}/classify/text`, formData);
    return response.data;
  },

  async getHistory(limit = 50) {
    const response = await axios.get(`${API_BASE_URL}/history`, {
      params: { limit },
    });
    return response.data;
  },

  async getStats() {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  },

  async deleteHistoryItem(id) {
    const response = await axios.delete(`${API_BASE_URL}/history/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },
};

export default api;