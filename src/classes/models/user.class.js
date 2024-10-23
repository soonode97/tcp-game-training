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
    this.socket.wrtie(createPingPacket(now));
  }

  // RTT, 왕복 시간을 받았을 때 처리하기 위한 함수
  // data에는 내가 핑을 보냈을 때 시간을 그대로 받아서 처리함.
  handlePong(data) {
    const now = Date.now();

    this.latency = (now - data.timestamp) / 2;
  }
}

export default User;
