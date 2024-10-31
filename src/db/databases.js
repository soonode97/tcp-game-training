/** DB 연동 및 커넥션 풀 생성하는 스크립트 */

import { config } from '../config/config.js';
import pg from 'pg';
import { formatDate } from '../utils/transform/dateFormatter.js';

const { databases } = config;

const createPool = (dbConfig) => {
  const pool = new pg.Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    max: 10, // 풀에서 최대 클라이언트 수
    idleTimeoutMillis: 30000, // 유휴 클라이언트가 닫히기 전까지의 시간 (밀리초)
    connectionTimeoutMillis: 2000, // 연결 시도 시간 초과 (밀리초)
  });

  const originalQuery = pool.query;

  // 어떤 DB 요청이 이루어지면 터미널에 로그를 남기기 위해 originalQuery 를 만들었다.
  pool.query = (sql, params) => {
    const date = new Date();
    // 쿼리 실행시 로그
    console.log(
      `[${formatDate(date)}] Executing query: ${sql}${params ? `, ${JSON.stringify(params)}` : ``}`,
    );
    return originalQuery.call(pool, sql, params);
  };

  return pool;
};

// 여러 데이터베이스 커넥션 풀 생성
const pools = {
  USER_DB: createPool(databases.USER_DB),
};

export default pools;
