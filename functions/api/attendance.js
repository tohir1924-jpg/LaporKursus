import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const classId = url.searchParams.get('class_id');
  const date = url.searchParams.get('date');
  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');
  const studentId = url.searchParams.get('student_id');

  try {
    let query = `
      SELECT 
        a.*, 
        s.name as student_name, 
        c.name as class_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN classes c ON a.class_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (classId) {
      query += ` AND a.class_id = ?`;
      params.push(classId);
    }
    if (date) {
      query += ` AND a.attendance_date = ?`;
      params.push(date);
    }
    if (studentId) {
      query += ` AND a.student_id = ?`;
      params.push(studentId);
    }
    if (month && year) {
      query += ` AND strftime('%m', a.attendance_date) = ? AND strftime('%Y', a.attendance_date) = ?`;
      params.push(month.padStart(2, '0'), year);
    }

    query += ` ORDER BY a.attendance_date DESC, s.name ASC`;

    const stmt = env.DB.prepare(query);
    const { results } = await (params.length > 0 ? stmt.bind(...params) : stmt).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data absensi' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
