const PRODUCTION_ORIGIN = "https://my-server-01-test.eastasia.cloudapp.azure.com";

function getAllowedOrigins() {
  const origins = [PRODUCTION_ORIGIN];

  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:5173");
  }

  return origins;
}

export function getCorsHeaders(req) {
  const allowedOrigins = getAllowedOrigins();
  const requestOrigin = req?.headers?.get?.("origin") || "";

  const allowOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0];

  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function createOptionsResponse(req) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

const defaultOrigin =
  process.env.NODE_ENV === "production" ? PRODUCTION_ORIGIN : "http://localhost:5173";

const defaultCorsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": defaultOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

export default defaultCorsHeaders;
