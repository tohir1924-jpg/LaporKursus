import { jsonResponse } from '../../utils';

export async function onRequestPost(context) {
  const { env, params, request, data } = context;
  const feeId = params.id;

  try {
    const body = await request.json();
    const { payment_date, amount, method, note } = body;

    if (!payment_date || !amount || amount <= 0) {
      return jsonResponse({ success: false, message: 'Tanggal pembayaran dan nominal harus valid' }, 400);
    }

    // 1. Fetch the monthly fee details and current sum of payments
    const fee = await env.DB.prepare(
      `SELECT 
        amount, 
        status,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE monthly_fee_id = ?) as total_paid
       FROM monthly_fees WHERE id = ?`
    )
    .bind(feeId, feeId)
    .first();

    if (!fee) {
      return jsonResponse({ success: false, message: 'Tagihan SPP tidak ditemukan' }, 404);
    }

    const billAmount = fee.amount;
    const currentPaid = fee.total_paid;
    const newTotalPaid = currentPaid + amount;

    // 2. Determine new status
    let newStatus = 'unpaid';
    if (newTotalPaid >= billAmount) {
      newStatus = 'paid';
    } else if (newTotalPaid > 0) {
      newStatus = 'partial';
    }

    const paymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

    // 3. Execute insertion and update in batch transaction
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO payments (id, monthly_fee_id, payment_date, amount, method, note, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(paymentId, feeId, payment_date, amount, method || 'cash', note || null, data.user.userId),
      
      env.DB.prepare(
        `UPDATE monthly_fees SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      )
      .bind(newStatus, feeId)
    ]);

    return jsonResponse({
      success: true,
      message: 'Pembayaran berhasil dicatat',
      paymentId,
      newStatus
    });
  } catch (error) {
    console.error('Record payment error:', error);
    return jsonResponse({ success: false, message: 'Gagal mencatat pembayaran SPP' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
