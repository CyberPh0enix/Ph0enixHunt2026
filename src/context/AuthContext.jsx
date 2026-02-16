import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper functions to keep UI clean
  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signup = async (email, password, username) => {
    // 1. Sign up the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // Store username in metadata
      },
    });

    if (error) throw error;

    // 2. Create the public profile (for the scoreboard)
    if (data.user) {
      await supabase
        .from("profiles")
        .insert([{ id: data.user.id, username: username }]);
    }

    return { data, error };
  };

  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
