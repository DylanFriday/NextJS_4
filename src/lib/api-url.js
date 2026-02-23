export const API_PREFIX = "/api";
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "") ||
  "https://my-server-01-test.eastasia.cloudapp.azure.com";

export function toApiPath(path) {
  if (!path) return API_PREFIX;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.startsWith("/api/api")) {
    console.error(`[api-url] duplicate /api prefix detected: ${normalized}`);
    return normalized.replace(/^\/api\/api(?=\/|$)/, API_PREFIX);
  }

  if (normalized.startsWith(API_PREFIX)) {
    return normalized;
  }

  return `${API_PREFIX}${normalized}`;
}

export function buildApiUrl(path) {
  return `${API_BASE_URL}${toApiPath(path)}`;
}
