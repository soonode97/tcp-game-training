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
    this.dx = 0; // 마지막 x 위치
    this.dy = 0; // 마지막 y 위치
    this.speed = 3;
  }

  updatePosition(x, y) {
    // 먼저 마지막 위치를 저장
    this.dx = this.x;
    this.dy = this.y;
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
    const timestamp = data.timestamp.toNumber();
    this.latency = (now - timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // // 게임 세션의 모든 유저 중 가장 높은 레이턴시 값으로 계산할 것이기 때문에 인자로 latency를 받음
  // calculatePosition(latency) {
  //   if (this.x === this.dx && this.y === this.dy) {
  //     return {
  //       x: this.x,
  //       y: this.y,
  //     };
  //   }

  //   const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;

  //   // 지연 시간 동안 이동한 거리 계산
  //   const distance = this.speed * timeDiff;

  //   // 예측된 위치 계산
  //   const directionX = this.x !== this.dx ? Math.sign(this.x - this.dx) : 0;
  //   const directionY = this.y !== this.dy ? Math.sign(this.y - this.dy) : 0;

  //   return {
  //     x: this.x + directionX * distance,
  //     y: this.y + directionY * distance,
  //   };
  // }

  calculatePosition(latency) {
    if (this.x === this.dx && this.y === this.dy) {
      return {
        x: this.x,
        y: this.y,
      };
    }

    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;

    // 목표 지점까지의 거리 계산
    const directionX = this.dx - this.x;
    const directionY = this.dy - this.y;
    const distanceToTarget = Math.sqrt(directionX ** 2 + directionY ** 2);

    // 지연 시간 동안 이동할 거리 계산
    const distance = this.speed * timeDiff;

    // 목표 지점까지의 거리를 초과하지 않도록 비율로 계산
    const ratio = Math.min(distance / distanceToTarget, 1);

    // 예측된 위치 계산
    return {
      x: this.x + directionX * ratio,
      y: this.y + directionY * ratio,
    };
  }
}

export default User;
