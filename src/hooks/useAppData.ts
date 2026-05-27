import { useState, useEffect } from 'react';

// 1. Основен хук useAppData - управлява продуктите и сканиранията
export function useAppData() {
  const [products] = useState([
    { id: '1', name: 'Дерматологичен Анализ AI', price: 49.99, description: 'Пълен сканиращ анализ на кожата' },
    { id: '2', name: 'Персонализиран План', price: 29.99, description: 'Дневен и нощен режим за възстановяване' }
  ]);
  
  const [scans, setScans] = useState<any[]>([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const addScan = async (scanData: any) => {
    const newScan = { 
      id: Date.now().toString(), 
      ...scanData, 
      created_at: new Date().toISOString() 
    };
    setScans((prev) => [newScan, ...prev]);
    return { data: newScan, error: null };
  };

  return { products, scans, loading, error, addScan, refreshData: async () => {} };
}

// 2. Хук за прогреса (ProgressTab) - вече с работещо добавяне
export function useProgress() {
  const [progress, setProgress] = useState<any[]>([]);
  
  const addProgressEntry = async (entry: any) => {
    const newEntry = { id: Date.now().toString(), ...entry, date: new Date().toLocaleDateString() };
    setProgress((prev) => [newEntry, ...prev]);
    return { success: true, data: newEntry };
  };

  return { progress, loading: false, error: null, refreshProgress: async () => {}, addProgressEntry };
}

// 3. Хук за продуктите
export function useProducts() {
  const [products] = useState([
    { id: '1', name: 'Дерматологичен Анализ AI', price: 49.99, description: 'Пълен сканиращ анализ на кожата' },
    { id: '2', name: 'Персонализиран План', price: 29.99, description: 'Дневен и нощен режим за възстановяване' }
  ]);
  return { products, loading: false, error: null, refreshProducts: async () => {} };
}

// 4. Хук за потребителския профил - позволява промяна на данните
export function useProfile() {
  const [profile, setProfile] = useState({ name: 'Георги Михайлов', email: 'georgi@example.com' });
  
  const updateProfile = async (newData: any) => {
    setProfile((prev) => ({ ...prev, ...newData }));
    return { success: true };
  };

  return { profile, loading: false, error: null, updateProfile, refreshProfile: async () => {} };
}

// 5. Хук за рутините (дневна/нощна грижа)
export function useRoutines() {
  const [routines, setRoutines] = useState<any[]>([]);

  const createRoutine = async (routine: any) => {
    setRoutines((prev) => [...prev, { id: Date.now().toString(), ...routine }]);
    return { success: true };
  };

  const updateRoutine = async (id: string, updated: any) => {
    setRoutines((prev) => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    return { success: true };
  };

  const deleteRoutine = async (id: string) => {
    setRoutines((prev) => prev.filter(r => r.id !== id));
    return { success: true };
  };

  return { routines, loading: false, error: null, createRoutine, updateRoutine, deleteRoutine };
}

// 6. Хук за AI анализа на кожата
export function useSkinAnalysis() {
  const [loading, setLoading] = useState(false);

  const analyzeSkin = async (image: any) => {
    setLoading(true);
    // Симулираме кратко зареждане за реалистичност при натискане
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    return { 
      success: true, 
      result: { score: 85, type: 'Комбинирана', recommendations: ['Хидратация', 'Слънцезащита'] } 
    };
  };

  return { analyzeSkin, loading };
}

// 7. Хукове за история, сканирания и авторизация
export function useScans() {
  return { scans: [], loading: false, error: null, refreshScans: async () => {} };
}

export function useHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const clearHistory = async () => { setHistory([]); };
  return { history, loading: false, error: null, clearHistory };
}

export function useAuth() {
  return { user: { id: '1', email: 'georgi@example.com' }, loading: false, error: null, signOut: async () => {} };
}
