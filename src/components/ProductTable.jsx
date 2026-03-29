// src/components/ProductTable.jsx
import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const ProductTable = ({ products, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 border-b text-left">ID</th>
            <th className="px-4 py-3 border-b text-left">Gambar</th>
            <th className="px-4 py-3 border-b text-left">Nama Produk</th>
            <th className="px-4 py-3 border-b text-left">Kategori</th>
            <th className="px-4 py-3 border-b text-right">Harga</th>
            <th className="px-4 py-3 border-b text-center">Stok</th>
            <th className="px-4 py-3 border-b text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                Belum ada data produk
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b">{product.id}</td>
                <td className="px-4 py-3 border-b">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No img</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 border-b">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 border-b">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {product.category_name || product.category?.name || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 border-b text-right font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.stock > 10 
                      ? "bg-green-100 text-green-800" 
                      : product.stock > 0 
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView && onView(product)}
                      className="text-gray-600 hover:text-gray-800 transition"
                      title="Detail"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Hapus"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;