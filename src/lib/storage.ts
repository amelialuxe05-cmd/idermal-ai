// LocalStorage-based persistence for offline-first experience

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  skin_type: string;
  skin_goals: string[];
}

export interface SkinAnalysis {
  id: string;
  overall_score: number;
  hydration_score: number;
  clarity_score: number; // renamed from acne_score - now represents skin clarity (higher = clearer skin)
  barrier_score: number;
  elasticity_score: number;
  oiliness_level: string;
  pore_visibility: string;
  created_at: string;
}

export interface RoutineItem {
  id: string;
  name: string;
  description: string;
  time_of_day: 'morning' | 'evening';
  step_order: number;
  product_name: string;
  is_completed: boolean;
  completed_at: string | null;
  date: string;
}

export interface ProgressLog {
  id: string;
  date: string;
  overall_score: number;
  hydration_score: number;
  clarity_score: number;
  barrier_score: number;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  image_url: string;
  rating: number;
  price: number;
}

const STORAGE_KEYS = {
  PROFILE: 'idermal_profile',
  ANALYSES: 'idermal_analyses',
  ROUTINES: 'idermal_routines',
  PROGRESS: 'idermal_progress',
  PRODUCTS: 'idermal_products',
  AUTH: 'idermal_auth',
};

// Generate UUID
const generateId = (): string => {
  return crypto.randomUUID();
};

// User Profile
export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: Partial<UserProfile>): UserProfile => {
  const existing = getProfile();
  const updated: UserProfile = {
    id: existing?.id || generateId(),
    full_name: profile.full_name || existing?.full_name || 'Sarah Johnson',
    avatar_url: profile.avatar_url || existing?.avatar_url || 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    skin_type: profile.skin_type || existing?.skin_type || 'combination',
    skin_goals: profile.skin_goals || existing?.skin_goals || ['improve hydration', 'reduce acne', 'anti-aging'],
  };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  return updated;
};

// Skin Analyses
export const getAnalyses = (): SkinAnalysis[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
  return data ? JSON.parse(data) : [];
};

export const getLatestAnalysis = (): SkinAnalysis | null => {
  const analyses = getAnalyses();
  return analyses.length > 0 ? analyses[analyses.length - 1] : null;
};

export const saveAnalysis = (analysis: Omit<SkinAnalysis, 'id' | 'created_at'>): SkinAnalysis => {
  const analyses = getAnalyses();
  const newAnalysis: SkinAnalysis = {
    ...analysis,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  analyses.push(newAnalysis);
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  return newAnalysis;
};

// Routines
export const getRoutines = (date?: string): RoutineItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  const routines: RoutineItem[] = data ? JSON.parse(data) : [];
  const targetDate = date || new Date().toISOString().split('T')[0];
  return routines.filter(r => r.date === targetDate);
};

export const initDefaultRoutines = (_userId: string): RoutineItem[] => {
  const today = new Date().toISOString().split('T')[0];
  const defaultRoutines: RoutineItem[] = [
    // Morning routine
    { id: generateId(), name: 'Cleanse', description: 'Gentle cleanser to remove overnight oils', time_of_day: 'morning', step_order: 1, product_name: 'Hydrating Facial Cleanser', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Tone', description: 'Balance skin pH', time_of_day: 'morning', step_order: 2, product_name: 'Toner', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Vitamin C Serum', description: 'Apply antioxidant protection', time_of_day: 'morning', step_order: 3, product_name: 'Vitamin C Serum 20%', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Moisturize', description: 'Lock in hydration', time_of_day: 'morning', step_order: 4, product_name: 'Moisturizing Cream', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Sunscreen', description: 'Apply SPF protection', time_of_day: 'morning', step_order: 5, product_name: 'Mineral Sunscreen SPF 50', is_completed: false, completed_at: null, date: today },
    // Evening routine
    { id: generateId(), name: 'Double Cleanse', description: 'Remove makeup and impurities', time_of_day: 'evening', step_order: 1, product_name: 'Hydrating Facial Cleanser', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Exfoliate', description: 'Use chemical exfoliant (2-3x per week)', time_of_day: 'evening', step_order: 2, product_name: 'Exfoliating Toner', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Treatment', description: 'Apply targeted treatment', time_of_day: 'evening', step_order: 3, product_name: 'Retinol 0.5 Night Cream', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Eye Cream', description: 'Gentle eye area treatment', time_of_day: 'evening', step_order: 4, product_name: 'Eye Cream', is_completed: false, completed_at: null, date: today },
    { id: generateId(), name: 'Night Cream', description: 'Rich overnight moisturizer', time_of_day: 'evening', step_order: 5, product_name: 'Moisturizing Cream', is_completed: false, completed_at: null, date: today },
  ];

  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  const existing: RoutineItem[] = data ? JSON.parse(data) : [];
  const updated = [...existing, ...defaultRoutines];
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
  return defaultRoutines;
};

export const updateRoutine = (id: string, updates: Partial<RoutineItem>): RoutineItem | null => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
  const routines: RoutineItem[] = data ? JSON.parse(data) : [];
  const index = routines.findIndex(r => r.id === id);

  if (index === -1) return null;

  routines[index] = { ...routines[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  return routines[index];
};

// Progress Logs
export const getProgressLogs = (): ProgressLog[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : [];
};

export const saveProgressLog = (log: Omit<ProgressLog, 'id'>): ProgressLog => {
  const logs = getProgressLogs();
  const newLog: ProgressLog = {
    ...log,
    id: generateId(),
  };
  logs.push(newLog);
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(logs));
  return newLog;
};

// Products (pre-seeded)
const defaultProducts: Product[] = [
  { id: '1', name: 'Hydrating Facial Cleanser', brand: 'CeraVe', category: 'cleanser', description: 'Gentle, non-foaming cleanser that hydrates while removing impurities', ingredients: ['Ceramides', 'Hyaluronic Acid', 'Glycerin'], benefits: ['Hydrating', 'Gentle', 'Non-stripping'], image_url: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.7, price: 16.99 },
  { id: '2', name: 'Vitamin C Serum 20%', brand: 'Timeless', category: 'serum', description: 'Potent antioxidant serum for brightening and anti-aging', ingredients: ['Vitamin C', 'Vitamin E', 'Ferulic Acid'], benefits: ['Brightening', 'Anti-aging', 'Antioxidant'], image_url: 'https://images.pexels.com/photos/3683059/pexels-photo-3683059.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.6, price: 28.99 },
  { id: '3', name: 'Moisturizing Cream', brand: 'La Roche-Posay', category: 'moisturizer', description: 'Rich moisturizer for dry to very dry skin', ingredients: ['Ceramides', 'Shea Butter', 'Niacinamide'], benefits: ['Intensely moisturizing', 'Barrier repair', 'Soothing'], image_url: 'https://images.pexels.com/photos/3783821/pexels-photo-3783821.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.8, price: 19.99 },
  { id: '4', name: 'Retinol 0.5 Night Cream', brand: "Paula's Choice", category: 'treatment', description: 'Intermediate strength retinol for cell turnover', ingredients: ['Retinol', 'Vitamin E', 'Peptides'], benefits: ['Anti-aging', 'Cell renewal', 'Smooths texture'], image_url: 'https://images.pexels.com/photos/3998413/pexels-photo-3998413.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.5, price: 32.00 },
  { id: '5', name: 'Mineral Sunscreen SPF 50', brand: 'EltaMD', category: 'sunscreen', description: 'Zinc-based physical sunscreen for daily protection', ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Hyaluronic Acid'], benefits: ['Broad spectrum', 'Non-comedogenic', 'Sensitive skin safe'], image_url: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.9, price: 38.00 },
  { id: '6', name: 'Niacinamide 10% Serum', brand: 'The Ordinary', category: 'serum', description: 'High-strength vitamin and mineral formula for visible pore reduction', ingredients: ['Niacinamide', 'Zinc PCA'], benefits: ['Pore minimizing', 'Oil control', 'Brightening'], image_url: 'https://images.pexels.com/photos/3683059/pexels-photo-3683059.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.4, price: 6.80 },
  { id: '7', name: 'Hyaluronic Acid Serum', brand: 'The Ordinary', category: 'serum', description: 'Hydration support with low, medium, and high molecular weight HA', ingredients: ['Hyaluronic Acid', 'Vitamin B5'], benefits: ['Hydrating', 'Plumping', 'Fast-absorbing'], image_url: 'https://images.pexels.com/photos/3683059/pexels-photo-3683059.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.5, price: 7.90 },
];

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(data);
};

// Auth simulation
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};

export const setAuthenticated = (value: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH, value.toString());
};

// Initialize app data
export const initializeAppData = (): void => {
  const profile = getProfile();
  if (!profile) {
    saveProfile({});
  }

  const analyses = getAnalyses();
  if (analyses.length === 0) {
    // Initialize with premium default analysis (healthy profile)
    saveAnalysis({
      overall_score: 85,
      hydration_score: 85,
      clarity_score: 90,
      barrier_score: 88,
      elasticity_score: 82,
      oiliness_level: 'balanced',
      pore_visibility: 'minimal',
    });
  }

  // Initialize progress data for the past 14 days
  const progress = getProgressLogs();
  if (progress.length === 0) {
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Generate slightly varying scores (premium healthy profile)
      const baseScore = 80 + Math.floor(Math.random() * 15);
      saveProgressLog({
        date: dateStr,
        overall_score: baseScore,
        hydration_score: 80 + Math.floor(Math.random() * 15),
        clarity_score: 85 + Math.floor(Math.random() * 10),
        barrier_score: 85 + Math.floor(Math.random() * 10),
        notes: '',
      });
    }
  }

  // Initialize routines for today
  const todayStr = new Date().toISOString().split('T')[0];
  const routines = getRoutines(todayStr);
  if (routines.length === 0) {
    const profile = getProfile();
    if (profile) {
      initDefaultRoutines(profile.id);
    }
  }

  // Initialize products
  getProducts();
};
