const commonErrorSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Validation failed' },
        errors: {
            type: 'array',
            items: { type: 'string' }
        }
    },
    required: ['success', 'message']
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
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ErrorResponse: commonErrorSchema,
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'] },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Transaction: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    amount: { type: 'integer' },
                    type: { type: 'string', enum: ['Income', 'Expense'] },
                    category: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    notes: { type: 'string', nullable: true },
                    userId: { type: 'string' }
                }
            },
            PaginatedTransactions: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Transaction' }
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
                        }
                    }
                }
            }
        }
    },
    tags: [
        { name: 'Auth' },
        { name: 'Users' },
        { name: 'Transactions' },
        { name: 'Dashboard' }
    ],
    paths: {
        '/health': {
            get: {
                tags: ['Auth'],
                summary: 'Health check',
                responses: {
                    '200': { description: 'API reachable' }
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
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'User created' },
                    '400': { description: 'Validation failed', content: { 'application/json': { schema: commonErrorSchema } } },
                    '409': { description: 'User already exists', content: { 'application/json': { schema: commonErrorSchema } } },
                    '429': { description: 'Rate limited', content: { 'application/json': { schema: commonErrorSchema } } }
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
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Authenticated successfully' },
                    '401': { description: 'Invalid credentials', content: { 'application/json': { schema: commonErrorSchema } } },
                    '403': { description: 'Inactive account', content: { 'application/json': { schema: commonErrorSchema } } },
                    '429': { description: 'Rate limited', content: { 'application/json': { schema: commonErrorSchema } } }
                }
            }
        },
        '/user': {
            get: {
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                summary: 'List all users',
                responses: {
                    '200': { description: 'Users returned' },
                    '403': { description: 'Admin only', content: { 'application/json': { schema: commonErrorSchema } } }
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
                                    name: { type: 'string' },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 6 },
                                    role: { type: 'string', enum: ['VIEWER', 'ANALYST', 'ADMIN'] },
                                    isActive: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'User created' },
                    '400': { description: 'Validation failed', content: { 'application/json': { schema: commonErrorSchema } } },
                    '409': { description: 'User already exists', content: { 'application/json': { schema: commonErrorSchema } } }
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
                ]
            },
            patch: {
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                summary: 'Update a user role or status',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ]
            },
            delete: {
                tags: ['Users'],
                security: [{ bearerAuth: [] }],
                summary: 'Delete a user',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ]
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
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedTransactions' } } }
                    }
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
                                    amount: { type: 'integer' },
                                    type: { type: 'string', enum: ['Income', 'Expense'] },
                                    category: { type: 'string' },
                                    date: { type: 'string', format: 'date-time' },
                                    notes: { type: 'string' }
                                }
                            }
                        }
                    }
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
                ]
            },
            patch: {
                tags: ['Transactions'],
                security: [{ bearerAuth: [] }],
                summary: 'Update a transaction',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ]
            },
            delete: {
                tags: ['Transactions'],
                security: [{ bearerAuth: [] }],
                summary: 'Soft delete a transaction',
                parameters: [
                    { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
                ]
            }
        },
        '/dashboard/summary': {
            get: {
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                summary: 'Get top-line financial summary'
            }
        },
        '/dashboard/categories': {
            get: {
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                summary: 'Get category totals'
            }
        },
        '/dashboard/trends': {
            get: {
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                summary: 'Get monthly income and expense trends'
            }
        },
        '/dashboard/recent': {
            get: {
                tags: ['Dashboard'],
                security: [{ bearerAuth: [] }],
                summary: 'Get recent transaction activity',
                parameters: [
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 5, minimum: 1, maximum: 50 } }
                ]
            }
        }
    }
} as const
