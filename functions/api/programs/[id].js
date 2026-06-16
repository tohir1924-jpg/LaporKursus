import { jsonResponse } from '../utils';

export async function onRequestPut(context) {
  const { env, params, request, data } = context;
  const programId = params.id;

  // Authorization check (only admin can edit programs)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat mengubah program' }, 403);
  }

  try {
    const body = await request.json();
    const { name, description, default_fee, status } = body;

    if (!name) {
      return jsonResponse({ success: false, message: 'Nama program wajib diisi' }, 400);
    }

    await env.DB.prepare(
      `UPDATE programs SET 
        name = ?, 
        description = ?, 
        default_fee = ?, 
        status = ?, 
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(name, description || null, Number(default_fee) || 0, status || 'active', programId)
    .run();

    return jsonResponse({ success: true, message: 'Program berhasil diperbarui' });
  } catch (error) {
    console.error('Update program error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengubah program' }, 500);
  }
}

export async function onRequestDelete(context) {
  const { env, params, data } = context;
  const programId = params.id;

  // Authorization check (only admin can deactivate programs)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat menonaktifkan program' }, 403);
  }

  try {
    // Soft delete - set status to inactive
    await env.DB.prepare(
      `UPDATE programs SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .bind(programId)
    .run();

    return jsonResponse({ success: true, message: 'Program berhasil dinonaktifkan' });
  } catch (error) {
    console.error('Deactivate program error:', error);
    return jsonResponse({ success: false, message: 'Gagal menonaktifkan program' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
