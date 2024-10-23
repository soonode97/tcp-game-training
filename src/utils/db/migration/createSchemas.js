/** 마이그레이션
 *
 * 간략하게 설명하자면 IDE 환경에서 작성한 코드를 DB에도 동일한 세팅으로 적용시키기 위한 작업
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../../../db/database.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// sql 파일을 실행시키는 함수
const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');

  // * trim => 빈칸을 지워주는 메서드
  // * filter 사용 이유 => 세미콜론 이후에도 빈칸이 있을 수 있으니 제외하기 위해 사용
  const queries = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    await pool.query(query);
  }
};

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));
    // 이후 다른 sql문 추가한 것이 있다면 아래 동일하게 추가..

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (e) {
    console.error(`데이터베이스 테이블 생성 중 오류 발생: ${e}`);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    // 1은 강제종료한다는 뜻.
    process.exit(1);
  });
