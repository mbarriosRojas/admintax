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

      const vehicles = await db.collection('vehicles')
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

      return sendSuccess(res, vehicles);
    }

    if (req.method === 'POST') {
      const { plate, brand, model, year, color, cityId, status } = req.body;

      if (!plate || !brand || !model || !year || !color || !cityId) {
        return sendError(res, 'All fields are required', 400);
      }

      const existingVehicle = await db.collection('vehicles').findOne({ plate });
      if (existingVehicle) {
        return sendError(res, 'Vehicle with this plate already exists', 400);
      }

      const newVehicle = {
        plate,
        brand,
        model,
        year: parseInt(year),
        color,
        cityId: new ObjectId(cityId),
        status: status || 'active',
        createdAt: new Date(),
      };

      const result = await db.collection('vehicles').insertOne(newVehicle);
      const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });

      return sendSuccess(res, {
        _id: result.insertedId,
        ...newVehicle,
        city,
      }, 201);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { plate, brand, model, year, color, cityId, status } = req.body;

      if (!id) {
        return sendError(res, 'Vehicle ID is required', 400);
      }

      const updateData: any = {};
      if (plate) updateData.plate = plate;
      if (brand) updateData.brand = brand;
      if (model) updateData.model = model;
      if (year) updateData.year = parseInt(year);
      if (color) updateData.color = color;
      if (cityId) updateData.cityId = new ObjectId(cityId);
      if (status) updateData.status = status;

      await db.collection('vehicles').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateData }
      );

      return sendSuccess(res, { message: 'Vehicle updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return sendError(res, 'Vehicle ID is required', 400);
      }

      await db.collection('vehicles').deleteOne({ _id: new ObjectId(id as string) });
      return sendSuccess(res, { message: 'Vehicle deleted successfully' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    return handleError(res, error);
  }
}
