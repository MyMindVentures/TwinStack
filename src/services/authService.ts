import { UserRole } from "../types";

export interface AuthUser {
  uid: string;
  username?: string | null;
  email?: string | null;
  role: UserRole;
}

class AuthService {
  private user: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    this.checkSession();
  }

  async checkSession() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        this.setUser(data.user);
      } else {
        this.setUser(null);
      }
    } catch (err) {
      this.setUser(null);
    }
  }

  private setUser(user: AuthUser | null) {
    this.user = user;
    this.listeners.forEach((l) => l(user));
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    this.listeners.push(callback);
    callback(this.user);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  async login(credentials: {
    username?: string;
    email?: string;
    password?: string;
  }) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }

    const data = await res.json();
    this.setUser(data.user);
    return data.user;
  }

  async signup(email: string, pass: string, profile: any) {
    const res = await fetch("/api/auth/guest/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass, profile }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Signup failed");
    }

    const data = await res.json();
    this.setUser(data.user);
    return data.user;
  }

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      this.setUser(null);
    }
  }

  async acceptTerms() {
    const res = await fetch("/api/terms/accept", { method: "POST" });
    if (!res.ok) throw new Error("Failed to accept terms");
  }

  getCurrentUser() {
    return this.user;
  }
}

export const authService = new AuthService();
