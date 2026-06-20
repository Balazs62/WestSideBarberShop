import { getDatabase, persistData } from "@/data/mockDatabase";

// User roles
export const ROLES = {
  CUSTOMER: "customer",
  EMPLOYEE: "employee",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

class AuthService {
  constructor() {
    this.currentUser = null;
    this.sessionTimeout = null;
    this.loginAttempts = new Map();
    this.loadSession();
  }

  // Simple password hashing using Web Crypto API
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  // Verify password
  async verifyPassword(password, hashedPassword) {
    const inputHash = await this.hashPassword(password);
    return inputHash === hashedPassword;
  }

  // Check rate limiting
  checkRateLimit(email) {
    const now = Date.now();
    const attempts = this.loginAttempts.get(email) || { count: 0, resetTime: now };

    if (now > attempts.resetTime) {
      this.loginAttempts.set(email, { count: 0, resetTime: now + RATE_LIMIT_CONFIG.windowMs });
      return true;
    }

    if (attempts.count >= RATE_LIMIT_CONFIG.maxAttempts) {
      const remainingTime = Math.ceil((attempts.resetTime - now) / 1000);
      return { success: false, remainingTime };
    }

    return true;
  }

  // Record failed login attempt
  recordFailedAttempt(email) {
    const now = Date.now();
    const attempts = this.loginAttempts.get(email) || { count: 0, resetTime: now + RATE_LIMIT_CONFIG.windowMs };
    attempts.count++;
    this.loginAttempts.set(email, attempts);
  }

  // Clear login attempts
  clearLoginAttempts(email) {
    this.loginAttempts.delete(email);
  }

  // Register new user
  async register(userData) {
    const db = getDatabase();

    // Validate input
    if (!userData.email || !userData.password || !userData.name) {
      return { success: false, error: "Minden mező kötelező" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { success: false, error: "Érvénytelen e-mail cím" };
    }

    // Validate password strength
    if (userData.password.length < 8) {
      return { success: false, error: "A jelszónak legalább 8 karakter hosszúnak kell lennie" };
    }

    // Check if user already exists
    const existingUser = db.users?.find((u) => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: "Ez az e-mail cím már regisztrálva van" };
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      phone: userData.phone || "",
      role: userData.role || ROLES.CUSTOMER,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // Initialize users array if it doesn't exist
    if (!db.users) {
      db.users = [];
    }

    db.users.push(newUser);
    persistData("users", db.users);

    // Auto-login after registration
    this.currentUser = newUser;
    this.saveSession();

    return { success: true, user: newUser };
  }

  // Login
  async login(email, password) {
    const rateLimitCheck = this.checkRateLimit(email);
    if (rateLimitCheck !== true) {
      return {
        success: false,
        error: `Túl sok sikertelen próbálkozás. Próbáld újra ${rateLimitCheck.remainingTime} másodperc múlva.`,
      };
    }

    const db = getDatabase();
    const user = db.users?.find((u) => u.email === email);

    if (!user) {
      this.recordFailedAttempt(email);
      return { success: false, error: "Hibás e-mail cím vagy jelszó" };
    }

    if (!user.isActive) {
      return { success: false, error: "Ez a fiók inaktív" };
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      this.recordFailedAttempt(email);
      return { success: false, error: "Hibás e-mail cím vagy jelszó" };
    }

    // Clear failed attempts on successful login
    this.clearLoginAttempts(email);

    // Set current user
    this.currentUser = user;
    this.saveSession();

    return { success: true, user };
  }

  // Logout
  logout() {
    this.currentUser = null;
    this.clearSession();
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
  }

  // Save session to localStorage
  saveSession() {
    if (this.currentUser) {
      const sessionData = {
        user: this.currentUser,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem("auth_session", JSON.stringify(sessionData));

      // Set session timeout
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
      }
      this.sessionTimeout = setTimeout(() => {
        this.logout();
      }, 24 * 60 * 60 * 1000);
    }
  }

  // Load session from localStorage
  loadSession() {
    const sessionData = localStorage.getItem("auth_session");
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (parsed.expiresAt > Date.now()) {
          this.currentUser = parsed.user;
          // Set session timeout
          const remainingTime = parsed.expiresAt - Date.now();
          if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
          }
          this.sessionTimeout = setTimeout(() => {
            this.logout();
          }, remainingTime);
        } else {
          this.clearSession();
        }
      } catch (error) {
        this.clearSession();
      }
    }
  }

  // Clear session from localStorage
  clearSession() {
    localStorage.removeItem("auth_session");
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.currentUser?.role === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    return roles.includes(this.currentUser?.role);
  }

  // Check if user is admin or super admin
  isAdmin() {
    return this.hasRole(ROLES.ADMIN) || this.hasRole(ROLES.SUPER_ADMIN);
  }

  // Check if user is employee
  isEmployee() {
    return this.hasRole(ROLES.EMPLOYEE);
  }

  // Check if user is customer
  isCustomer() {
    return this.hasRole(ROLES.CUSTOMER);
  }

  // Update user profile
  async updateProfile(updates) {
    if (!this.currentUser) {
      return { success: false, error: "Nincs bejelentkezve" };
    }

    const db = getDatabase();
    const userIndex = db.users?.findIndex((u) => u.id === this.currentUser.id);

    if (userIndex === -1) {
      return { success: false, error: "Felhasználó nem található" };
    }

    // Update user data
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates,
      id: this.currentUser.id, // Prevent ID change
      email: this.currentUser.email, // Prevent email change
      role: this.currentUser.role, // Prevent role change
      password: this.currentUser.password, // Prevent password change
      createdAt: this.currentUser.createdAt, // Prevent creation date change
    };

    persistData("users", db.users);

    // Update current user
    this.currentUser = db.users[userIndex];
    this.saveSession();

    return { success: true, user: this.currentUser };
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      return { success: false, error: "Nincs bejelentkezve" };
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(currentPassword, this.currentUser.password);
    if (!isCurrentPasswordValid) {
      return { success: false, error: "Hibás jelenlegi jelszó" };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: "A jelszónak legalább 8 karakter hosszúnak kell lennie" };
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update in database
    const db = getDatabase();
    const userIndex = db.users?.findIndex((u) => u.id === this.currentUser.id);

    if (userIndex === -1) {
      return { success: false, error: "Felhasználó nem található" };
    }

    db.users[userIndex].password = hashedPassword;
    persistData("users", db.users);

    // Update current user
    this.currentUser.password = hashedPassword;
    this.saveSession();

    return { success: true };
  }
}

// Export singleton instance
export const authService = new AuthService();
