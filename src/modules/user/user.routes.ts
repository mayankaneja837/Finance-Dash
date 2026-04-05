import { Router } from 'express'
import { create, listUsers, getUser, patchUser, removeUser } from './user.controller'
import { authenticate } from '../../middleware/authenticate'
import { authorize } from '../../middleware/authorize'
import { Role } from '../../generated/prisma/client'

const router = Router()

router.use(authenticate, authorize(Role.ADMIN))

router.post('/', create)
router.get('/', listUsers)
router.get('/:id', getUser)
router.patch('/:id', patchUser)
router.delete('/:id', removeUser)

export default router
