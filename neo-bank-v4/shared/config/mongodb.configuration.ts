import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 27017,
  database: process.env.DB_NAME,
}));