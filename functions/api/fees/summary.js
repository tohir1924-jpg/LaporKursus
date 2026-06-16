import { jsonResponse } from '../utils';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const month = url.searchParams.get('month');
  const year = url.searchParams.get('year');

  if (!month || !year) {
    return jsonResponse({ success: false, message: 'month dan year wajib diisi' }, 400);
  }

  const formattedMonth = month.padStart(2, '0');

  try {
    // 1. Total revenue collected in this month (by payment date)
    const revenueRow = await env.DB.prepare(
      `SELECT COALESCE(SUM(amount), 0) as total_revenue 
       FROM payments 
       WHERE strftime('%m', payment_date) = ? AND strftime('%Y', payment_date) = ?`
    )
    .bind(formattedMonth, year)
    .first();

    // 2. Total outstanding debt (unpaid/partial amount across all bills)
    const debtRow = await env.DB.prepare(
      `SELECT 
        COALESCE(
          SUM(
            amount - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE monthly_fee_id = monthly_fees.id)
          ), 
          0
        ) as total_tunggakan,
        COUNT(id) as total_unpaid_count
       FROM monthly_fees 
       WHERE status IN ('unpaid', 'partial')`
    )
    .first();

    // 3. Stats for the selected month
    const statsRow = await env.DB.prepare(
      `SELECT 
        COUNT(id) as total_bills,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_bills,
        SUM(CASE WHEN status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_bills,
        SUM(CASE WHEN status = 'partial' THEN 1 ELSE 0 END) as partial_bills
       FROM monthly_fees
       WHERE month = ? AND year = ?`
    )
    .bind(Number(month), Number(year))
    .first();

    const totalBills = Number(statsRow?.total_bills || 0);
    const paidBills = Number(statsRow?.paid_bills || 0);
    const unpaidBills = Number(statsRow?.unpaid_bills || 0);
    const partialBills = Number(statsRow?.partial_bills || 0);

    return jsonResponse({
      revenue: Number(revenueRow?.total_revenue || 0),
      tunggakan: Number(debtRow?.total_tunggakan || 0),
      tunggakan_students: Number(debtRow?.total_unpaid_count || 0),
      month_stats: {
        total_bills: totalBills,
        paid_bills: paidBills,
        unpaid_bills: unpaidBills,
        partial_bills: partialBills,
        lunas_percentage: totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Fetch fees summary error:', error);
    return jsonResponse({ success: false, message: 'Gagal mengambil rekap SPP' }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
