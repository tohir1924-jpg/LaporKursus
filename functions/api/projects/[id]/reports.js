import { jsonResponse } from '../../utils';

export async function onRequestGet(context) {
  const { env, params } = context;
  const projectId = params.id;

  try {
    const { results } = await env.DB.prepare(
      `SELECT 
        r.*, 
        u.name as teacher_name
       FROM project_reports r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.project_id = ?
       ORDER BY r.report_date DESC, r.created_at DESC`
    )
    .bind(projectId)
    .all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch project reports error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil riwayat laporan project' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, params, request, data } = context;
  const projectId = params.id;

  try {
    const body = await request.json();
    const { report_date, progress, status, teacher_note, next_target, feedback } = body;

    if (!report_date || progress === undefined || !status) {
      return jsonResponse({ success: false, message: 'Tanggal laporan, progress, dan status wajib diisi' }, 400);
    }

    const reportId = `rep_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    // Update the main project state and insert report in a transaction batch
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO project_reports (id, project_id, report_date, progress, status, teacher_note, next_target, feedback, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        reportId,
        projectId,
        report_date,
        Number(progress),
        status,
        teacher_note || null,
        next_target || null,
        feedback || null,
        data.user.userId
      ),

      env.DB.prepare(
        `UPDATE student_projects SET 
          progress = ?, 
          status = ?, 
          updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`
      )
      .bind(Number(progress), status, projectId)
    ]);

    return jsonResponse({
      success: true,
      message: 'Laporan perkembangan project berhasil ditambahkan',
      reportId
    }, 201);
  } catch (error) {
    console.error('Create project report error:', error);
    return jsonResponse({ success: false, message: 'Gagal menyimpan laporan project' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
