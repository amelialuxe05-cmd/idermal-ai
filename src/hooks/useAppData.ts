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

// Поправката за ProductsTab
export function useProducts() {
  return {
    products: [
      { id: '1', name: 'Дерматологичен Анализ AI', price: 49.99, description: 'Пълен сканиращ анализ на кожата' },
      { id: '2', name: 'Персонализиран План', price: 29.99, description: 'Дневен и нощен режим за възстановяване' }
    ],
    loading: false,
    error: null,
    refreshProducts: async () => {}
  };
}

export function useProfile() {
  return {
    profile: { name: 'Потребител', email: 'test@example.com' },
    loading: false,
    error: null,
    updateProfile: async () => ({ success: true }),
    refreshProfile: async () => {}
  };
}

export function useSkinAnalysis() {
  return {
    analyzeSkin: async () => ({ success: true }),
    loading: false
  };
}

export function useRoutines() {
  return {
    routines: [],
    loading: false,
    error: null,
    createRoutine: async () => ({ success: true }),
    updateRoutine: async () => ({ success: true }),
    deleteRoutine: async () => ({ success: true })
  };
}

// Застраховка, ако някой компонент търси история на сканиранията
export function useScans() {
  return {
    scans: [],
    loading: false,
    error: null,
    refreshScans: async () => {}
  };
}
