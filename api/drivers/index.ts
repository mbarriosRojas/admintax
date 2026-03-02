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

      const drivers = await db.collection('drivers')
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
          {
            $lookup: {
              from: 'vehicles',
              localField: 'vehicleId',
              foreignField: '_id',
              as: 'vehicle'
            }
          },
          { $unwind: { path: '$vehicle', preserveNullAndEmptyArrays: true } },
          { $sort: { createdAt: -1 } }
        ])
        .toArray();

      return sendSuccess(res, drivers);
    }

    if (req.method === 'POST') {
      const { name, licenseNumber, phone, email, cityId, vehicleId, status } = req.body;

      if (!name || !licenseNumber || !phone || !cityId) {
        return sendError(res, 'Name, license number, phone, and city are required', 400);
      }

      const existingDriver = await db.collection('drivers').findOne({ licenseNumber });
      if (existingDriver) {
        return sendError(res, 'Driver with this license number already exists', 400);
      }

      const newDriver: any = {
        name,
        licenseNumber,
        phone,
        cityId: new ObjectId(cityId),
        status: status || 'active',
        createdAt: new Date(),
      };

      if (email) newDriver.email = email;
      if (vehicleId) newDriver.vehicleId = new ObjectId(vehicleId);

      const result = await db.collection('drivers').insertOne(newDriver);
      const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });
      const vehicle = vehicleId ? await db.collection('vehicles').findOne({ _id: new ObjectId(vehicleId) }) : null;

      return sendSuccess(res, {
        _id: result.insertedId,
        ...newDriver,
        city,
        vehicle,
      }, 201);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { name, licenseNumber, phone, email, cityId, vehicleId, status } = req.body;

      if (!id) {
        return sendError(res, 'Driver ID is required', 400);
      }

      const updateData: any = {};
      if (name) updateData.name = name;
      if (licenseNumber) updateData.licenseNumber = licenseNumber;
      if (phone) updateData.phone = phone;
      if (email !== undefined) updateData.email = email;
      if (cityId) updateData.cityId = new ObjectId(cityId);
      if (vehicleId !== undefined) {
        updateData.vehicleId = vehicleId ? new ObjectId(vehicleId) : null;
      }
      if (status) updateData.status = status;

      await db.collection('drivers').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updateData }
      );

      return sendSuccess(res, { message: 'Driver updated successfully' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return sendError(res, 'Driver ID is required', 400);
      }

      await db.collection('drivers').deleteOne({ _id: new ObjectId(id as string) });
      return sendSuccess(res, { message: 'Driver deleted successfully' });
    }

    return sendError(res, 'Method not allowed', 405);
  } catch (error) {
    return handleError(res, error);
  }
}
