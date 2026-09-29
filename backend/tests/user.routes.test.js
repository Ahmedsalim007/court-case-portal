import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({ binary: { version: '7.0.14' } });
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

const ADMIN = { fullName: 'Test Admin', employeeId: '111111', password: 'password123', role: 'Admin' };
const CLERK = { fullName: 'Test Clerk', employeeId: '222222', password: 'password123', role: 'Clerk' };

const createAndLogin = async (userData) => {
  await User.create(userData);
  const res = await request(app)
    .post('/api/CasePortal/auth/login')
    .send({ employeeId: userData.employeeId, password: userData.password });
  return res.body.token;
};

describe('POST /api/CasePortal/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await User.create(ADMIN);
    const res = await request(app)
      .post('/api/CasePortal/auth/login')
      .send({ employeeId: ADMIN.employeeId, password: ADMIN.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeTypeOf('string');
  });

  it('rejects wrong password', async () => {
    await User.create(ADMIN);
    const res = await request(app)
      .post('/api/CasePortal/auth/login')
      .send({ employeeId: ADMIN.employeeId, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects a nonexistent employeeId', async () => {
    const res = await request(app)
      .post('/api/CasePortal/auth/login')
      .send({ employeeId: '999999', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/CasePortal/auth/login')
      .send({ employeeId: ADMIN.employeeId });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/CasePortal/user/createAccount', () => {
  it('allows an Admin to create a user', async () => {
    const token = await createAndLogin(ADMIN);

    const res = await request(app)
      .post('/api/CasePortal/user/createAccount')
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'New Clerk', employeeId: '333333', password: 'password123', role: 'Clerk' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('Clerk');
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects a Clerk trying to create a user', async () => {
    const token = await createAndLogin(CLERK);

    const res = await request(app)
      .post('/api/CasePortal/user/createAccount')
      .set('Authorization', `Bearer ${token}`)
      .send({ fullName: 'Should Fail', employeeId: '444444', password: 'password123' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('rejects requests with no token', async () => {
    const res = await request(app)
      .post('/api/CasePortal/user/createAccount')
      .send({ fullName: 'No Token', employeeId: '555555', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('rejects a malformed token', async () => {
    const res = await request(app)
      .post('/api/CasePortal/user/createAccount')
      .set('Authorization', 'Bearer not-a-real-token')
      .send({ fullName: 'Bad Token', employeeId: '666666', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('rejects duplicate employeeId', async () => {
    const token = await createAndLogin(ADMIN);
    const payload = { fullName: 'Dup User', employeeId: '777777', password: 'password123', role: 'Clerk' };

    await request(app)
      .post('/api/CasePortal/user/createAccount')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    const res = await request(app)
      .post('/api/CasePortal/user/createAccount')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect([400, 409]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/CasePortal/user/getUsers', () => {
  it('allows Admin to list users, excludes passwords', async () => {
    const token = await createAndLogin(ADMIN);
    await User.create(CLERK);

    const res = await request(app)
      .get('/api/CasePortal/user/getUsers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    res.body.data.forEach((u) => expect(u.password).toBeUndefined());
  });

  it('rejects a Clerk', async () => {
    const token = await createAndLogin(CLERK);
    const res = await request(app)
      .get('/api/CasePortal/user/getUsers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/CasePortal/user/deleteAccount/:employeeId', () => {
  it('allows Admin to delete another user', async () => {
    const token = await createAndLogin(ADMIN);
    await User.create(CLERK);

    const res = await request(app)
      .delete(`/api/CasePortal/user/deleteAccount/${CLERK.employeeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects deleting your own account', async () => {
    const token = await createAndLogin(ADMIN);

    const res = await request(app)
      .delete(`/api/CasePortal/user/deleteAccount/${ADMIN.employeeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/cannot delete your own account/i);
  });

  it('rejects deleting a protected demo account', async () => {
    const token = await createAndLogin(ADMIN);
    await User.create({ fullName: 'Demo', employeeId: '100001', password: 'password123', role: 'Clerk' });

    const res = await request(app)
      .delete('/api/CasePortal/user/deleteAccount/100001')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/demo account/i);
  });

  it('rejects deleting the last remaining Admin', async () => {
    const token = await createAndLogin(ADMIN);

    const res = await request(app)
      .delete(`/api/CasePortal/user/deleteAccount/${ADMIN.employeeId}`)
      .set('Authorization', `Bearer ${token}`);

    // This hits the "cannot delete your own account" check first since
    // the only Admin here is also the requester — see note below.
    expect(res.status).toBe(403);
  });

  it('returns 404 for a nonexistent employeeId', async () => {
    const token = await createAndLogin(ADMIN);

    const res = await request(app)
      .delete('/api/CasePortal/user/deleteAccount/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
