import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, ObjectId } from '../_lib/mongodb';
import { hashPassword, generateToken } from '../_lib/auth';
import { sendSuccess, sendError, handleError } from '../_lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { email, password, name, role, cityId } = req.body;

    if (!email || !password || !name || !role || !cityId) {
      return sendError(res, 'All fields are required', 400);
    }

    const { db } = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      email,
      password: hashedPassword,
      name,
      role,
      cityId: new ObjectId(cityId),
      active: true,
      createdAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });

    const token = generateToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return sendSuccess(res, {
      token,
      user: {
        _id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        cityId: newUser.cityId,
        city,
        active: newUser.active,
        createdAt: newUser.createdAt,
      },
    }, 201);
  } catch (error) {
    return handleError(res, error);
  }
}
