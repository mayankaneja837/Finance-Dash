import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@finance.com' }
  })

  if (existing) {
    console.log('Admin already exists, skipping seed')
    return
  }

  const password = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@finance.com',
      password,
      role: 'ADMIN',
      isActive: true,
    }
  })

  console.log('Admin seeded:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())