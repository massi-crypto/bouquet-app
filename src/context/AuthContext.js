import { createContext, useContext, useState, useEffect } from 'react';
import { myFetch } from '../comm/MyFetch';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await myFetch('/session');
      if (data.loggedIn) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData) => {
    try {
      const response = await myFetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: 'Identifiants invalides' };
    }
  };

  const register = async (userData) => {
    try {
      await myFetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      // Après inscription, se connecter automatiquement
      return await login({ login: userData.login, password: userData.password });
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  };

  const logout = async () => {
    try {
      await myFetch('/users/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}