import { Router } from 'express'
import { summary, categoryBreakdown, monthlyTrends, recentActivity } from './dashboard.controller'
import { authenticate } from '../../middleware/authenticate'
import { authorize } from '../../middleware/authorize'
import { Role } from '../../generated/prisma/client'

const router = Router()

router.use(authenticate, authorize(Role.ANALYST))

router.get('/summary', summary)
router.get('/categories', categoryBreakdown)
router.get('/trends', monthlyTrends)
router.get('/recent', recentActivity)

export default router