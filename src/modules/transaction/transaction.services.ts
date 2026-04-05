import { prisma } from '../../client'
import { AppError } from '../../middleware/errorHandler'
import { TransactionType } from '../../generated/prisma/client'

interface TransactionFilters {
  type?: TransactionType
  category?: string
  search?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

export const createTransaction = async (
  userId: string,
  data: {
    amount: number
    type: TransactionType
    category: string
    date: string
    notes?: string
  }
) => {
  return await prisma.transaction.create({
    data: {
      ...data,
      date: new Date(data.date),
      userId,
    }
  })
}

export const getAllTransactions = async (filters: TransactionFilters) => {
  const where = {
    deletedAt: null,
    ...(filters.type && { type: filters.type }),
    ...(filters.category && { category: filters.category }),
    ...(filters.search ? {
      OR: [
        { category: { contains: filters.search, mode: 'insensitive' as const } },
        { notes: { contains: filters.search, mode: 'insensitive' as const } },
      ]
    } : {}),
    ...(filters.startDate || filters.endDate ? {
      date: {
        ...(filters.startDate && { gte: new Date(filters.startDate) }),
        ...(filters.endDate && { lte: new Date(filters.endDate) }),
      }
    } : {}),
  }

  const [transactions, totalItems] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.transaction.count({ where })
  ])

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / filters.pageSize)

  return {
    data: transactions,
    meta: {
      page: filters.page,
      pageSize: filters.pageSize,
      totalItems,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPreviousPage: filters.page > 1,
    }
  }
}

export const getTransactionById = async (id: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null }
  })
  if (!transaction) throw new AppError(404, 'Transaction not found')
  return transaction
}

export const updateTransaction = async (id: string, data: Partial<{
  amount: number
  type: TransactionType
  category: string
  date: string
  notes: string
}>) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null }
  })
  if (!transaction) throw new AppError(404, 'Transaction not found')

  return await prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    }
  })
}

export const softDeleteTransaction = async (id: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null }
  })
  if (!transaction) throw new AppError(404, 'Transaction not found')

  await prisma.transaction.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
}
