/** 패킷의 이름을 정의한 파일 */

export const packetNames = {
  common: {
    Packet: 'common.CommonPacket',
  },
  initial: {
    InitialPayload: 'initial.InitialPayload',
  },
  gameNotification: {
    LocationUpdatePayload: 'gameNotification.LocationUpdatePayload',
    LocationUpdate: 'gameNotification.LocationUpdate',
  },
  response: {
    Response: 'response.Response',
  },
  game: {
    Start: 'game.Start',
  },
};
