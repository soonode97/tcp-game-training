/** 게임 내에서 게임과 관련된 모든 알림을 도와주는 로직이 모여있는 파일 */

import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';

const makeNotification = (message, type) => {
  // 패킷 길이 정보를 포함한 버퍼 생성
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(
    message.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );

  // 패킷 타입 정보를 포함한 버퍼 생성
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  // 길이 정보와 메시지를 함께 전송
  return Buffer.concat([packetLength, packetType, message]);
};

export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.UpdateLocation;

  const payload = { users };
  const message = Location.create(payload);
  const locationPacket = Location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

export const gameStartPacket = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Location = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = Location.create(payload);
  const startPacket = Location.encode(message).finish();
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

export const createPingPacket = (timestamp) => {
  // 1. 핑으로 정의한 프로토 메시지를 가져온다.
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  // 2. 페이로드에 인자로 받은 타임스탬프를 할당
  const payload = { timestamp };

  // 3. 메시지에는 ping에 페이로드를 생성
  const message = ping.create(payload);

  // 4. 핑 패킷에 메시지를 인코딩하여 만들어준다.
  const pingPacket = ping.encode(message).finish();

  return makeNotification(pingPacket, PACKET_TYPE.PING);
};
