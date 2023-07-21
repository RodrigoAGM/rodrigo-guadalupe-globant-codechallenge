import { config } from 'dotenv';

// Config dotenv to access env vars
config();

export = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
}
