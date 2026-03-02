import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, ObjectId } from '../_lib/mongodb';
import { requireAuth } from '../_lib/auth';
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

      const routes = await db.collection('routes')
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
          { $sort: { createdAt: -1 } }
        ])
        .toArray();

      return sendSuccess(res, routes);
    }

    if (req.method === 'POST') {
      const { name, origin, destination, distance, estimatedTime, cityId, active } = req.body;

      if (!name || !origin || !destination || distance === undefined || estimatedTime === undefined || !cityId) {
        return sendError(res, 'All fields are required', 400);
      }

      const newRoute = {
        name,
        origin,
        destination,
        distance: parseFloat(distance),
        estimatedTime: parseInt(estimatedTime),
        cityId: new ObjectId(cityId),
        active: active !== undefined ? active : true,
        createdAt: new Date(),
      };

      const result = await db.collection('routes').insertOne(newRoute);
      const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });

      return sendSuccess(res, {
        _id: result.insertedId,
        ...newRoute,
        city,
      }, 201);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, origin, destination, distance, estimatedTime, cityId, active } = req.body;

      if (!id) {
        return sendError(res, 'Route ID is required', 400);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (origin) updateData.origin = origin;
      if (destination) updateData.destination = destination;
      if (distance !== undefined) updateData.distance = parseFloat(distance);
      if (estimatedTime !== undefined) updateData.estimatedTime = parseInt(estimatedTime);
      if (cityId) updateData.cityId = new ObjectId(cityId);
      if (active !== undefined) updateData.active = active;

      await db.collection('routes').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateData }
      );

      return sendSuccess(res, { message: 'Route updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return sendError(res, 'Route ID is required', 400);
      }

      await db.collection('routes').deleteOne({ _id: new ObjectId(id as string) });
      return sendSuccess(res, { message: 'Route deleted successfully' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    return handleError(res, error);
  }
}
