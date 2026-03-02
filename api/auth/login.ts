import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../_lib/mongodb';
import { generateToken, comparePassword } from '../_lib/auth';
import { sendSuccess, sendError, handleError } from '../_lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (!user.active) {
      return sendError(res, 'User account is inactive', 401);
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const city = await db.collection('cities').findOne({ _id: user.cityId });

    return sendSuccess(res, {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        cityId: user.cityId,
        city,
        active: user.active,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
}
