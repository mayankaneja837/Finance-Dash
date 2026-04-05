import { z } from 'zod'
import { Role } from '../../generated/prisma/client'

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(Role),
  isActive: z.boolean().optional(),
})

export const updateUserSchema = z.object({
  role: z.enum(Role).optional(),
  isActive: z.boolean().optional(),
}).refine(data => data.role !== undefined || data.isActive !== undefined, {
  message: 'At least one field required'
})
