import { z } from 'zod'

export const recentActivitySchema = z.object({
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit cannot exceed 50').default(5)
})
