import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, ObjectId } from '../_lib/mongodb';
import { requireAuth, hashPassword } from '../_lib/auth';
import { sendSuccess, sendError, handleError } from '../_lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    requireAuth(req);
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      const { cityId } = req.query;
      const query: any = {};
      
      if (cityId) {
        query.cityId = new ObjectId(cityId as string);
      }

      const users = await db.collection('users')
        .aggregate([
          { $match: query },
          {
            $lookup: {
              from: 'cities',
              localField: 'cityId',
              foreignField: '_id',
              as: 'city'
            }
          },
          { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
          { $project: { password: 0 } },
          { $sort: { createdAt: -1 } }
        ])
        .toArray();

      return sendSuccess(res, users);
    }

    if (req.method === 'POST') {
      const { email, password, name, role, cityId, active } = req.body;

      if (!email || !password || !name || !role || !cityId) {
        return sendError(res, 'All fields are required', 400);
      }

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
        active: active !== undefined ? active : true,
        createdAt: new Date(),
      };

      const result = await db.collection('users').insertOne(newUser);
      const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });

      return sendSuccess(res, {
        _id: result.insertedId,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        cityId: newUser.cityId,
        city,
        active: newUser.active,
        createdAt: newUser.createdAt,
      }, 201);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { email, password, name, role, cityId, active } = req.body;

      if (!id) {
        return sendError(res, 'User ID is required', 400);
      }

      const updateData: any = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;
      if (role) updateData.role = role;
      if (cityId) updateData.cityId = new ObjectId(cityId);
      if (active !== undefined) updateData.active = active;
      if (password) {
        updateData.password = await hashPassword(password);
      }

      await db.collection('users').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateData }
      );

      return sendSuccess(res, { message: 'User updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return sendError(res, 'User ID is required', 400);
      }

      await db.collection('users').deleteOne({ _id: new ObjectId(id as string) });
      return sendSuccess(res, { message: 'User deleted successfully' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    return handleError(res, error);
  }
}
