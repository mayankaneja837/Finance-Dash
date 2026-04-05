import { z } from 'zod'
import { TransactionType } from '../../generated/prisma/client'

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(TransactionType),
  category: z.string().min(1, 'Category is required'),
  date: z.iso.datetime('Invalid date format'),
  notes: z.string().optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial().refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field required' }
)

export const filterTransactionSchema = z.object({
  type: z.enum(TransactionType).optional(),
  category: z.string().optional(),
  search: z.string().trim().min(1, 'Search must not be empty').optional(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  pageSize: z.coerce.number().int().min(1, 'Page size must be at least 1').max(100, 'Page size cannot exceed 100').default(20),
})
