import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB2_NAME = process.env.DB2_NAME || 'user_db';
export const DB2_USER = process.env.DB2_USER || 'root';
export const DB2_PASSWORD = process.env.DB2_PASSWORD || '';
export const DB2_HOST = process.env.DB2_HOST || '';
export const DB2_PORT = process.env.DB2_PORT || 5555;

export const MAX_PLAYER_TO_GAME_SESSIONS = process.env.MAX_PLAYER_TO_GAME_SESSIONS || 2;
