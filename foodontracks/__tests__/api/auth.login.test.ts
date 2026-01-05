const bcrypt = require('bcrypt');

jest.mock('@/lib/prisma');
jest.mock('bcrypt');

function mockRequest(body) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('POST /api/auth/login returns 400 for missing fields', async () => {
  const { POST } = require('@/app/api/auth/login/route');
  const req = mockRequest({ email: '' });
  const res = await POST(req);
  const json = await res.json();
  expect(res.status).toBe(400);
  expect(json.success).toBe(false);
});

test('POST /api/auth/login returns 401 for invalid user', async () => {
  const prismaModule = require('@/lib/prisma');
  prismaModule.prisma = { user: { findUnique: jest.fn().mockResolvedValue(null) } };
  const { POST } = require('@/app/api/auth/login/route');
  const req = mockRequest({ email: 'noone@example.com', password: 'x' });
  const res = await POST(req);
  const json = await res.json();
  expect(res.status).toBe(401);
  expect(json.success).toBe(false);
});

test('POST /api/auth/login returns tokens on valid credentials', async () => {
  const fakeUser = { id: 1, email: 'test@example.com', password: 'hashed', name: 'Test', role: 'USER' };
  const prismaModule = require('@/lib/prisma');
  prismaModule.prisma = { user: { findUnique: jest.fn().mockResolvedValue(fakeUser) } };
  (bcrypt.compare).mockResolvedValue(true);

  // mock token generation and cookie setter
  jest.mock('@/app/lib/jwtService');
  const jwt = require('@/app/lib/jwtService');
  jwt.generateTokenPair = jest.fn().mockReturnValue({ accessToken: 'a', refreshToken: 'r' });
  jwt.setTokenCookies = jest.fn();

  const { POST } = require('@/app/api/auth/login/route');
  const req = mockRequest({ email: 'test@example.com', password: 'password' });
  const res = await POST(req);
  const json = await res.json();

  expect(res.status).toBe(200);
  expect(json.success).toBe(true);
  expect(json.user.email).toBe('test@example.com');
  expect(json.tokens).toHaveProperty('accessToken');
});
