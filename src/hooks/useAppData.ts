import { useState, useEffect } from 'react';

export function useAppData() {
  const [products, setProducts] = useState([
    { id: '1', name: 'Дерматологичен Анализ AI', price: 49.99, description: 'Пълен сканиращ анализ на кожата' },
    { id: '2', name: 'Персонализиран План', price: 29.99, description: 'Дневен и нощен режим за възстановяване' }
  ]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Сайта зарежда веднага без забавяне и без грешки
    setLoading(false);
  }, []);

  const addScan = async (scanData: any) => {
    const newScan = { id: Date.now().toString(), ...scanData, created_at: new Date().toISOString() };
    setScans((prev: any) => [newScan, ...prev]);
    return { data: newScan, error: null };
  };

  return {
    products,
    scans,
    loading,
    error,
    addScan,
    refreshData: async () => {}
  };
}
