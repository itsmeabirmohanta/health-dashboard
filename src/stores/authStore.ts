import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email: string) => set({
    isAuthenticated: true,
    user: {
      id: '1',
      email,
      name: email.split('@')[0]
    }
  }),
  logout: () => set({
    isAuthenticated: false,
    user: null
  })
}));