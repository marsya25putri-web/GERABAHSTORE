// src/utils/formatters.js

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Jika Anda juga butuh fungsi formatter lainnya, tambahkan di sini
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number);
};