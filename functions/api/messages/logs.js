import { jsonResponse } from '../utils';

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      `SELECT 
        l.*, 
        s.name as student_name,
        u.name as sender_name
       FROM message_logs l
       LEFT JOIN students s ON l.student_id = s.id
       LEFT JOIN users u ON l.created_by = u.id
       ORDER BY l.created_at DESC`
    )
    .all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch message logs error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil log pesan' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;

  try {
    const body = await request.json();
    const { student_id, template_id, recipient_phone, message_type, message_content, status } = body;

    if (!recipient_phone || !message_content) {
      return jsonResponse({ success: false, message: 'Data log tidak lengkap' }, 400);
    }

    const id = `log_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO message_logs (id, student_id, template_id, recipient_phone, message_type, message_content, channel, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 'whatsapp_link', ?, ?)`
    )
    .bind(
      id,
      student_id || null,
      template_id || null,
      recipient_phone,
      message_type || 'general',
      message_content,
      status || 'sent_manual',
      data.user.userId
    )
    .run();

    return jsonResponse({ success: true, message: 'Log pesan berhasil disimpan', logId: id }, 201);
  } catch (error) {
    console.error('Create message log error:', error);
    return jsonResponse({ success: false, message: 'Gagal menyimpan log pesan' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
