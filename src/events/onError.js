import CustomError from '../utils/error/customError.js';
import { removeUser } from '../sessions/user.session.js';

export const onError = (socket) => async (err) => {
  console.error('Socket error:', err);
  handlerError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

  // 에러가 발생했으면 세션에서 유저 삭제하도록 함.
  removeUser(socket);
};
