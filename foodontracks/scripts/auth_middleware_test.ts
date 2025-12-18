import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from '../src/app/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

async function run() {
  console.log('🔐 Auth Middleware Test: admin vs user access');

  // Create test users
  await prisma.user.deleteMany({ where: { email: { contains: 'middleware-test' } } });

  const admin = await prisma.user.create({
    data: { name: 'Admin Test', email: `admin+middleware-test-${Date.now()}@example.com`, password: 'x', role: 'ADMIN' },
  });
  const user = await prisma.user.create({
    data: { name: 'User Test', email: `user+middleware-test-${Date.now()}@example.com`, password: 'x', role: 'CUSTOMER' },
  });

  const adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });
  const userToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

  // Try admin endpoint with admin token
  try {
    const r1 = await axios.get('http://localhost:3000/api/admin', { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('Admin access status:', r1.status, 'data:', r1.data);
  } catch (err: any) {
    console.error('Admin access failed:', err.message);
  }

  // Try admin endpoint with user token (should be denied)
  try {
    const r2 = await axios.get('http://localhost:3000/api/admin', { headers: { Authorization: `Bearer ${userToken}` } });
    console.log('User access status:', r2.status, 'data:', r2.data);
  } catch (err: any) {
    console.log('User access denied as expected:', err.response?.status, err.response?.data || err.message);
  }

  // Cleanup
  await prisma.user.delete({ where: { id: admin.id } });
  await prisma.user.delete({ where: { id: user.id } });
  await prisma.$disconnect();
  console.log('Auth middleware test finished');
}

run().catch((e) => {
  console.error('Auth middleware test failed', e);
  process.exit(1);
});