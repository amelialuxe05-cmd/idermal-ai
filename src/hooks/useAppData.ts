import { useState, useEffect } from 'react';

export function useAppData() {
  return {
    products: [],
    scans: [],
    loading: false,
    error: null,
    addScan: async () => ({ data: null, error: null }),
    refreshData: async () => {}
  };
}

export function useProducts() {
  return { products: [], loading: false, error: null, refreshProducts: async () => {} };
}

export function useProfile() {
  return { profile: { name: 'Потребител', email: 'test@example.com' }, loading: false, error: null, updateProfile: async () => ({ success: true }), refreshProfile: async () => {} };
}

export function useSkinAnalysis() {
  return { analyzeSkin: async () => ({ success: true }), loading: false };
}

export function useRoutines() {
  return { routines: [], loading: false, error: null, createRoutine: async () => ({ success: true }), updateRoutine: async () => ({ success: true }), deleteRoutine: async () => ({ success: true }) };
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
