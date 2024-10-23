import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.latency = 0; // 없어도 문제 없음. 단지 명확하게 보기 위해 선언
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }

  // 본인한테 핑을 보내는 함수
  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

  // RTT, 왕복 시간을 받았을 때 처리하기 위한 함수
  // data에는 내가 핑을 보냈을 때 시간을 그대로 받아서 처리함.
  handlePong(data) {
    const now = Date.now();
    // console.log(now, data.timestamp);
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 게임 세션의 모든 유저 중 가장 높은 레이턴시 값으로 계산할 것이기 때문에 인자로 latency를 받음
  calculatePosition(latency) {
    const timeDiff = latency / 1000; // ms이므로 초 단위로 바꿈
    const speed = 1; // 거리 = 속력 * 시간인데, 속도를 1로 고정시키도록 함. (속도가 달라지면 계산식이 달라짐)
    const distance = speed * timeDiff;

    return {
      x: this.x + distance,
      y: this.y,
    };
  }
}

export default User;
