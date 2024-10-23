import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import IntervalManager from '../managers/interval.manager.js';

class Game {
  constructor(id) {
    // Game의 id를 통해 세션을 구분함. 또한 유저가 해당 세션에 찾아갈 수 있도록 함.
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    // 세션에 추가하기 전 최대 참가 유저수를 확인
    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      throw new Error('Game Session is full.');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);

    if (this.users.length === MAX_PLAYER_TO_GAME_SESSIONS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYER_TO_GAME_SESSIONS) {
      this.state = 'waiting';
    }
  }

  startGame() {
    this.state = 'inProgress';
  }

  endGame() {
    this.state = 'waiting';
  }
}

export default Game;
