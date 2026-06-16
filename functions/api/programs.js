import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'active';

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM programs WHERE status = ? ORDER BY name ASC'
    )
    .bind(status)
    .all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch programs error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data program' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;

  // Authorization check (only admin can create programs)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat membuat program baru' }, 403);
  }

  try {
    const body = await request.json();
    const { name, description, default_fee } = body;

    if (!name) {
      return jsonResponse({ success: false, message: 'Nama program wajib diisi' }, 400);
    }

    const id = `prog_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO programs (id, name, description, default_fee, status) 
       VALUES (?, ?, ?, ?, 'active')`
    )
    .bind(id, name, description || null, default_fee || 0)
    .run();

    return jsonResponse({
      success: true,
      message: 'Program berhasil dibuat',
      programId: id
    }, 201);
  } catch (error) {
    console.error('Create program error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat program baru' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
