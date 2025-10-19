import jwt from 'jsonwebtoken';
import { UserType } from '@/types/auth';
import { config } from '@/lib/config';

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export class JWTService {
  /**
   * Generate a JWT token for a user
   */
  static generateToken(user: UserType): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'martclinic-direct',
      audience: 'martclinic-users'
    });
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'martclinic-direct',
        audience: 'martclinic-users'
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Decode a JWT token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }

  /**
   * Check if a token is expired
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return null;
    
    return new Date(payload.exp * 1000);
  }

  /**
   * Refresh a token if it's close to expiration
   */
  static shouldRefreshToken(token: string, refreshThresholdMinutes: number = 30): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = payload.exp;
    const timeUntilExpiry = expirationTime - currentTime;
    const thresholdSeconds = refreshThresholdMinutes * 60;
    
    return timeUntilExpiry < thresholdSeconds;
  }
}
