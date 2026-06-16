import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  
  const classId = url.searchParams.get('class_id');
  const programId = url.searchParams.get('program_id');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');

  try {
    let query = `
      SELECT 
        s.*, 
        c.name as class_name, 
        p.name as program_name 
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN programs p ON s.program_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (classId) {
      query += ` AND s.class_id = ?`;
      params.push(classId);
    }
    if (programId) {
      query += ` AND s.program_id = ?`;
      params.push(programId);
    }
    if (status) {
      query += ` AND s.status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (s.name LIKE ? OR s.phone LIKE ? OR s.guardian_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY s.name ASC`;

    const stmt = env.DB.prepare(query);
    const { results } = await (params.length > 0 ? stmt.bind(...params) : stmt).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch students error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data siswa' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;

  // Authorization check (only admin can create students)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat membuat data siswa' }, 403);
  }

  try {
    const body = await request.json();
    const { class_id, program_id, name, phone, guardian_name, guardian_phone, join_date, note } = body;

    if (!name) {
      return jsonResponse({ success: false, message: 'Nama siswa wajib diisi' }, 400);
    }

    const id = `std_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO students (id, class_id, program_id, name, phone, guardian_name, guardian_phone, join_date, status, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`
    )
    .bind(id, class_id || null, program_id || null, name, phone || null, guardian_name || null, guardian_phone || null, join_date || null, note || null)
    .run();

    return jsonResponse({
      success: true,
      message: 'Siswa berhasil ditambahkan',
      studentId: id
    }, 201);
  } catch (error) {
    console.error('Create student error:', error);
    return jsonResponse({ success: false, message: 'Gagal menambahkan data siswa' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
