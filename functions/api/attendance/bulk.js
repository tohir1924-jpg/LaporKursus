import { jsonResponse } from '../utils';

export async function onRequestPost(context) {
  const { env, request, data } = context;

  try {
    const body = await request.json();
    const { class_id, attendance_date, records } = body;

    if (!class_id || !attendance_date || !records || !Array.isArray(records)) {
      return jsonResponse({ success: false, message: 'Data absensi tidak lengkap' }, 400);
    }

    const statements = [];

    for (const record of records) {
      const { student_id, status, late_minutes, note } = record;

      if (!student_id || !status) {
        continue; // Skip invalid records
      }

      // Generate a new ID for insert, but if conflict occurs, we update existing row.
      const id = `att_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

      statements.push(
        env.DB.prepare(
          `INSERT INTO attendance (id, student_id, class_id, attendance_date, status, late_minutes, note, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(student_id, class_id, attendance_date) DO UPDATE SET
             status = excluded.status,
             late_minutes = excluded.late_minutes,
             note = excluded.note,
             updated_at = CURRENT_TIMESTAMP`
        )
        .bind(
          id,
          student_id,
          class_id,
          attendance_date,
          status,
          late_minutes || 0,
          note || null,
          data.user.userId
        )
      );
    }

    if (statements.length > 0) {
      await env.DB.batch(statements);
    }

    return jsonResponse({
      success: true,
      message: `Berhasil menyimpan ${statements.length} data absensi`
    });
  } catch (error) {
    console.error('Bulk attendance save error:', error);
    return jsonResponse({ success: false, message: 'Gagal menyimpan data absensi' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
