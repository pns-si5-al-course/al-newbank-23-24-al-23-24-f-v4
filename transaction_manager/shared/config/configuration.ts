export default () => ({
    port: process.env.APP_PORT,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    validator_url: process.env.VALIDATOR_URL,
    processor_url: process.env.PROCESSOR_URL,
  });