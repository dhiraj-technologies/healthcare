import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { db, User } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'carehealth-secret-clinical-jwt-token-key-2025';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'nurse' | 'patient';
  name: string;
  patientId?: string;
  nurseId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function generateToken(user: User): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    patientId: user.patientId,
    nurseId: user.nurseId
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token. Please sign in again.' });
  }
}

export function requireRole(allowedRoles: Array<'admin' | 'nurse' | 'patient'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Permission denied. Access restricted to roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }
    next();
  };
}
