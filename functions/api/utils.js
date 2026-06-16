/**
 * Utility helpers for Cloudflare Pages Functions API
 */

const JWT_SECRET = 'lapor-kursus-secret-key-12345'; // Change in production via env variables

// Helper to format responses
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}

// Lightweight JWT Sign/Verify using Web Crypto API
async function getCryptoKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64url(arr) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(arr)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function signJWT(payload) {
  const key = await getCryptoKey();
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const enc = new TextEncoder();
  const stringHeader = base64url(enc.encode(JSON.stringify(header)));
  const stringPayload = base64url(enc.encode(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiry
  })));

  const message = `${stringHeader}.${stringPayload}`;
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(message)
  );

  const stringSignature = base64url(signature);
  return `${message}.${stringSignature}`;
}

export async function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const key = await getCryptoKey();
    
    const enc = new TextEncoder();
    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(signature),
      enc.encode(`${header}.${payload}`)
    );

    if (!verified) return null;

    const decodedPayload = JSON.parse(new TextDecoder().decode(base64urlDecode(payload)));
    
    // Check expiry
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}

// Simple SHA-256 helper for password verification
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
