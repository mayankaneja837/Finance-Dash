import { prisma } from '../../client'

export const getSummary = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { deletedAt: null },
    select: { amount: true, type: true }
  })

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  }
}

export const getCategoryBreakdown = async () => {
  const result = await prisma.transaction.groupBy({
    by: ['category', 'type'],
    where: { deletedAt: null },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  })

  return result.map(r => ({
    category: r.category,
    type: r.type,
    total: r._sum.amount ?? 0
  }))
}

export const getMonthlyTrends = async () => {
  const transactions = await prisma.transaction.findMany({
    where: { deletedAt: null },
    select: { amount: true, type: true, date: true },
    orderBy: { date: 'asc' }
  })

  const trends: Record<string, { income: number, expenses: number }> = {}

  for (const t of transactions) {
    const month = t.date.toISOString().slice(0, 7) // "2026-04"

    if (!trends[month]) trends[month] = { income: 0, expenses: 0 }

    if (t.type === 'Income') trends[month].income += t.amount
    else trends[month].expenses += t.amount
  }

  return Object.entries(trends).map(([month, data]) => ({ month, ...data }))
}

export const getRecentActivity = async (limit: number = 5) => {
  return await prisma.transaction.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
    }
  })
}