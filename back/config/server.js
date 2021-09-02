module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'b040dede83481870065e3a6a324600da'),
    },
  },
  cron: {
    enabled: true
  }
});
