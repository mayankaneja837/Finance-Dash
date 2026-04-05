import { Request, Response, NextFunction } from 'express'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from './user.services'
import { createUserSchema, updateUserSchema } from './user.schema'
import { parseOrThrow } from '../../middleware/validation'

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseOrThrow(createUserSchema, req.body)
    const user = await createUser(payload)

    res.status(201).json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers()
    res.json({ success: true, data: users })
  } catch (err) {
    next(err)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.params.id as string)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseOrThrow(updateUserSchema, req.body)
    const user = await updateUser(req.params.id as string,req.user!.id ,payload)
    res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req.params.id as string)
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}
