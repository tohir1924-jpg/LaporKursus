import { jsonResponse } from '../utils';

export async function onRequestPost() {
  // Clear cookie/session token on client side.
  // The API simply returns success.
  return jsonResponse({ success: true, message: 'Logout berhasil' });
}

export async function onRequestOptions() {
  return jsonResponse({}, 200);
}
