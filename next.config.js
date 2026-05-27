/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Força HTTPS por 2 anos (HSTS). Vercel já serve HTTPS, isso evita downgrade.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Impede que o app seja embedado em iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Bloqueia content-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não envia referrer pra outros domínios
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tira permissões do navegador que o app não usa
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
  },
  // CSP: restringe origens de scripts, conexões etc.
  // Permite eval/inline pq Next dev/runtime usa; em prod deveria restringir mais.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // tira "X-Powered-By: Next.js"
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
