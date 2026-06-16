import { jsonResponse } from './utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'active';

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM message_templates WHERE status = ? ORDER BY name ASC'
    )
    .bind(status)
    .all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Fetch templates error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil data template' }, 500);
  }
}

export async function onRequestPost(context) {
  const { env, request, data } = context;

  // Authorization check (only admin can create templates)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat membuat template pesan' }, 403);
  }

  try {
    const body = await request.json();
    const { name, type, content } = body;

    if (!name || !type || !content) {
      return jsonResponse({ success: false, message: 'Data template tidak lengkap' }, 400);
    }

    const id = `tpl_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    await env.DB.prepare(
      `INSERT INTO message_templates (id, name, type, content, status) 
       VALUES (?, ?, ?, ?, 'active')`
    )
    .bind(id, name, type, content)
    .run();

    return jsonResponse({
      success: true,
      message: 'Template berhasil dibuat',
      templateId: id
    }, 201);
  } catch (error) {
    console.error('Create template error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat template baru' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
