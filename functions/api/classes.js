import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'active';

  try {
    const query = `
      SELECT 
        c.*, 
        p.name as program_name, 
        u.name as teacher_name
      FROM classes c
      LEFT JOIN programs p ON c.program_id = p.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE c.status = ?
      ORDER BY c.name ASC
    `;
    const { results } = await env.DB.prepare(query).bind(status).all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch classes error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data kelas' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;

  // Authorization check (only admin can create classes)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat membuat kelas baru' }, 403);
  }

  try {
    const body = await request.json();
    const { name, program_id, teacher_id, day_name, start_time, end_time } = body;

    if (!name || !program_id) {
      return jsonResponse({ success: false, message: 'Nama kelas dan program wajib diisi' }, 400);
    }

    const id = `cls_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO classes (id, program_id, teacher_id, name, day_name, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`
    )
    .bind(id, program_id, teacher_id || null, name, day_name || null, start_time || null, end_time || null)
    .run();

    return jsonResponse({
      success: true,
      message: 'Kelas berhasil dibuat',
      classId: id
    }, 201);
  } catch (error) {
    console.error('Create class error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat kelas baru' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
