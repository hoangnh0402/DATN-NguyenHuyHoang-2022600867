// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService, UserProfile } from "@/lib/auth-service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize as false/null to match server render (no hydration mismatch)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Read auth from localStorage after mount (client-only)
  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    const storedUser = authService.getStoredUser();

    if (isAuth && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }

    setIsReady(true);
  }, []);

  // Defer profile refresh to avoid blocking render
  useEffect(() => {
    if (!isAuthenticated) return;

    const publicPaths = ["/login", "/signup", "/"];
    if (publicPaths.includes(pathname)) return;

    const refreshProfile = () => {
      authService.getProfile()
        .then(freshUser => setUser(freshUser))
        .catch(error => console.error('Failed to refresh user profile:', error));
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(refreshProfile);
    } else {
      setTimeout(refreshProfile, 200);
    }
  }, [isAuthenticated, pathname]);

  // Redirect logic - only run after auth state is read
  useEffect(() => {
    if (!isReady) return;

    const publicPaths = ["/login", "/signup", "/"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      router.push("/dashboard");
      return;
    }
  }, [isAuthenticated, pathname, router, isReady]);

  const login = () => {
    // This is called after successful API login
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails with 401, logout
      if ((error as any)?.response?.status === 401) {
        logout();
      }
    }
  };

  // No loading spinner - children render immediately
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

