/**
 * @typedef JwtData
 * @prop {JwtHeader} header
 * @prop {JwtPayload} payload
 */
export interface JwtData {
  header: JwtHeader;
  payload: JwtPayload;
}

/**
 * @typedef JwtHeader
 * @prop {string} [typ] Type
 */
export interface JwtHeader {
  /**
   * Type (default: `"JWT"`)
   *
   * @default "JWT"
   */
  typ?: string;

  [key: string]: any;
}

/**
 * @typedef JwtPayload
 * @prop {string} [iss] Issuer
 * @prop {string} [sub] Subject
 * @prop {string} [aud] Audience
 * @prop {string} [exp] Expiration Time
 * @prop {string} [nbf] Not Before
 * @prop {string} [iat] Issued At
 * @prop {string} [jti] JWT ID
 */
export interface JwtPayload {
  /** Issuer */
  iss?: string;

  /** Subject */
  sub?: string;

  /** Audience */
  aud?: string;

  /** Expiration Time */
  exp?: number;

  /** Not Before */
  nbf?: number;

  /** Issued At */
  iat?: number;

  /** JWT ID */
  jti?: string;

  [key: string]: any;
}

const jwk = {
  alg: "RS256",
  kty: "RSA",
  use: "sig",
  n: "5TBBEvInUaeZ0OK_YosX-hpmFL3Kqh3pB2C5JZL_kJjCUaLFJgxtRHjFEjk8iCFFXsn9t4lwvP_jjOZTvLR1em27UgR_YGBrtezMUTY8YxkItG2orUVs-2LilV7ezjXyt6X8nt0QLjkXNSZHq8mptVK_CMUgqoiNGTcG_N9morHV9nednn56-vde0HZS5XTorwnpM0Th-H3ZPZbj8i730VeZY6bSXl9mN8xjO8VQDWmUNRxshzxRyoXxlLEVg9XTiA_1fGvX-D3XyXmw1zz374YHLU879Sq3xrk7xSu6dJfMJeYAt7au4mM1jCQwmnS0V6jdxI6v4smuSKHjkOlTnw",
  e: "AQAB",
  kid: "hfAjZqq094GcAnwzUfrCu",
  x5t: "PJXBMAJg5qe036HR2fyo8TmXDbE",
  x5c: [
    "MIIC/zCCAeegAwIBAgIJYDDds3P5TgN6MA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNVBAMTEmhhbXFsLnVzLmF1dGgwLmNvbTAeFw0yMjA5MjMxNjI3NTVaFw0zNjA2MDExNjI3NTVaMB0xGzAZBgNVBAMTEmhhbXFsLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOUwQRLyJ1GnmdDiv2KLF/oaZhS9yqod6QdguSWS/5CYwlGixSYMbUR4xRI5PIghRV7J/beJcLz/44zmU7y0dXptu1IEf2Bga7XszFE2PGMZCLRtqK1FbPti4pVe3s418rel/J7dEC45FzUmR6vJqbVSvwjFIKqIjRk3BvzfZqKx1fZ3nZ5+evr3XtB2UuV06K8J6TNE4fh92T2W4/Iu99FXmWOm0l5fZjfMYzvFUA1plDUcbIc8UcqF8ZSxFYPV04gP9Xxr1/g918l5sNc89++GBy1PO/Uqt8a5O8UrunSXzCXmALe2ruJjNYwkMJp0tFeo3cSOr+LJrkih45DpU58CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUJC4gNFfVFSwUATzDc+YVXEJsBBgwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQDV7gKHnYIzp4rpopbJvHJv85Qv9OBvso9hSTKIWGhyWbU569gH0gDTlpR9zCsOLAd09TFGfV93Tp54c8nnHL2goKRMvXa2dapg6QQmlIM4sC9QCZl6OBYCkRXvW1U5XJJLKYfmXyzkBLG7nRBO2IjtU3OFFcCSsadCxodvVMIv9K58nMzN8FU4IdI4SyZB712yyq1eRxxaX5G/D47yMqBO3sDWnZq6FYezVuUbZD1fHbGvPF9YGT5xwXJe921sQiM7+1jW+DB3Yezx84/1zzEfCixHIeuc9mpCdcWlDEG22ZLg7iF55qEYcPQsIiqIhasyik82rKm3dcuoLihLqR1r",
  ],
};

const auth = async ({ request, next, data }) => {
  if (new URL(request.url).pathname.trim() !== "/api") {
    return await next();
  }

  const header = request.headers.get("authorization");

  if (!header) {
    return new Response("You must supply an authorization header", {
      status: 401,
    });
  }

  if (!header || header.substring(0, 6) !== "Bearer") {
    return null;
  }
  const token = header.substring(6).trim();
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) throw new Error("token must consist of 3 parts");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    base64UrlParse(tokenParts[2]),
    _utf8ToUint8Array(`${tokenParts[0]}.${tokenParts[1]}`)
  );

  if (!valid) {
    return new Response("invalid token signature", {
      status: 401,
    });
  }
  const auth = decode(token);

  if (Date.now() >= auth.payload.exp * 1000) {
    return new Response("token expired", {
      status: 401,
    });
  }

  data.auth = auth.payload;
  const response = await next();
  return response;
};

export const onRequest = [auth];
function base64UrlParse(s: string): Uint8Array {
  // @ts-ignore
  return new Uint8Array(
    Array.prototype.map.call(
      atob(s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")),
      (c) => c.charCodeAt(0)
    )
  );
}

function decode(token: string): JwtData {
  return {
    header: _decodePayload(
      token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")
    ) as JwtHeader,
    payload: _decodePayload(
      token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    ) as JwtPayload,
  };
}

function _utf8ToUint8Array(str: string): Uint8Array {
  return base64UrlParse(btoa(unescape(encodeURIComponent(str))));
}

function _decodePayload(raw: string): JwtHeader | JwtPayload | null {
  switch (raw.length % 4) {
    case 0:
      break;
    case 2:
      raw += "==";
      break;
    case 3:
      raw += "=";
      break;
    default:
      throw new Error("Illegal base64url string!");
  }
  try {
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {
    return null;
  }
}
