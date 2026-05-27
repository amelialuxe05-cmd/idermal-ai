import { useState, useEffect } from 'react';

// 1. Основен хук useAppData
export function useAppData() {
  const [products] = useState([
    { id: '1', name: 'Дерматологичен Анализ AI', price: 49.99, description: 'Пълен сканиращ анализ на кожата' },
    { id: '2', name: 'Персонализиран План', price: 29.99, description: 'Дневен и нощен режим за възстановяване' }
  ]);
  const [scans, setScans] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const addScan = async (scanData: any) => {
    const newScan = { id: Date.now().toString(), ...scanData, created_at: new Date().toISOString() };
    setScans((prev: any) => [newScan, ...prev]);
    return { data: newScan, error: null };
  };

  return { products, scans, loading, error, addScan, refreshData: async () => {} };
}

// 2. ХУКЪТ, КОЙТО ЛИПСВАШЕ (За ProgressTab.tsx)
export function useProgress() {
  return {
    progress: [],
    loading: false,
    error: null,
    refreshProgress: async () => {},
    addProgressEntry: async () => ({ success: true })
  };
}

// 3. Останалите хукове за пълна безопасност
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
  return { profile: { name: 'Потребител', email: 'test@example.com' }, loading: false, error: null, updateProfile: async () => ({ success: true }), refreshProfile: async () => {} };
}

export function useRoutines() {
  return { routines: [], loading: false, error: null, createRoutine: async () => ({ success: true }), updateRoutine: async () => ({ success: true }), deleteRoutine: async () => ({ success: true }) };
}

export function useSkinAnalysis() {
  return { analyzeSkin: async () => ({ success: true }), loading: false };
}

export function useScans() {
  return { scans: [], loading: false, error: null, refreshScans: async () => {} };
}

export function useHistory() {
  return { history: [], loading: false, error: null, clearHistory: async () => {} };
}

export function useAuth() {
  return { user: { id: '1', email: 'test@example.com' }, loading: false, error: null, signOut: async () => {} };
}
