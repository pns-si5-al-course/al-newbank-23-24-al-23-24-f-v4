import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  host: process.env.MONGO_DB_HOST,
  port: parseInt(process.env.MONGO_DB_PORT, 10) || 27017,
  database: process.env.MONGO_DB_NAME,
}));