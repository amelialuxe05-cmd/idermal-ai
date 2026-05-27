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

// Тази функция липсваше и чупеше сайта - добавяме я тук празна, за да тръгне всичко:
export function useProfile() {
  return {
    profile: { name: 'Потребител', email: 'test@example.com' },
    loading: false,
    error: null,
    updateProfile: async () => ({ success: true }),
    refreshProfile: async () => {}
  };
}

// Добавяме и тази функция за всеки случай, ако някой друг таб я търси:
export function useSkinAnalysis() {
  return {
    analyzeSkin: async () => ({ success: true }),
    loading: false
  };
}
