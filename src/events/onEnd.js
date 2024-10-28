import { gameSessions } from '../sessions/sessions.js';
import { getUserBySocket, removeUser } from '../sessions/user.session.js';
import { updateUserLocation } from '../utils/db/user/user.db.js';

// 접속 해제 시 시퀀스
export const onEnd = (socket) => async () => {
  // 이미 접속 및 DB에 저장된 유저이기 때문에 검증이 필요없음.
  const user = getUserBySocket(socket);
  console.log(`${user.id} Client disconnected`);
  console.log(user);

  // 1. 유저의 마지막 위치 저장
  await updateUserLocation(user.id, user.x, user.y);

  // 2. 게임 세션에서 유저 삭제
  gameSessions[0].removeUser(user.id);

  removeUser(socket);
};
