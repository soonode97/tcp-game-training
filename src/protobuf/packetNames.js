export const packetNames = {
  // 서버에서 일방적으로 보내는 종류의 패킷
  common: {
    Packet: 'common.Packet',
    Ping: 'common.Ping',
  },
  // 소켓에 연결되었을 때 보내는 종류의 패킷
  initial: {
    InitialPacket: 'initial.InitialPacket',
  },
  // 게임에 관련된 이벤트를 보내는 종류의 패킷
  game: {
    CreateGamePayload: 'game.CreateGamePayload',
    JoinGamePayload: 'game.JoinGamePayload',
    UpdateLocationPayload: 'game.UpdateLocationPayload',
  },
  // 클라이언트에서 응답해주는 혹은 요청하는 종류의 패킷
  response: {
    Response: 'response.Response',
  },
  // 게임에서 정보를 알려줄 때 보내는 종류의 패킷
  gameNotification: {
    UpdateLocation: 'gameNotification.UpdateLocation',
    Start: 'gameNotification.Start',
  },
};
