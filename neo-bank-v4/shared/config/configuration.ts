export default () => ({
    port: process.env.APP_PORT,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    account_url: process.env.ACCOUNT_URL,
    transaction_url: process.env.TRANSACTION_URL,
  });