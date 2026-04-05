import { prisma } from '../../client'
import { AppError } from '../../middleware/errorHandler'
import { Role } from '../../generated/prisma/client'
import bcrypt from 'bcryptjs'

const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
} as const

export const createUser = async (data: {
    name: string
    email: string
    password: string
    role: Role
    isActive?: boolean
}) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    })

    if (existingUser) throw new AppError(409, 'User already exists')

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
            isActive: data.isActive ?? true,
        },
        select: userSelect,
    })
}

export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: userSelect
    })
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: userSelect
    })
    if (!user) throw new AppError(404, 'User not found')
    return user
}

export const updateUser = async (
    id: string,
    requesterId: string,
    data: { role?: Role, isActive?: boolean }
) => {
    if (id === requesterId) throw new AppError(403, 'Cannot modify your own role or status')

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new AppError(404, 'User not found')

    return await prisma.user.update({ where: { id }, data, select: userSelect })
}

export const deleteUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new AppError(404, 'User not found')

    await prisma.user.delete({ where: { id } })
}
