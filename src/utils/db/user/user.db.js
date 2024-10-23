/** user.queries.js 에서 작성한 쿼리문을 실행시키는 파일 */

import pools from '../../../db/database.js';
import { toCamelCase } from '../../transformCase.js';
import { SQL_QUERIES } from './user.queries.js';
import { v4 as uuidv4 } from 'uuid';

export const findUserByDeviceId = async (deviceId) => {
  const result = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(result.rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};
