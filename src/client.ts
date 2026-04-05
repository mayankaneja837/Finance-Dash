import { PrismaClient } from "./generated/prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from './config/env'

if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
}

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })
