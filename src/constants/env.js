import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

export const DB1_NAME = process.env.DB1_NAME || 'GAME_DB';
export const DB1_USER = process.env.DB1_USER || 'root';
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'aaaa4321';
export const DB1_HOST = process.env.DB1_HOST || '127.0.0.1';
export const DB1_PORT = process.env.DB1_PORT || 3307;

export const DB2_NAME = process.env.DB2_NAME || 'USER_DB';
export const DB2_USER = process.env.DB2_USER || 'root';
export const DB2_PASSWORD = process.env.DB2_PASSWORD || 'aaaa4321';
export const DB2_HOST = process.env.DB2_HOST || '127.0.0.1';
export const DB2_PORT = process.env.DB2_PORT || 3307;

export const MAX_PLAYER_TO_GAME_SESSIONS = process.env.MAX_PLAYER_TO_GAME_SESSIONS || 2;
