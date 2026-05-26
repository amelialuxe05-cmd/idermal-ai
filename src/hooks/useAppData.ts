import { useState, useEffect, useCallback } from 'react';
import * as storage from '../lib/storage';

export function useProfile() {
  const [profile, setProfile] = useState<storage.UserProfile | null>(null);

  useEffect(() => {
    const stored = storage.getProfile();
    if (stored) {
      setProfile(stored);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<storage.UserProfile>) => {
    const updated = storage.saveProfile(updates);
    setProfile(updated);
    return updated;
  }, []);

  return { profile, updateProfile };
}

export function useSkinAnalysis() {
  const [analysis, setAnalysis] = useState<storage.SkinAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const latest = storage.getLatestAnalysis();
    if (latest) {
      setAnalysis(latest);
    }
  }, []);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning process with 3 second duration
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3.34; // ~3 seconds total (100 / 30 intervals = 3.34 per 100ms)
      });
    }, 100);

    // Complete scan after 3 seconds - generate premium healthy results
    const scanDuration = setTimeout(() => {
      const newAnalysis = storage.saveAnalysis({
        overall_score: Math.floor(82 + Math.random() * 10), // 82-92
        hydration_score: Math.floor(80 + Math.random() * 15), // 80-95
        clarity_score: Math.floor(85 + Math.random() * 10), // 85-95
        barrier_score: Math.floor(85 + Math.random() * 12), // 85-97
        elasticity_score: Math.floor(80 + Math.random() * 15), // 80-95
        oiliness_level: ['balanced', 'low', 'balanced', 'balanced'][Math.floor(Math.random() * 4)], // mostly balanced
        pore_visibility: ['minimal', 'minimal', 'mild'][Math.floor(Math.random() * 3)], // mostly minimal
      });
      setAnalysis(newAnalysis);
      setIsScanning(false);
      clearTimeout(scanDuration);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(scanDuration);
    };
  }, []);

  return { analysis, isScanning, scanProgress, startScan };
}

export function useRoutines(date?: string) {
  const [routines, setRoutines] = useState<storage.RoutineItem[]>([]);

  useEffect(() => {
    const stored = storage.getRoutines(date);
    setRoutines(stored);
  }, [date]);

  const toggleRoutine = useCallback((id: string) => {
    const routine = routines.find(r => r.id === id);
    if (routine) {
      const updates: Partial<storage.RoutineItem> = {
        is_completed: !routine.is_completed,
        completed_at: !routine.is_completed ? new Date().toISOString() : null,
      };
      const updated = storage.updateRoutine(id, updates);
      if (updated) {
        setRoutines(prev => prev.map(r => r.id === id ? updated : r));
      }
    }
  }, [routines]);

  const morningRoutines = routines.filter(r => r.time_of_day === 'morning').sort((a, b) => a.step_order - b.step_order);
  const eveningRoutines = routines.filter(r => r.time_of_day === 'evening').sort((a, b) => a.step_order - b.step_order);

  return { routines, morningRoutines, eveningRoutines, toggleRoutine };
}

export function useProgress() {
  const [progressLogs, setProgressLogs] = useState<storage.ProgressLog[]>([]);

  useEffect(() => {
    const stored = storage.getProgressLogs();
    setProgressLogs(stored.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  return { progressLogs };
}

export function useProducts() {
  const [products, setProducts] = useState<storage.Product[]>([]);

  useEffect(() => {
    const stored = storage.getProducts();
    setProducts(stored);
  }, []);

  return { products };
}
