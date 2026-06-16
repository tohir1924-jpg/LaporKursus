import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const studentId = url.searchParams.get('student_id');
  const classId = url.searchParams.get('class_id');
  const status = url.searchParams.get('status');

  try {
    let query = `
      SELECT 
        p.*, 
        s.name as student_name, 
        c.name as class_name
      FROM student_projects p
      JOIN students s ON p.student_id = s.id
      LEFT JOIN classes c ON p.class_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (studentId) {
      query += ` AND p.student_id = ?`;
      params.push(studentId);
    }
    if (classId) {
      query += ` AND p.class_id = ?`;
      params.push(classId);
    }
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY p.updated_at DESC`;

    const stmt = env.DB.prepare(query);
    const { results } = await (params.length > 0 ? stmt.bind(...params) : stmt).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data project' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();
    const { student_id, class_id, title, description, start_date, target_date, status, progress, project_link } = body;

    if (!student_id || !title) {
      return jsonResponse({ success: false, message: 'Siswa dan judul project wajib diisi' }, 400);
    }

    const id = `prj_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO student_projects (id, student_id, class_id, title, description, start_date, target_date, status, progress, project_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      student_id,
      class_id || null,
      title,
      description || null,
      start_date || null,
      target_date || null,
      status || 'not_started',
      progress || 0,
      project_link || null
    )
    .run();

    return jsonResponse({ success: true, message: 'Project berhasil dibuat', projectId: id }, 201);
  } catch (error) {
    console.error('Create project error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat project siswa' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
