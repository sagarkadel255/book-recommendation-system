export const AUTH_CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || 'booknest-access-secret',
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'booknest-refresh-secret',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  COOKIE_NAME: 'booknest_refresh',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/api/auth',
  },
  UPLOAD_DIR: 'uploads/avatars',
  MAX_FILE_SIZE: 2 * 1024 * 1024, 
} as const;
