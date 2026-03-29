import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const productService = {
  // GET semua produk dengan filter
  async getProducts(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // GET single product
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // POST create product
  async createProduct(formData) {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUT update product
  async updateProduct(id, formData) {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE product
  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};