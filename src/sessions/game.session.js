/** 게임 세션들을 제어하기 위한 함수 */

import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);

  if (index !== -1) {
    return gameSessions.splice(index, 1);
  }
};

export const getGameSession = () => {
  // return gameSessions.find((session) => session.id === id);
  return gameSessions[0];
};

export const getAllGameSessions = (id) => {
  return gameSessions;
};
