import { jsonResponse } from '../utils';

function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();
    const { template_id, student_id, context: msgContext } = body;

    if (!template_id || !student_id) {
      return jsonResponse({ success: false, message: 'template_id dan student_id wajib diisi' }, 400);
    }

    // 1. Fetch template
    const template = await env.DB.prepare(
      'SELECT content FROM message_templates WHERE id = ? AND status = "active"'
    )
    .bind(template_id)
    .first();

    if (!template) {
      return jsonResponse({ success: false, message: 'Template tidak ditemukan atau tidak aktif' }, 404);
    }

    // 2. Fetch student details with class and program info
    const student = await env.DB.prepare(
      `SELECT 
        s.name as name,
        s.phone as phone,
        s.guardian_name as guardian_name,
        s.guardian_phone as guardian_phone,
        c.name as class_name,
        p.name as program_name,
        c.start_time as start_time
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN programs p ON s.program_id = p.id
       WHERE s.id = ?`
    )
    .bind(student_id)
    .first();

    if (!student) {
      return jsonResponse({ success: false, message: 'Siswa tidak ditemukan' }, 404);
    }

    // 3. Process variables
    let text = template.content;
    const values = {
      nama_siswa: student.name || '',
      nama_wali: student.guardian_name || student.name || '',
      nama_kelas: student.class_name || '',
      nama_program: student.program_name || '',
      jam_mulai: student.start_time || '',
      tanggal: msgContext?.tanggal || new Date().toLocaleDateString('id-ID'),
      bulan: msgContext?.month || '',
      nominal_spp: msgContext?.nominal_spp ? `Rp ${Number(msgContext.nominal_spp).toLocaleString('id-ID')}` : '',
      status_project: msgContext?.status_project || '',
      catatan_project: msgContext?.catatan_project || '',
    };

    // Replace all placeholders
    for (const [key, val] of Object.entries(values)) {
      text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }

    // 4. Resolve recipient phone number (prioritize guardian, fallback to student)
    const rawPhone = student.guardian_phone || student.phone;
    const formattedPhone = formatWhatsAppPhone(rawPhone);
    
    const whatsappUrl = formattedPhone 
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
      : null;

    return jsonResponse({
      success: true,
      message: text,
      recipient_phone: rawPhone || '',
      whatsapp_url: whatsappUrl
    });
  } catch (error) {
    console.error('Preview message error:', error);
    return jsonResponse({ success: false, message: 'Gagal membuat preview pesan' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
