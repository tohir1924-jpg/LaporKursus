import { jsonResponse } from '../utils';

export async function onRequestGet(context) {
  const { env, params } = context;
  const studentId = params.id;

  try {
    const student = await env.DB.prepare(
      `SELECT 
        s.*, 
        c.name as class_name, 
        p.name as program_name 
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN programs p ON s.program_id = p.id
       WHERE s.id = ?`
    )
    .bind(studentId)
    .first();

    if (!student) {
      return jsonResponse({ success: false, message: 'Siswa tidak ditemukan' }, 404);
    }

    return jsonResponse(student);
  } catch (error) {
    console.error('Fetch student detail error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil detail siswa' }, 500);
  }
}

export async function onRequestPut(context) {
  const { env, params, request, data } = context;
  const studentId = params.id;

  // Authorization check (only admin can edit students)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat mengubah data siswa' }, 403);
  }

  try {
    const body = await request.json();
    const { class_id, program_id, name, phone, guardian_name, guardian_phone, join_date, status, note } = body;

    if (!name) {
      return jsonResponse({ success: false, message: 'Nama siswa wajib diisi' }, 400);
    }

    await env.DB.prepare(
      `UPDATE students SET 
        class_id = ?, 
        program_id = ?, 
        name = ?, 
        phone = ?, 
        guardian_name = ?, 
        guardian_phone = ?, 
        join_date = ?, 
        status = ?, 
        note = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(
      class_id || null, 
      program_id || null, 
      name, 
      phone || null, 
      guardian_name || null, 
      guardian_phone || null, 
      join_date || null, 
      status || 'active', 
      note || null,
      studentId
    )
    .run();

    return jsonResponse({ success: true, message: 'Siswa berhasil diperbarui' });
  } catch (error) {
    console.error('Update student error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengubah data siswa' }, 500);
  }
}

export async function onRequestDelete(context) {
  const { env, params, data } = context;
  const studentId = params.id;

  // Authorization check (only admin can delete/deactivate students)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat menonaktifkan siswa' }, 403);
  }

  try {
    // Soft delete - set status to inactive
    await env.DB.prepare(
      `UPDATE students SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .bind(studentId)
    .run();

    return jsonResponse({ success: true, message: 'Siswa berhasil dinonaktifkan' });
  } catch (error) {
    console.error('Deactivate student error:', error);
    return jsonResponse({ success: false, message: 'Gagal menonaktifkan siswa' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
