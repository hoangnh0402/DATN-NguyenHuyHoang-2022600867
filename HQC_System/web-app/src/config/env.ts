// Copyright (c) 2025 HQC System Contributors
// Licensed under the GNU General Public License v3.0 (GPL-3.0)

import Constants from 'expo-constants';

// =============================================================================
// CORE API URL HELPERS
// =============================================================================

/**
 * Parse và làm sạch giá trị URL - loại bỏ key nếu có trong giá trị
 */
const getRawApiBaseUrl = (): string => {
  const fromExpoConfig = (Constants.expoConfig?.extra as any)?.apiBaseUrl;
  const fromProcessEnv = typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_BASE_URL : undefined;
  
  let result = fromExpoConfig || fromProcessEnv;

  // Trên web production: ưu tiên gọi cùng origin qua reverse proxy (/api/v1)
  // để tránh hardcode domain và tránh lỗi mixed-content/CORS.
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.');

    if (!isLocalHost) {
      console.log('[ENV] Non-local web host detected, using relative API path');
      return '/api/v1';
    }
  }
  
  // Fallback về localhost cho development
  if (!result) {
    result = 'http://localhost:8000/api/v1';
  }
  
  // Debug log - sẽ hiển thị trong browser console
  console.log('[ENV] API URL sources:', {
    fromExpoConfig: fromExpoConfig || 'undefined',
    fromProcessEnv: fromProcessEnv || 'undefined',
    finalResult: result
  });
  
  return result;
};

/**
 * Normalize API base URL - đảm bảo luôn kết thúc bằng /api/v1
 */
const normalizeApiBase = (base: string): string => {
  const trimmed = base.replace(/\/+$/, '');
  if (/\/api\/v1$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api/v1`;
};

/**
 * API Base URL - Đã normalize
 * Đây là nguồn duy nhất cho tất cả các API endpoints
 * 
 * Ví dụ: http://your-tunnel.trycloudflare.com/api/v1
 */
const rawUrl = getRawApiBaseUrl();
const normalizedUrl = normalizeApiBase(rawUrl);

console.log('[ENV] URL processing:', {
  raw: rawUrl,
  normalized: normalizedUrl,
});

export const API_BASE_URL = normalizedUrl;

// =============================================================================
// DERIVED API ENDPOINTS
// =============================================================================

/**
 * Helper để lấy API base URL hiện tại (có thể thay đổi runtime)
 */
const getCurrentApiBaseUrl = (): string => {
  // Kiểm tra window.APP_CONFIG trước (có thể thay đổi động)
  if (typeof window !== 'undefined') {
    const windowConfig = (window as any).APP_CONFIG;
    if (windowConfig?.apiBaseUrl) {
      const runtimeUrl = String(windowConfig.apiBaseUrl).trim();
      if (runtimeUrl) {
        return normalizeApiBase(runtimeUrl);
      }
    }
  }
  // Fallback về URL đã normalize sẵn
  return normalizedUrl;
};

/**
 * Weather API Base URL (không có /api/v1)
 * Dùng cho: weather, forecast realtime endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com
 */
export const WEATHER_API_BASE_URL = getCurrentApiBaseUrl().replace(/\/api\/v1$/, '');

/**
 * Reports API Base URL  
 * Dùng cho: /app/reports, /app/comments endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com/api/v1/app
 */
export const REPORTS_API_BASE_URL = `${getCurrentApiBaseUrl()}/app`;

/**
 * Auth API Base URL
 * Dùng cho: /app/auth/login, /app/auth/register endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com/api/v1/app
 */
export const AUTH_API_BASE_URL = REPORTS_API_BASE_URL;

/**
 * AI Chat API Base URL
 * Dùng cho: /ai/chat, /ai/history endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com/api/v1/ai
 */
export const AI_API_BASE_URL = `${getCurrentApiBaseUrl()}/ai`;

/**
 * Alerts API Base URL
 * Dùng cho: /app/alerts endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com/api/v1/app
 */
export const ALERTS_API_BASE_URL = `${getCurrentApiBaseUrl()}/app`;

// Log all derived URLs để debug
console.log('[ENV] All API URLs:', {
  API_BASE_URL,
  WEATHER_API_BASE_URL,
  REPORTS_API_BASE_URL,
  ALERTS_API_BASE_URL,
  AI_API_BASE_URL
});

/**
 * Geographic API Base URL
 * Dùng cho: /geographic/buildings, /geographic/pois endpoints
 * Ví dụ: https://your-tunnel.trycloudflare.com/api/v1
 */
export const GEO_API_BASE_URL = getCurrentApiBaseUrl();

// =============================================================================
// OTHER CONFIGS
// =============================================================================

/**
 * TomTom API Key
 */
// Lọc bỏ các giá trị rác từ webpack (vd: chuỗi "undefined", "null", quá ngắn, hoặc placeholder)
const _cleanEnvValue = (v: string | undefined): string => {
  if (!v) return '';
  const s = String(v).trim();
  if (s === 'undefined' || s === 'null' || s === 'your_tomtom_api_key_here' || s.length < 10) return '';
  return s;
};

const TOMTOM_FALLBACK = 'duLNzPWO9DsYpsT5BTXCNcU49N1ecUxb';

const _tomtomFromExpo = _cleanEnvValue(
  Constants.expoConfig?.extra?.tomtomApiKey as string | undefined
);
const _tomtomFromProcess = typeof process !== 'undefined'
  ? _cleanEnvValue(process.env.EXPO_PUBLIC_TOMTOM_API_KEY || process.env.TOMTOM_API_KEY)
  : '';

export const TOMTOM_API_KEY: string =
  _tomtomFromExpo || _tomtomFromProcess || TOMTOM_FALLBACK;

// Debug - luôn log ra console để dễ kiểm tra
console.log('[ENV] TomTom API Key:', {
  fromExpoConfig: _tomtomFromExpo ? `${_tomtomFromExpo.substring(0, 6)}... (len=${_tomtomFromExpo.length})` : 'undefined',
  fromProcess: _tomtomFromProcess ? `${_tomtomFromProcess.substring(0, 6)}... (len=${_tomtomFromProcess.length})` : 'undefined',
  finalKey: TOMTOM_API_KEY ? `${TOMTOM_API_KEY.substring(0, 6)}... (len=${TOMTOM_API_KEY.length})` : 'EMPTY',
  usingFallback: TOMTOM_API_KEY === TOMTOM_FALLBACK,
});

/**
 * MongoDB Atlas Connection String
 */
export const MONGODB_URI =
  (Constants.expoConfig?.extra as any)?.mongodbUri ||
  (typeof process !== 'undefined' && process.env?.MONGODB_URI) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_MONGODB_URI) ||
  '';

/**
 * MongoDB Database Name
 */
export const MONGODB_DB_NAME =
  (Constants.expoConfig?.extra as any)?.mongodbDbName ||
  (typeof process !== 'undefined' && process.env?.MONGODB_DB_NAME) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_MONGODB_DB_NAME) ||
  'hqcsystem';

/**
 * Kiểm tra xem TomTom API key đã được cấu hình chưa
 */
export const isTomTomApiKeyConfigured = (): boolean => {
  const key = TOMTOM_API_KEY;
  const result = (
    !!key &&
    key !== '' &&
    key !== 'YOUR_TOMTOM_API_KEY_HERE' &&
    key.length >= 32
  );
  if (!result) {
    console.warn('[ENV] isTomTomApiKeyConfigured = false. Key:', key ? `len=${key.length}` : 'EMPTY');
  }
  return result;
};

// Log for debugging (only in development)
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('[ENV] TomTom API Key configured:', isTomTomApiKeyConfigured() ? 'YES' : 'NO', 
    'Length:', TOMTOM_API_KEY ? TOMTOM_API_KEY.length : 0);
}

// =============================================================================
// DEBUG HELPERS
// =============================================================================

/**
 * Log tất cả API URLs (chỉ dùng cho debug)
 */
export const logApiUrls = (): void => {
  if (typeof console !== 'undefined') {
    console.log('[ENV] API URLs:', {
      API_BASE_URL,
      WEATHER_API_BASE_URL,
      REPORTS_API_BASE_URL,
      AUTH_API_BASE_URL,
      AI_API_BASE_URL,
      ALERTS_API_BASE_URL,
      GEO_API_BASE_URL,
    });
  }
};

