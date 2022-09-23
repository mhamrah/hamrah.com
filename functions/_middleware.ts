import jwt from "@tsndr/cloudflare-worker-jwt";

const jwk = {};

const auth = async ({ request, next }) => {
  console.log("hello");
  if (new URL(request.url).pathname.trim() === "/api") {
    console.log("blurp");
  }
  if (new URL(request.url).pathname.trim() !== "/api") {
    console.log(new URL(request.url).pathname.trim());
    //return await next();
  }

  const header = request.headers.get("authorization");

  if (!header) {
    return new Response("You must supply an authorization header", {
      status: 401,
    });
  }

  console.log("here");
  if (!header || header.substring(0, 6) !== "Bearer") {
    return null;
  }
  const token = header.substring(6).trim();

  const isValid = await jwt.verify(
    token,
    "MIIC/zCCAeegAwIBAgIJYDDds3P5TgN6MA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNVBAMTEmhhbXFsLnVzLmF1dGgwLmNvbTAeFw0yMjA5MjMxNjI3NTVaFw0zNjA2MDExNjI3NTVaMB0xGzAZBgNVBAMTEmhhbXFsLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOUwQRLyJ1GnmdDiv2KLF/oaZhS9yqod6QdguSWS/5CYwlGixSYMbUR4xRI5PIghRV7J/beJcLz/44zmU7y0dXptu1IEf2Bga7XszFE2PGMZCLRtqK1FbPti4pVe3s418rel/J7dEC45FzUmR6vJqbVSvwjFIKqIjRk3BvzfZqKx1fZ3nZ5+evr3XtB2UuV06K8J6TNE4fh92T2W4/Iu99FXmWOm0l5fZjfMYzvFUA1plDUcbIc8UcqF8ZSxFYPV04gP9Xxr1/g918l5sNc89++GBy1PO/Uqt8a5O8UrunSXzCXmALe2ruJjNYwkMJp0tFeo3cSOr+LJrkih45DpU58CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUJC4gNFfVFSwUATzDc+YVXEJsBBgwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQDV7gKHnYIzp4rpopbJvHJv85Qv9OBvso9hSTKIWGhyWbU569gH0gDTlpR9zCsOLAd09TFGfV93Tp54c8nnHL2goKRMvXa2dapg6QQmlIM4sC9QCZl6OBYCkRXvW1U5XJJLKYfmXyzkBLG7nRBO2IjtU3OFFcCSsadCxodvVMIv9K58nMzN8FU4IdI4SyZB712yyq1eRxxaX5G/D47yMqBO3sDWnZq6FYezVuUbZD1fHbGvPF9YGT5xwXJe921sQiM7+1jW+DB3Yezx84/1zzEfCixHIeuc9mpCdcWlDEG22ZLg7iF55qEYcPQsIiqIhasyik82rKm3dcuoLihLqR1r"
  );

  console.log(isValid);
  const response = await next();
  response.headers.set("X-Hello", "Hello from functions Middleware!");
  return response;
};

export const onRequest = [auth];
