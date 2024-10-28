import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import {
  createLocationPacket,
  gameStartPacket,
} from '../../utils/notification/game.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting';
  }

  addUser(user) {
    // 세션에 추가하기 전 최대 참가 유저수를 확인
    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      throw new Error('Game Session is full.');
    }
    this.users.push(user);
    console.log(`${this.id} 게임 세션의 유저 현황: ${JSON.stringify(this.users)}`);

    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getAllUsers() {
    return this.users;
  }

  getUser(deviceId) {
    return this.users.find((user) => user.id === deviceId);
  }

  removeUser(userId) {
    // filter로 지우기
    this.users = this.users.filter((user) => user.id !== userId);

    // 유저가 삭제되고 게임 시작 최소 인원보다 작으면 대기상태로 만듦
    if (this.users.length < MAX_PLAYER_TO_GAME_SESSIONS) {
      this.state = 'waiting';
    }
  }

  // 각 유저마다 핑이 다를텐데 현재 프로젝트는 최고 핑을 기준으로 레이턴시를 계산할 예정
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  // 게임 시작을 위한 함수
  startGame() {
    this.state = 'inProgress';

    const startPacket = gameStartPacket(this.id, Date.now());
    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation(deviceId) {
    // const maxLatency = this.getMaxLatency();

    const locationData = this.users
      .filter((user) => user.id !== deviceId)
      .map((user) => {
        return { id: user.id, playerId: user.playerId, x: user.x, y: user.y };
      });

    return createLocationPacket(locationData);
  }
}

export default Game;
