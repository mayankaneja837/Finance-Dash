import request from 'supertest'
import bcrypt from 'bcryptjs'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../src/app'
import { prisma } from '../src/client'
import { Role, TransactionType } from '../src/generated/prisma/client'

const createUserRecord = async ({
  role,
  email,
  password = 'password123',
  isActive = true,
}: {
  role: Role
  email: string
  password?: string
  isActive?: boolean
}) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      name: email.split('@')[0]!,
      email,
      password: hashedPassword,
      role,
      isActive,
    }
  })
}

const loginAndGetToken = async (app: ReturnType<typeof createApp>, email: string, password: string) => {
  const response = await request(app)
    .post('/auth/login')
    .send({ email, password })

  expect(response.status).toBe(200)
  return response.body.data.token as string
}

describe('Finance Dash API', () => {
  beforeEach(async () => {
    vi.restoreAllMocks()
    await prisma.transaction.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.transaction.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  it('registers a viewer account and returns the user role on login', async () => {
    const app = createApp()

    const registerResponse = await request(app)
      .post('/auth/register')
      .send({ name: 'Viewer User', email: 'viewer@example.com', password: 'password123' })

    expect(registerResponse.status).toBe(200)
    expect(registerResponse.body.data.role).toBe('VIEWER')

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'viewer@example.com', password: 'password123' })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.body.data.user.role).toBe('VIEWER')
    expect(loginResponse.body.data.token).toEqual(expect.any(String))
  })

  it('rejects login for inactive users', async () => {
    const app = createApp()
    await createUserRecord({
      role: Role.VIEWER,
      email: 'inactive@example.com',
      isActive: false,
    })

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'inactive@example.com', password: 'password123' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Account is deactivated')
  })

  it('rate limits auth endpoints after repeated requests', async () => {
    const app = createApp()

    for (let index = 0; index < 10; index += 1) {
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: `Viewer ${index}`,
          email: `viewer${index}@example.com`,
          password: 'password123',
        })

      expect(response.status).toBe(200)
    }

    const limitedResponse = await request(app)
      .post('/auth/register')
      .send({
        name: 'Viewer 11',
        email: 'viewer11@example.com',
        password: 'password123',
      })

    expect(limitedResponse.status).toBe(429)
    expect(limitedResponse.body.message).toContain('Too many authentication attempts')
  })

  it('lets admins create and update users while blocking non-admin creation and self-role changes', async () => {
    const app = createApp()
    const admin = await createUserRecord({ role: Role.ADMIN, email: 'admin@example.com' })
    await createUserRecord({ role: Role.VIEWER, email: 'viewer@example.com' })
    const targetUser = await createUserRecord({ role: Role.VIEWER, email: 'target@example.com' })

    const adminToken = await loginAndGetToken(app, 'admin@example.com', 'password123')
    const viewerToken = await loginAndGetToken(app, 'viewer@example.com', 'password123')

    const forbiddenCreate = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: 'password123',
        role: 'ANALYST',
      })

    expect(forbiddenCreate.status).toBe(403)

    const adminCreate = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: 'password123',
        role: 'ANALYST',
        isActive: true,
      })

    expect(adminCreate.status).toBe(201)
    expect(adminCreate.body.data.role).toBe('ANALYST')

    const duplicateCreate = await request(app)
      .post('/user')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: 'password123',
        role: 'ANALYST',
      })

    expect(duplicateCreate.status).toBe(409)

    const updateOtherUser = await request(app)
      .patch(`/user/${targetUser.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'ANALYST', isActive: false })

    expect(updateOtherUser.status).toBe(200)
    expect(updateOtherUser.body.data.role).toBe('ANALYST')
    expect(updateOtherUser.body.data.isActive).toBe(false)

    const updateSelf = await request(app)
      .patch(`/user/${admin.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'VIEWER' })

    expect(updateSelf.status).toBe(403)
  })

  it('enforces transaction permissions for viewer, analyst, and admin', async () => {
    const app = createApp()
    const viewer = await createUserRecord({ role: Role.VIEWER, email: 'viewer@example.com' })
    const analyst = await createUserRecord({ role: Role.ANALYST, email: 'analyst@example.com' })
    await createUserRecord({ role: Role.ADMIN, email: 'admin@example.com' })

    const viewerToken = await loginAndGetToken(app, viewer.email, 'password123')
    const analystToken = await loginAndGetToken(app, analyst.email, 'password123')
    const adminToken = await loginAndGetToken(app, 'admin@example.com', 'password123')

    const viewerCreate = await request(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        amount: 100,
        type: 'Income',
        category: 'Salary',
        date: '2026-04-01T00:00:00.000Z',
      })

    expect(viewerCreate.status).toBe(403)

    const analystCreate = await request(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${analystToken}`)
      .send({
        amount: 100,
        type: 'Income',
        category: 'Salary',
        date: '2026-04-01T00:00:00.000Z',
        notes: 'April salary',
      })

    expect(analystCreate.status).toBe(201)

    const transactionId = analystCreate.body.data.id as string

    const analystUpdate = await request(app)
      .patch(`/transaction/${transactionId}`)
      .set('Authorization', `Bearer ${analystToken}`)
      .send({ notes: 'Updated salary note' })

    expect(analystUpdate.status).toBe(200)
    expect(analystUpdate.body.data.notes).toBe('Updated salary note')

    const analystDelete = await request(app)
      .delete(`/transaction/${transactionId}`)
      .set('Authorization', `Bearer ${analystToken}`)

    expect(analystDelete.status).toBe(403)

    const adminDelete = await request(app)
      .delete(`/transaction/${transactionId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(adminDelete.status).toBe(200)
  })

  it('supports transaction filters, search, and pagination metadata', async () => {
    const app = createApp()
    const analyst = await createUserRecord({ role: Role.ANALYST, email: 'analyst@example.com' })
    const viewer = await createUserRecord({ role: Role.VIEWER, email: 'viewer@example.com' })
    const viewerToken = await loginAndGetToken(app, viewer.email, 'password123')

    await prisma.transaction.createMany({
      data: [
        {
          amount: 200,
          type: TransactionType.Expense,
          category: 'Food',
          date: new Date('2026-04-01T00:00:00.000Z'),
          notes: 'Lunch with team',
          userId: analyst.id,
        },
        {
          amount: 150,
          type: TransactionType.Expense,
          category: 'Meals',
          date: new Date('2026-04-02T00:00:00.000Z'),
          notes: 'Client lunch',
          userId: analyst.id,
        },
        {
          amount: 500,
          type: TransactionType.Income,
          category: 'Bonus',
          date: new Date('2026-04-03T00:00:00.000Z'),
          notes: 'Quarterly bonus',
          userId: analyst.id,
        },
      ]
    })

    const response = await request(app)
      .get('/transaction')
      .set('Authorization', `Bearer ${viewerToken}`)
      .query({
        type: 'Expense',
        search: 'lunch',
        page: '1',
        pageSize: '1',
      })

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(1)
    expect(response.body.meta).toEqual({
      page: 1,
      pageSize: 1,
      totalItems: 2,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    })
  })

  it('restricts dashboard access by role and validates recent activity query params', async () => {
    const app = createApp()
    const analyst = await createUserRecord({ role: Role.ANALYST, email: 'analyst@example.com' })
    await createUserRecord({ role: Role.ADMIN, email: 'admin@example.com' })
    await createUserRecord({ role: Role.VIEWER, email: 'viewer@example.com' })

    const analystToken = await loginAndGetToken(app, analyst.email, 'password123')
    const adminToken = await loginAndGetToken(app, 'admin@example.com', 'password123')
    const viewerToken = await loginAndGetToken(app, 'viewer@example.com', 'password123')

    await prisma.transaction.create({
      data: {
        amount: 400,
        type: TransactionType.Income,
        category: 'Salary',
        date: new Date('2026-04-01T00:00:00.000Z'),
        notes: 'Monthly salary',
        userId: analyst.id,
      }
    })

    const viewerSummary = await request(app)
      .get('/dashboard/summary')
      .set('Authorization', `Bearer ${viewerToken}`)

    expect(viewerSummary.status).toBe(403)

    const analystSummary = await request(app)
      .get('/dashboard/summary')
      .set('Authorization', `Bearer ${analystToken}`)

    expect(analystSummary.status).toBe(200)
    expect(analystSummary.body.data.totalIncome).toBe(400)

    const adminSummary = await request(app)
      .get('/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(adminSummary.status).toBe(200)

    const invalidRecent = await request(app)
      .get('/dashboard/recent')
      .set('Authorization', `Bearer ${analystToken}`)
      .query({ limit: '0' })

    expect(invalidRecent.status).toBe(400)
    expect(invalidRecent.body.errors).toContain('limit: Limit must be at least 1')
  })

  it('returns structured validation errors, docs, and not-found responses', async () => {
    const app = createApp()

    const invalidRegister = await request(app)
      .post('/auth/register')
      .send({ name: 'x', email: 'not-an-email', password: '123' })

    expect(invalidRegister.status).toBe(400)
    expect(invalidRegister.body.message).toBe('Validation failed')
    expect(invalidRegister.body.errors).toEqual(expect.arrayContaining([
      'name: Name must be at least 2 characters',
      'email: Invalid email',
      'password: Password must be at least 6 characters',
    ]))

    const docsResponse = await request(app).get('/openapi.json')
    expect(docsResponse.status).toBe(200)
    expect(docsResponse.body.info.title).toBe('Finance Dash API')

    const notFoundResponse = await request(app).get('/missing-route')
    expect(notFoundResponse.status).toBe(404)
    expect(notFoundResponse.body.message).toContain('Route not found')
  })

  it('returns a JSON 500 response for unexpected errors', async () => {
    const app = createApp()
    const analyst = await createUserRecord({ role: Role.ANALYST, email: 'analyst@example.com' })
    const analystToken = await loginAndGetToken(app, analyst.email, 'password123')

    vi.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(new Error('boom'))

    const response = await request(app)
      .get('/dashboard/summary')
      .set('Authorization', `Bearer ${analystToken}`)

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Internal Server Error')
  })
})
