/** user 폴더는 유저 정보를 가지고 db에서 작업할 파일들이 모여있는 곳 */

/** user.queries.js 는 db에서 유저 정보에 대해 다루는 쿼리를 정의하는 곳 */

export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM "user" WHERE "device_id" = $1', // 모바일 게임 기준에서 해당 기기의 고유 넘버이기 때문에 UUID 대체로 사용이 가능
  CREATE_USER: 'INSERT INTO "user" (id, device_id) VALUES ($1, $2)',
  UPDATE_USER_LOGIN: 'UPDATE "user" SET "last_login" = CURRENT_TIMESTAMP WHERE "id" = $1',
};
