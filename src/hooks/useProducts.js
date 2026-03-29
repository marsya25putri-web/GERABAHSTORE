import { useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import toast from "react-hot-toast";

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialParams);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const addProduct = async (formData) => {
    try {
      const response = await productService.createProduct(formData);
      toast.success(response.message || "Produk berhasil ditambahkan");
      fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || "Gagal menambah produk");
      throw error;
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const response = await productService.updateProduct(id, formData);
      toast.success(response.message || "Produk berhasil diupdate");
      fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || "Gagal mengupdate produk");
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await productService.deleteProduct(id);
      toast.success(response.message || "Produk berhasil dihapus");
      fetchProducts();
      return response.data;
    } catch (error) {
      toast.error(error.message || "Gagal menghapus produk");
      throw error;
    }
  };

  const searchProducts = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const filterByCategory = (categoryId) => {
    setFilters((prev) => ({ ...prev, category: categoryId, page: 1 }));
  };

  const changePage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    products,
    loading,
    pagination,
    filters,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    changePage,
    refresh: fetchProducts,
  };
};