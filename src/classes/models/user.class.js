import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(socket, deviceId, playerId, latency, x, y) {
    this.socket = socket;
    this.id = deviceId; // 유저의 디바이스 아이디(현재 닉네임느낌)
    this.playerId = playerId; // 클라에서 보내주는 플레이어 ID
    this.latency = latency; // 유저의 레이턴시
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();

    console.log(`[${this.id}] ping`);
    this.socket.write(createPingPacket(now));
  }

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
    const distance = speed * timeDiff; // 현재 레이턴시를 1로 고정하고 있음.

    return {
      x: this.x + distance,
      y: this.y + distance,
    };
  }
}

export default User;
