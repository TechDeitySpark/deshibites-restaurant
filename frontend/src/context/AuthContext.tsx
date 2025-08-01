import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user' | 'manager';
}

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Auth context type
export interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Function to get initial auth state from localStorage
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  
  if (token && userRole) {
    // DEMO: Reconstruct user from localStorage
    const DEMO_CREDENTIALS = [
      { email: 'admin@deshibites.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
      { email: 'manager@deshibites.com', password: 'manager123', role: 'manager' as const, name: 'Manager User' },
      { email: 'user@deshibites.com', password: 'user123', role: 'user' as const, name: 'Regular User' },
      { email: 'demo@test.com', password: 'demo', role: 'user' as const, name: 'Demo User' }
    ];

    const matchedUser = DEMO_CREDENTIALS.find(cred => cred.role === userRole);
    
    if (matchedUser) {
      const user: User = {
        id: '1',
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
      };
      
      return {
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // DEMO: Test credentials for development
      const DEMO_CREDENTIALS = [
        { email: 'admin@deshibites.com', password: 'admin123', role: 'admin' as const, name: 'Admin User' },
        { email: 'manager@deshibites.com', password: 'manager123', role: 'manager' as const, name: 'Manager User' },
        { email: 'user@deshibites.com', password: 'user123', role: 'user' as const, name: 'Regular User' },
        { email: 'demo@test.com', password: 'demo', role: 'user' as const, name: 'Demo User' }
      ];

      // Check if credentials match demo accounts
      const matchedUser = DEMO_CREDENTIALS.find(
        cred => cred.email === email && cred.password === password
      );

      if (matchedUser) {
        // Simulate successful login with demo user
        const demoUser: User = {
          id: '1',
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
        };
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: demoUser });
        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user_role', matchedUser.role);
        return true;
      }

      // TODO: Replace with actual API call for production
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials. Try demo accounts: admin@deshibites.com / admin123');
      }

      const user = await response.json();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      // Store token in localStorage for persistence
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
      }
      return true;
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Invalid credentials. Try: admin@deshibites.com / admin123' 
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // DEMO: Allow any registration for testing
      if (email && password && name) {
        const demoUser: User = {
          id: Date.now().toString(),
          email: email,
          name: name,
          phone: phone,
          role: 'user', // Default role for new registrations
        };
        
        dispatch({ type: 'REGISTER_SUCCESS', payload: demoUser });
        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user_role', 'user');
        return;
      }

      // TODO: Replace with actual API call for production
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const user = await response.json();
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      
      // Store token in localStorage for persistence
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
      }
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
      throw error;
    }
  };

  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
