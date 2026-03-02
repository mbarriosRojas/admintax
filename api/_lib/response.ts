import { VercelResponse } from '@vercel/node';

export function sendSuccess(res: VercelResponse, data: any, status = 200) {
  return res.status(status).json(data);
}

export function sendError(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ message });
}

export function handleError(res: VercelResponse, error: any) {
  console.error('API Error:', error);
  const message = error.message || 'Internal server error';
  const status = error.status || 500;
  return sendError(res, message, status);
}
