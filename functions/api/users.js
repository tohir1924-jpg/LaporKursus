import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const role = url.searchParams.get('role') || 'teacher';

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email, role FROM users WHERE role = ? AND status = "active" ORDER BY name ASC'
    )
    .bind(role)
    .all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch users error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data user' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
