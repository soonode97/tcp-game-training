/** 서버에 접속한 유저에 대해 작동하는 함수들 스크립트 */

import User from '../classes/models/user.class.js';
import { userSessions } from './sessions.js';

// 유저 접속 시 유저를 추가시켜준다.
// 유저는 클래스화 시킬 예정
export const addUser = (socket, deviceId, playerId, latency, x, y) => {
  // 이미 유저가 있는지 확인
  const user = new User(socket, deviceId, playerId, latency, x, y);
  userSessions.push(user);
  console.log(`유저세션 추가 후 접속한 유저 현황: ${JSON.stringify(userSessions)}`);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);

  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (userId) => {
  return userSessions.find((user) => user.id === userId);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
