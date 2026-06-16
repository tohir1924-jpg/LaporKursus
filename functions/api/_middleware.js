import { jsonResponse, verifyJWT } from './utils';

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Allow API routes for auth to bypass JWT verification
  if (url.pathname.startsWith('/api/auth/')) {
    return next();
  }

  // Allow CORS preflight requests
  if (request.method === 'OPTIONS') {
    return next();
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ success: false, message: 'Autentikasi diperlukan' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = await verifyJWT(token);

  if (!decoded) {
    return jsonResponse({ success: false, message: 'Sesi tidak valid atau kedaluwarsa' }, 401);
  }

  // Store user info in context data for downstream route handlers
  context.data.user = decoded;

  return next();
}
