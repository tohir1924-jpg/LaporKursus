import { jsonResponse } from '../utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const classId = url.searchParams.get('class_id');
  const month = url.searchParams.get('month'); // e.g. "06" or "6"
  const year = url.searchParams.get('year');   // e.g. "2026"

  if (!classId || !month || !year) {
    return jsonResponse({ success: false, message: 'class_id, month, and year are required' }, 400);
  }

  const formattedMonth = month.padStart(2, '0');

  try {
    const query = `
      SELECT 
        s.id as student_id,
        s.name,
        SUM(CASE WHEN a.status = 'H' THEN 1 ELSE 0 END) as H,
        SUM(CASE WHEN a.status = 'A' THEN 1 ELSE 0 END) as A,
        SUM(CASE WHEN a.status = 'I' THEN 1 ELSE 0 END) as I,
        SUM(CASE WHEN a.status = 'T' THEN 1 ELSE 0 END) as T,
        COUNT(a.id) as total_meetings
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id 
        AND a.class_id = ?
        AND strftime('%m', a.attendance_date) = ?
        AND strftime('%Y', a.attendance_date) = ?
      WHERE s.class_id = ? AND s.status = 'active'
      GROUP BY s.id, s.name
      ORDER BY s.name ASC
    `;

    const { results } = await env.DB.prepare(query)
      .bind(classId, formattedMonth, year, classId)
      .all();

    const processedStudents = results.map(row => {
      const H = Number(row.H || 0);
      const A = Number(row.A || 0);
      const I = Number(row.I || 0);
      const T = Number(row.T || 0);
      const total = Number(row.total_meetings || 0);

      let warning = null;
      if (total > 0) {
        const rate = (H + T) / total;
        if (A >= 2) {
          warning = 'sering_alpa';
        } else if (T >= 3) {
          warning = 'sering_telat';
        } else if (rate < 0.75) {
          warning = 'kehadiran_rendah';
        }
      }

      return {
        student_id: row.student_id,
        name: row.name,
        H,
        A,
        I,
        T,
        total_meetings: total,
        warning
      };
    });

    return jsonResponse({
      class_id: classId,
      month: Number(month),
      year: Number(year),
      students: processedStudents
    });
  } catch (error) {
    console.error('Fetch attendance summary error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil rekap absensi' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
