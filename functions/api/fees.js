import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');
  const status = url.searchParams.get('status');
  const studentId = url.searchParams.get('student_id');

  try {
    let query = `
      SELECT 
        f.*, 
        s.name as student_name, 
        c.name as class_name,
        (SELECT SUM(amount) FROM payments WHERE monthly_fee_id = f.id) as total_paid
      FROM monthly_fees f
      JOIN students s ON f.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (month) {
      query += ` AND f.month = ?`;
      params.push(Number(month));
    }
    if (year) {
      query += ` AND f.year = ?`;
      params.push(Number(year));
    }
    if (status) {
      query += ` AND f.status = ?`;
      params.push(status);
    }
    if (studentId) {
      query += ` AND f.student_id = ?`;
      params.push(studentId);
    }

    query += ` ORDER BY s.name ASC`;

    const stmt = env.DB.prepare(query);
    const { results } = await (params.length > 0 ? stmt.bind(...params) : stmt).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch fees error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data tagihan' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
