import { Request, Response, NextFunction } from 'express'
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  softDeleteTransaction
} from "./transaction.services"
import {
  createTransactionSchema,
  updateTransactionSchema,
  filterTransactionSchema
} from './transaction.schema'
import { parseOrThrow } from '../../middleware/validation'

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseOrThrow(createTransactionSchema, req.body)
    const transaction = await createTransaction(req.user!.id, payload)
    res.status(201).json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = parseOrThrow(filterTransactionSchema, req.query)
    const transactions = await getAllTransactions(filters)
    res.json({ success: true, ...transactions })
  } catch (err) {
    next(err)
  }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transaction = await getTransactionById(req.params.id as string)
    res.json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = parseOrThrow(updateTransactionSchema, req.body)
    const transaction = await updateTransaction(req.params.id as string, payload)
    res.json({ success: true, data: transaction })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await softDeleteTransaction(req.params.id as string)
    res.json({ success: true, message: 'Transaction deleted' })
  } catch (err) {
    next(err)
  }
}
