import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { DBUser, UserRole } from '@/lib/supabase';

const AUTH_CACHE_KEY = 'md2_auth_user';

function getCachedUser(): DBUser | null {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setCachedUser(user: DBUser | null) {
  if (user) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_CACHE_KEY);
}

export function useAuth() {
  // Initialize from cache so UI never flashes "not logged in"
  const [user, setUser] = useState<DBUser | null>(getCachedUser);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef<typeof supabase.auth.getSession extends () => Promise<{data:{session:infer S}}> ? S : any>(null);

  useEffect(() => {
    let active = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      sessionRef.current = session;

      if (session?.user) {
        loadUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth events — SYNC ONLY, no async here
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      sessionRef.current = session;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCachedUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Don't block — fetch user data asynchronously
        loadUser(session.user.id);
      } else if (!session) {
        // Only clear user if we're actually signed out
        // Don't clear on transient null states (token refresh gaps)
      }
    });

    async function loadUser(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!active) return;

      if (data) {
        const u = data as DBUser;
        setUser(u);
        setCachedUser(u);
      } else if (error) {
        console.error('[useAuth] loadUser error:', error);
        // Keep existing user/cached user — don't wipe on query error
      }
      setLoading(false);
    }

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCachedUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return { user, loading, signIn, signOut, isAdmin };
}

export type { UserRole };
