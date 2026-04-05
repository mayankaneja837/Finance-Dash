import { Router } from 'express'
import { create, list, getOne, update, remove } from './transaction.controller'
import { authenticate } from '../../middleware/authenticate'
import { authorize } from '../../middleware/authorize'
import { Role } from '../../generated/prisma/client'

const router = Router()

router.use(authenticate)

router.get('/', authorize(Role.VIEWER), list)
router.get('/:id', authorize(Role.VIEWER), getOne)
router.post('/', authorize(Role.ANALYST), create)
router.patch('/:id', authorize(Role.ANALYST), update)
router.delete('/:id', authorize(Role.ADMIN), remove)

export default router