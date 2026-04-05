import { Request, Response, NextFunction } from 'express'
import { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity } from './dashboard.services'
import { parseOrThrow } from '../../middleware/validation'
import { recentActivitySchema } from './dashboard.schema'

export const summary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getSummary()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const categoryBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCategoryBreakdown()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const monthlyTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getMonthlyTrends()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

export const recentActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = parseOrThrow(recentActivitySchema, req.query)
    const data = await getRecentActivity(limit)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}
