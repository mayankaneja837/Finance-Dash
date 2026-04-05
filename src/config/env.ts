import dotenv from 'dotenv'
dotenv.config()

const getTestDatabaseUrl = () => {
    if (process.env.TEST_DATABASE_URL) {
        return process.env.TEST_DATABASE_URL
    }

    if (!process.env.DATABASE_URL) {
        return undefined
    }

    const url = new URL(process.env.DATABASE_URL)
    url.searchParams.set('schema', 'finance_dash_test')

    return url.toString()
}

export const env = {
    port : Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || 'development',
    JWT_SECRET : process.env.JWT_SECRET,
    DATABASE_URL : process.env.NODE_ENV === 'test'
        ? getTestDatabaseUrl()
        : process.env.DATABASE_URL,
    TEST_DATABASE_URL: getTestDatabaseUrl()
}
