import rateLimit from 'express-rate-limit'

const buildRateLimitResponse = (message: string) => ({
    success: false,
    message
})

export const createGlobalRateLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json(buildRateLimitResponse('Too many requests, please try again later'))
    }
})

export const createAuthRateLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json(buildRateLimitResponse('Too many authentication attempts, please try again later'))
    }
})
