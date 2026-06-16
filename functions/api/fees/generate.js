import { jsonResponse } from '../utils';

export async function onRequestPost(context) {
  const { env, request, data } = context;

  // Authorization check (only admin can generate billing)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat membuat tagihan SPP' }, 403);
  }

  try {
    const body = await request.json();
    const { month, year, class_id } = body;

    if (!month || !year || !class_id) {
      return jsonResponse({ success: false, message: 'class_id, month, dan year wajib diisi' }, 400);
    }

    // 1. Fetch active students in the class with their program default fee
    const students = await env.DB.prepare(
      `SELECT s.id, p.default_fee 
       FROM students s
       LEFT JOIN programs p ON s.program_id = p.id
       WHERE s.class_id = ? AND s.status = 'active'`
    )
    .bind(class_id)
    .all();

    if (!students.results || students.results.length === 0) {
      return jsonResponse({ success: true, message: 'Tidak ada siswa aktif di kelas ini untuk ditagih' });
    }

    // 2. Fetch existing bills for this month and year
    const existingBills = await env.DB.prepare(
      `SELECT student_id FROM monthly_fees WHERE month = ? AND year = ?`
    )
    .bind(Number(month), Number(year))
    .all();

    const existingStudentIds = new Set((existingBills.results || []).map(b => b.student_id));

    // 3. Filter students and prepare insert statements
    const statements = [];
    const dueDate = `${year}-${String(month).padStart(2, '0')}-10`; // Due on the 10th of that month

    for (const student of students.results) {
      if (existingStudentIds.has(student.id)) {
        continue; // Skip if bill already generated (idempotent rule)
      }

      const id = `fee_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;
      const amount = student.default_fee || 0;

      statements.push(
        env.DB.prepare(
          `INSERT INTO monthly_fees (id, student_id, month, year, amount, status, due_date)
           VALUES (?, ?, ?, ?, ?, 'unpaid', ?)`
        )
        .bind(id, student.id, Number(month), Number(year), amount, dueDate)
      );
    }

    if (statements.length > 0) {
      await env.DB.batch(statements);
    }

    return jsonResponse({
      success: true,
      message: `Berhasil membuat ${statements.length} tagihan SPP baru`
    });
  } catch (error) {
    console.error('Generate fees error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat tagihan SPP' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
