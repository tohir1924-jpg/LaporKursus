import { jsonResponse } from '../utils';

export async function onRequestPut(context) {
  const { env, params, request } = context;
  const projectId = params.id;

  try {
    const body = await request.json();
    const { class_id, title, description, start_date, target_date, status, progress, project_link } = body;

    if (!title) {
      return jsonResponse({ success: false, message: 'Judul project wajib diisi' }, 400);
    }

    await env.DB.prepare(
      `UPDATE student_projects SET 
        class_id = ?, 
        title = ?, 
        description = ?, 
        start_date = ?, 
        target_date = ?, 
        status = ?, 
        progress = ?, 
        project_link = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .bind(
      class_id || null,
      title,
      description || null,
      start_date || null,
      target_date || null,
      status || 'not_started',
      progress || 0,
      project_link || null,
      projectId
    )
    .run();

    return jsonResponse({ success: true, message: 'Project berhasil diperbarui' });
  } catch (error) {
    console.error('Update project error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengubah data project' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
