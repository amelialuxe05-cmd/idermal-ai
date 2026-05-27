};

  const deleteRoutine = async (id) => {
    const { error } = await supabase.from('routines').delete().eq('id', id);
    if (!error) setRoutines(prev => prev.filter(r => r.id !== id));
    return { success: !error };
  };

  return { routines, loading, error: null, createRoutine, updateRoutine, deleteRoutine };
}

// 6. Авторизация
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, error: null, signOut };
}

// 7. Помощни празни експорти
export function useSkinAnalysis() { return { analyzeSkin: async () => ({ success: true }), loading: false }; }
export function useScans() { return { scans: [], loading: false, error: null, refreshScans: async () => {} }; }
export function useHistory() { return { history: [], loading: false, error: null, clearHistory: async () => {} }; }
