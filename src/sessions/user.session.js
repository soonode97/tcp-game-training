import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, uuid) => {
  // const user = { socket, id: uuid, sequence: 0 };
  const user = new User(uuid, socket); // 위 구문을 클래스화 시켜서 전달하도록 함.
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);

  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

/**
 * 어떤 유저가 무언가 호출했을 때 데이터 처리가 끝나고 다음 응답을 해줄 때
 * 시퀀스넘버를 +1 증가한 값을 반환하여 다음 호출때는 증가된 시퀀스를 보낼 수 있도록 함.
 */
export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};
