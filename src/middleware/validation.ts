import { ZodError, ZodType } from 'zod'
import { AppError } from './errorHandler'

export const formatZodErrors = (error: ZodError) => {
    return error.issues.map(issue => {
        const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : ''
        return `${path}${issue.message}`
    })
}

export const parseOrThrow = <T>(schema: ZodType<T>, input: unknown) => {
    const parsed = schema.safeParse(input)

    if (!parsed.success) {
        throw new AppError(400, 'Validation failed', formatZodErrors(parsed.error))
    }

    return parsed.data
}
