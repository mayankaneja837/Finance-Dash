const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Validation failed' },
    errors: {
      type: 'array',
      items: { type: 'string' },
      example: ['email: Invalid email']
    }
  },
  required: ['success', 'message']
} as const

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'cm123abc' },
    name: { type: 'string', example: 'Jane Doe' },
    email: { type: 'string', format: 'email', example: 'jane@example.com' },
    role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ANALYST' },
    isActive: { type: 'boolean', example: true },
    createdAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'email', 'role']
} as const

const transactionSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'txn_123' },
    amount: { type: 'integer', example: 1200 },
    type: { type: 'string', enum: ['Income', 'Expense'], example: 'Income' },
    category: { type: 'string', example: 'Salary' },
    date: { type: 'string', format: 'date-time', example: '2026-04-01T00:00:00.000Z' },
    notes: { type: 'string', nullable: true, example: 'April salary' },
    userId: { type: 'string', example: 'cm123abc' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    deletedAt: { type: 'string', format: 'date-time', nullable: true }
  },
  required: ['id', 'amount', 'type', 'category', 'date', 'userId']
} as const

const authSuccessSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: userSchema
      },
      required: ['token', 'user']
    }
  },
  required: ['success', 'data']
} as const

const userEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: userSchema
  },
  required: ['success', 'data']
} as const

const userListEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: userSchema
    }
  },
  required: ['success', 'data']
} as const

const transactionEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: transactionSchema
  },
  required: ['success', 'data']
} as const

const paginatedTransactionsSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: transactionSchema
    },
    meta: {
      type: 'object',
      properties: {
        page: { type: 'integer', example: 1 },
        pageSize: { type: 'integer', example: 20 },
        totalItems: { type: 'integer', example: 42 },
        totalPages: { type: 'integer', example: 3 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      },
      required: ['page', 'pageSize', 'totalItems', 'totalPages', 'hasNextPage', 'hasPreviousPage']
    }
  },
  required: ['success', 'data', 'meta']
} as const

const messageEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: 'Transaction deleted' }
  },
  required: ['success', 'message']
} as const

const summarySchema = {
  type: 'object',
  properties: {
    totalIncome: { type: 'integer', example: 5000 },
    totalExpenses: { type: 'integer', example: 2200 },
    netBalance: { type: 'integer', example: 2800 }
  },
  required: ['totalIncome', 'totalExpenses', 'netBalance']
} as const

const categoryBreakdownItemSchema = {
  type: 'object',
  properties: {
    category: { type: 'string', example: 'Salary' },
    type: { type: 'string', enum: ['Income', 'Expense'], example: 'Income' },
    total: { type: 'integer', example: 5000 }
  },
  required: ['category', 'type', 'total']
} as const

const monthlyTrendItemSchema = {
  type: 'object',
  properties: {
    month: { type: 'string', example: '2026-04' },
    income: { type: 'integer', example: 5000 },
    expenses: { type: 'integer', example: 2200 }
  },
  required: ['month', 'income', 'expenses']
} as const

const recentActivityItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: 'txn_123' },
    amount: { type: 'integer', example: 300 },
    type: { type: 'string', enum: ['Income', 'Expense'], example: 'Expense' },
    category: { type: 'string', example: 'Food' },
    date: { type: 'string', format: 'date-time', example: '2026-04-05T00:00:00.000Z' },
    notes: { type: 'string', nullable: true, example: 'Lunch with team' }
  },
  required: ['id', 'amount', 'type', 'category', 'date']
} as const

const summaryEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: summarySchema
  },
  required: ['success', 'data']
} as const

const categoryBreakdownEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: categoryBreakdownItemSchema
    }
  },
  required: ['success', 'data']
} as const

const monthlyTrendsEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: monthlyTrendItemSchema
    }
  },
  required: ['success', 'data']
} as const

const recentActivityEnvelopeSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: {
      type: 'array',
      items: recentActivityItemSchema
    }
  },
  required: ['success', 'data']
} as const

const healthEnvelopeSchema = {
  type: 'string',
  example: 'Ping'
} as const

const unauthorizedResponse = {
  description: 'Missing or invalid bearer token',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

const forbiddenResponse = {
  description: 'Insufficient permissions',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

const validationResponse = {
  description: 'Validation failed',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

const notFoundResponse = {
  description: 'Resource not found',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

const tooManyRequestsResponse = {
  description: 'Rate limited',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

const internalServerErrorResponse = {
  description: 'Unexpected server error',
  content: {
    'application/json': {
      schema: errorResponseSchema
    }
  }
} as const

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Finance Dash API',
    version: '1.0.0',
    description: 'REST API for finance records, dashboard analytics, user management, and role-based access control.'
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Transactions' },
    { name: 'Dashboard' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: errorResponseSchema,
      User: userSchema,
      Transaction: transactionSchema,
      AuthSuccess: authSuccessSchema,
      UserEnvelope: userEnvelopeSchema,
      UserListEnvelope: userListEnvelopeSchema,
      TransactionEnvelope: transactionEnvelopeSchema,
      PaginatedTransactions: paginatedTransactionsSchema,
      MessageEnvelope: messageEnvelopeSchema,
      SummaryEnvelope: summaryEnvelopeSchema,
      CategoryBreakdownEnvelope: categoryBreakdownEnvelopeSchema,
      MonthlyTrendsEnvelope: monthlyTrendsEnvelopeSchema,
      RecentActivityEnvelope: recentActivityEnvelopeSchema
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'API reachable',
            content: {
              'text/plain': {
                schema: healthEnvelopeSchema
              }
            }
          }
        }
      }
    },
    '/openapi.json': {
      get: {
        tags: ['Auth'],
        summary: 'Get the OpenAPI document',
        responses: {
          '200': {
            description: 'OpenAPI document returned'
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new viewer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Viewer User' },
                  email: { type: 'string', format: 'email', example: 'viewer@example.com' },
                  password: { type: 'string', minLength: 6, example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User created',
            content: {
              'application/json': {
                schema: userEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '409': {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: errorResponseSchema
              }
            }
          },
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'viewer@example.com' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Authenticated successfully',
            content: {
              'application/json': {
                schema: authSuccessSchema
              }
            }
          },
          '400': validationResponse,
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: errorResponseSchema
              }
            }
          },
          '403': {
            description: 'Inactive account',
            content: {
              'application/json': {
                schema: errorResponseSchema
              }
            }
          },
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/user': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'List all users',
        responses: {
          '200': {
            description: 'Users returned',
            content: {
              'application/json': {
                schema: userListEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      post: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', example: 'Analyst User' },
                  email: { type: 'string', format: 'email', example: 'analyst@example.com' },
                  password: { type: 'string', minLength: 6, example: 'password123' },
                  role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ANALYST' },
                  isActive: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: userEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '409': {
            description: 'User already exists',
            content: {
              'application/json': {
                schema: errorResponseSchema
              }
            }
          },
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/user/{id}': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get a user by id',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'User returned',
            content: {
              'application/json': {
                schema: userEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      patch: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Update a user role or status',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'], example: 'ANALYST' },
                  isActive: { type: 'boolean', example: false }
                },
                minProperties: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: userEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      delete: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete a user',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'User deleted',
            content: {
              'application/json': {
                schema: messageEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/transaction': {
      get: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        summary: 'List transactions with filters, search, and pagination',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['Income', 'Expense'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } }
        ],
        responses: {
          '200': {
            description: 'Transactions returned',
            content: {
              'application/json': {
                schema: paginatedTransactionsSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      post: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        summary: 'Create a transaction',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount', 'type', 'category', 'date'],
                properties: {
                  amount: { type: 'integer', example: 1200 },
                  type: { type: 'string', enum: ['Income', 'Expense'], example: 'Income' },
                  category: { type: 'string', example: 'Salary' },
                  date: { type: 'string', format: 'date-time', example: '2026-04-01T00:00:00.000Z' },
                  notes: { type: 'string', example: 'April salary' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Transaction created',
            content: {
              'application/json': {
                schema: transactionEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/transaction/{id}': {
      get: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        summary: 'Get a transaction',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Transaction returned',
            content: {
              'application/json': {
                schema: transactionEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      patch: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        summary: 'Update a transaction',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  amount: { type: 'integer', example: 1500 },
                  type: { type: 'string', enum: ['Income', 'Expense'] },
                  category: { type: 'string', example: 'Bonus' },
                  date: { type: 'string', format: 'date-time', example: '2026-04-10T00:00:00.000Z' },
                  notes: { type: 'string', example: 'Updated note' }
                },
                minProperties: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Transaction updated',
            content: {
              'application/json': {
                schema: transactionEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      },
      delete: {
        tags: ['Transactions'],
        security: [{ bearerAuth: [] }],
        summary: 'Soft delete a transaction',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': {
            description: 'Transaction deleted',
            content: {
              'application/json': {
                schema: messageEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '404': notFoundResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: 'Get top-line financial summary',
        responses: {
          '200': {
            description: 'Summary returned',
            content: {
              'application/json': {
                schema: summaryEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/dashboard/categories': {
      get: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: 'Get category totals',
        responses: {
          '200': {
            description: 'Category breakdown returned',
            content: {
              'application/json': {
                schema: categoryBreakdownEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/dashboard/trends': {
      get: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: 'Get monthly income and expense trends',
        responses: {
          '200': {
            description: 'Monthly trends returned',
            content: {
              'application/json': {
                schema: monthlyTrendsEnvelopeSchema
              }
            }
          },
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    },
    '/dashboard/recent': {
      get: {
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        summary: 'Get recent transaction activity',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 5, minimum: 1, maximum: 50 } }
        ],
        responses: {
          '200': {
            description: 'Recent activity returned',
            content: {
              'application/json': {
                schema: recentActivityEnvelopeSchema
              }
            }
          },
          '400': validationResponse,
          '401': unauthorizedResponse,
          '403': forbiddenResponse,
          '429': tooManyRequestsResponse,
          '500': internalServerErrorResponse
        }
      }
    }
  }
} as const
