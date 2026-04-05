import { Request, Response, NextFunction } from 'express'
import { Role } from "../generated/prisma/client"
import { AppError } from './errorHandler'

const roleHierarchy: { [key in Role]: number } = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3
}

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(401, 'Unauthenticated')

        
    const allowed = roles.some(role => roleHierarchy[req.user!.role] >= roleHierarchy[role])
    if (!allowed) throw new AppError(403, 'Insufficient permissions')

    next()
  }
}
