import { JWTService, JWTPayload } from './jwt';
import { UserType } from '@/types/auth';

export class AuthService {
  /**
   * Validate a JWT token and return user information
   */
  static async validateToken(token: string): Promise<UserType | null> {
    try {
      const payload = JWTService.verifyToken(token);
      if (!payload) return null;

      // In a real application, you might want to fetch fresh user data from your database
      // For now, we'll reconstruct the user from the JWT payload
      const user: UserType = {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role as any,
        isActive: true, // Assume active if token is valid
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  /**
   * Check if a token is valid and not expired
   */
  static async isTokenValid(token: string): Promise<boolean> {
    const payload = JWTService.verifyToken(token);
    return payload !== null;
  }

  /**
   * Get user information from a valid token
   */
  static async getUserFromToken(token: string): Promise<UserType | null> {
    return this.validateToken(token);
  }

  /**
   * Check if token needs refresh
   */
  static shouldRefreshToken(token: string): boolean {
    return JWTService.shouldRefreshToken(token);
  }

  /**
   * Generate a new token for a user
   */
  static generateTokenForUser(user: UserType): string {
    return JWTService.generateToken(user);
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Get token expiration info
   */
  static getTokenInfo(token: string): {
    isValid: boolean;
    isExpired: boolean;
    expiresAt: Date | null;
    payload: JWTPayload | null;
  } {
    const payload = JWTService.decodeToken(token);
    const isValid = JWTService.verifyToken(token) !== null;
    const isExpired = JWTService.isTokenExpired(token);
    const expiresAt = JWTService.getTokenExpiration(token);

    return {
      isValid,
      isExpired,
      expiresAt,
      payload,
    };
  }
}

