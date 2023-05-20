import { useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (): void => setIsAuthenticated(true);
  const logout = (): void => setIsAuthenticated(false);

  return { isAuthenticated, login, logout };
};

export default useAuth;
