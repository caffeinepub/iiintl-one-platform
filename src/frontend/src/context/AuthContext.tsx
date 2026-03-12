import type { Identity } from "@icp-sdk/core/agent";
import { type ReactNode, createContext, useContext, useState } from "react";

export type UserRole =
  | "super_admin"
  | "admin"
  | "org_admin"
  | "member"
  | "activist"
  | "guest";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  avatar: string | null;
  email: string;
  organization?: string;
  password?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => boolean;
  loginWithII: (identity: Identity) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const MOCK_USERS: Record<UserRole, AuthUser> = {
  super_admin: {
    id: "0",
    name: "Super Admin",
    role: "super_admin",
    avatar: null,
    email: "superadmin@iiintl.org",
    password: "password",
  },
  admin: {
    id: "1",
    name: "Alex Rivera",
    role: "admin",
    avatar: null,
    email: "alex@iiintl.org",
    password: "password",
    organization: "IIIntl Global Council",
  },
  org_admin: {
    id: "2",
    name: "Maria Santos",
    role: "org_admin",
    avatar: null,
    email: "maria@iiintl.org",
    password: "password",
    organization: "Americas Chapter",
  },
  member: {
    id: "3",
    name: "James Okonkwo",
    role: "member",
    avatar: null,
    email: "james@iiintl.org",
    password: "password",
    organization: "Africa Region",
  },
  activist: {
    id: "4",
    name: "Priya Sharma",
    role: "activist",
    avatar: null,
    email: "priya@iiintl.org",
    password: "password",
    organization: "Asia Pacific",
  },
  guest: {
    id: "5",
    name: "Guest User",
    role: "guest",
    avatar: null,
    email: "guest@iiintl.org",
    password: "password",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const loginWithCredentials = (email: string, password: string): boolean => {
    const found = Object.values(MOCK_USERS).find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const loginWithII = (identity: Identity) => {
    const principal = identity.getPrincipal();
    setUser({
      id: principal.toString(),
      name: "Internet Identity User",
      role: "member",
      avatar: null,
      email: "",
    });
  };

  const switchRole = (role: UserRole) => {
    const target = MOCK_USERS[role];
    if (target) {
      setUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
        loginWithCredentials,
        loginWithII,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
