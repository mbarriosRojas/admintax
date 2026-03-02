import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, ObjectId } from '../_lib/mongodb';
import { requireAuth } from '../_lib/auth';
import { sendSuccess, handleError } from '../_lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    requireAuth(req);
    const { db } = await connectToDatabase();

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cityId } = req.query;
    const cityFilter = cityId ? { cityId: new ObjectId(cityId as string) } : {};

    const [
      totalVehicles,
      activeDrivers,
      totalRoutes,
      maintenanceVehicles,
      activeUsers,
      vehiclesByCity,
      driversByCity,
    ] = await Promise.all([
      db.collection('vehicles').countDocuments(cityFilter),
      db.collection('drivers').countDocuments({ ...cityFilter, status: 'active' }),
      db.collection('routes').countDocuments({ ...cityFilter, active: true }),
      db.collection('vehicles').countDocuments({ ...cityFilter, status: 'maintenance' }),
      db.collection('users').countDocuments({ ...cityFilter, active: true }),
      db.collection('vehicles').aggregate([
        ...(cityId ? [{ $match: cityFilter }] : []),
        {
          $lookup: {
            from: 'cities',
            localField: 'cityId',
            foreignField: '_id',
            as: 'city'
          }
        },
        { $unwind: '$city' },
        {
          $group: {
            _id: '$cityId',
            city: { $first: '$city.name' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray(),
      db.collection('drivers').aggregate([
        ...(cityId ? [{ $match: { ...cityFilter, status: 'active' } }] : [{ $match: { status: 'active' } }]),
        {
          $lookup: {
            from: 'cities',
            localField: 'cityId',
            foreignField: '_id',
            as: 'city'
          }
        },
        { $unwind: '$city' },
        {
          $group: {
            _id: '$cityId',
            city: { $first: '$city.name' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray(),
    ]);

    const stats = {
      totalVehicles,
      activeDrivers,
      totalRoutes,
      maintenanceVehicles,
      activeUsers,
      vehiclesByCity: vehiclesByCity.map(item => ({
        city: item.city,
        count: item.count
      })),
      driversByCity: driversByCity.map(item => ({
        city: item.city,
        count: item.count
      })),
    };

    return sendSuccess(res, stats);
  } catch (error) {
    return handleError(res, error);
  }
}
