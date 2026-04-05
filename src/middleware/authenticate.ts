import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from './errorHandler'
import { Role } from "../generated/prisma/client"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) throw new AppError(401, 'No token provided')

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET!) as { id: string, role: Role }
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    throw new AppError(401, 'Invalid or expired token')
  }
}
