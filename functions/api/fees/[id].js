import { jsonResponse } from '../utils';

export async function onRequestPut(context) {
  const { env, params, request, data } = context;
  const feeId = params.id;

  // Authorization check (only admin can modify billing amounts)
  if (data.user.role !== 'admin') {
    return jsonResponse({ success: false, message: 'Hanya Admin yang dapat mengubah nominal tagihan SPP' }, 403);
  }

  try {
    const body = await request.json();
    const { amount, note } = body;

    if (amount === undefined || amount < 0) {
      return jsonResponse({ success: false, message: 'Nominal tagihan harus berupa angka positif' }, 400);
    }

    // 1. Fetch current payments sum for this billing
    const fee = await env.DB.prepare(
      `SELECT 
        amount,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE monthly_fee_id = monthly_fees.id) as total_paid
       FROM monthly_fees WHERE id = ?`
    )
    .bind(feeId)
    .first();

    if (!fee) {
      return jsonResponse({ success: false, message: 'Tagihan tidak ditemukan' }, 404);
    }

    const totalPaid = Number(fee.total_paid || 0);

    if (amount < totalPaid) {
      return jsonResponse({
        success: false,
        message: `Nominal tagihan baru (Rp ${amount.toLocaleString('id-ID')}) tidak boleh lebih kecil dari jumlah yang sudah dibayarkan (Rp ${totalPaid.toLocaleString('id-ID')})`
      }, 400);
    }

    // 2. Recalculate status
    let newStatus = 'unpaid';
    if (totalPaid >= amount && amount > 0) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partial';
    }

    // 3. Update monthly fee
    await env.DB.prepare(
      `UPDATE monthly_fees SET 
        amount = ?, 
        status = ?, 
        note = ?, 
        updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    )
    .bind(Number(amount), newStatus, note || null, feeId)
    .run();

    return jsonResponse({
      success: true,
      message: 'Tagihan SPP berhasil diperbarui',
      newStatus
    });
  } catch (error) {
    console.error('Update fee error:', error);
    return jsonResponse({ success: false, message: 'Gagal memperbarui tagihan SPP' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
