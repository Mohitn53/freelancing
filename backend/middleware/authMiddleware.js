/**
 * middleware/authMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. verifyToken   – validates the Supabase JWT from the Authorization header
 * 2. requireRole   – factory that checks the user's role in the profiles table
 * ─────────────────────────────────────────────────────────────────────────────
 */

import jwt from 'jsonwebtoken';
import supabase from '../config/supabaseClient.js';

// ─── 1. JWT Verification ──────────────────────────────────────────────────────
/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * On success, attaches `req.user` (decoded JWT payload) to the request.
 *
 * @example
 *   Authorization: Bearer <supabase_jwt>
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify signature against Supabase JWT secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

    // Attach the decoded payload so downstream handlers can use it
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    return res
      .status(401)
      .json({ success: false, message: 'Invalid token.' });
  }
};

// ─── 2. Role-based authorisation ─────────────────────────────────────────────
/**
 * Factory middleware.  Pass one or more allowed role strings.
 * Looks up the user's role in the `profiles` table.
 *
 * @param  {...string} roles  e.g.  requireRole('admin')
 *                             or   requireRole('admin', 'moderator')
 */
export const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.sub) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthenticated.' });
      }

      // Fetch the user's profile to get their role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.sub)
        .single();

      if (error || !profile) {
        return res
          .status(403)
          .json({ success: false, message: 'User profile not found.' });
      }

      if (!roles.includes(profile.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}.`,
        });
      }

      // Attach role to request for convenient downstream use
      req.userRole = profile.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};
