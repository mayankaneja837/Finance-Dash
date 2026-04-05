import express from 'express'
import swaggerUi from 'swagger-ui-express'
import authRouter from './modules/auth/auth.routes'
import usersRouter from './modules/user/user.routes'
import transactionRouter from './modules/transaction/transaction.routes'
import dashboardRouter from './modules/dashboard/dashboard.routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { createAuthRateLimiter, createGlobalRateLimiter } from './middleware/rateLimit'
import { openApiDocument } from './docs/openapi'

export const createApp = () => {
  const app = express()

  app.use(express.json())
  app.use(createGlobalRateLimiter())

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument)
  })

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))

  app.get('/health',(req,res)=>{
    res.status(200).send('Ping')
  })

  app.use('/auth', createAuthRateLimiter(), authRouter)
  app.use('/user',usersRouter)
  app.use('/transaction',transactionRouter)
  app.use('/dashboard',dashboardRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export const app = createApp()
