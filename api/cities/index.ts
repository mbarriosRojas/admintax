import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, ObjectId } from '../_lib/mongodb';
import { requireAuth } from '../_lib/auth';
import { sendSuccess, sendError, handleError } from '../_lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    requireAuth(req);
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      const cities = await db.collection('cities').find({}).sort({ name: 1 }).toArray();
      return sendSuccess(res, cities);
    }

    if (req.method === 'POST') {
      const { name, country, timezone, active } = req.body;

      if (!name || !country || !timezone) {
        return sendError(res, 'Name, country, and timezone are required', 400);
      }

      const newCity = {
        name,
        country,
        timezone,
        active: active !== undefined ? active : true,
        createdAt: new Date(),
      };

      const result = await db.collection('cities').insertOne(newCity);
      return sendSuccess(res, { _id: result.insertedId, ...newCity }, 201);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, country, timezone, active } = req.body;

      if (!id) {
        return sendError(res, 'City ID is required', 400);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (country) updateData.country = country;
      if (timezone) updateData.timezone = timezone;
      if (active !== undefined) updateData.active = active;

      await db.collection('cities').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateData }
      );

      return sendSuccess(res, { message: 'City updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return sendError(res, 'City ID is required', 400);
      }

      await db.collection('cities').deleteOne({ _id: new ObjectId(id as string) });
      return sendSuccess(res, { message: 'City deleted successfully' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    return handleError(res, error);
  }
}
