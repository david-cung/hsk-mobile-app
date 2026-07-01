export type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
};

export type AuthActions = {
  setToken: (token: string) => void;
  clearSession: () => void;
};

export type AuthStore = AuthState & AuthActions;
