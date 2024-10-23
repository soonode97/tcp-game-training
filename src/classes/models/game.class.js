import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import {
  createLocationPacket,
  gameStartPacket,
} from '../../utils/notification/game.notification.js';
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

    // 최대 참가인원 만큼 인원이 있는 경우 3초뒤에 자동 시작되도록 설정
    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  // 게임 세션에서 유저가 나갈 경우 처리하는 함수
  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

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

  startGame() {
    this.state = 'inProgress';

    const startPacket = gameStartPacket(this.id, Date.now());
    console.log(this.getMaxLatency());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  // 게임에 참가한 모든 유저의 위치 정보를 보내기 위한 함수
  // 패킷을 생성하여 보내도록 함
  getAllLocation() {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.id, x, y };
    });

    return createLocationPacket(locationData);
  }

  endGame() {
    this.state = 'waiting';
  }
}

export default Game;
