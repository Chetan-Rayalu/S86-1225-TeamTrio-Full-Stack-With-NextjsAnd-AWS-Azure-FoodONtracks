import { GET } from '../../src/app/api/health/route';

test('GET /api/health returns ok status and expected fields', async () => {
  const res = await GET();
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toHaveProperty('status', 'ok');
  expect(body).toHaveProperty('timestamp');
  expect(body).toHaveProperty('uptime');
});
