import { gameSessions, userSessions } from '../sessions/sessions.js';
import { removeUser } from '../sessions/user.session.js';

export const onEnd = (socket) => () => {
  console.log('Client disconnected');

  console.log(userSessions);
  console.log(gameSessions);

  removeUser(socket);
};
