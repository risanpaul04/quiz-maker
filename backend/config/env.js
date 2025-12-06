import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    MONGO_URI,
    NODE_ENV,
    DOMAIN,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRY,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRY,

    
} = process.env