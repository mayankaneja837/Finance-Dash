import jwt from 'jsonwebtoken'
import { prisma } from '../../client'
import { env } from '../../config/env'
import { AppError } from '../../middleware/errorHandler'
import bcrypt from 'bcryptjs'

export const registerUser = async (name: string, email: string, password: string) => {
    const existing = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existing) throw new AppError(409, "User already exists")

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            name: true,
            id: true,
            role: true,
            email: true
        }
    })

    return user
}

export const loginUser = async (email: string, password: string) => {
    const findUser = await prisma.user.findUnique({ where: { email } })
    if (!findUser) throw new AppError(401, 'Invalid credentials')
    if (!findUser.isActive) throw new AppError(403, 'Account is deactivated')

    const isValidPassword = await bcrypt.compare(password, findUser.password)
    if (!isValidPassword) throw new AppError(401, 'Invalid credentials')

    const token = jwt.sign(
        { id: findUser.id, role: findUser.role },
        env.JWT_SECRET!,
        { expiresIn: '7d' }
    )

    return {
        token,
        user: {
            id: findUser.id,
            name: findUser.name,
            email: findUser.email,
            role: findUser.role
        }
    }
}
