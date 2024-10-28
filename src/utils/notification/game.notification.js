/** 게임 중 유저에게 알려주기 위한 함수 스크립트 */

import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { PACKET_TYPE } from '../../constants/header.js';

// 알려주는 패킷을 만들어주기 위한 함수
const makeNotification = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(config.packet.totalLength + config.packet.typeLength + message.length);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

/** 유저들의 위치정보를 알려주기 위한 패킷 */
export const createLocationPacket = (users) => {
  const protoMessages = getProtoMessages();
  const location = protoMessages.gameNotification.LocationUpdate;

  const payload = { users };
  // console.log(users);
  const message = location.create(payload);
  const locationPacket = location.encode(message).finish();
  return makeNotification(locationPacket, PACKET_TYPE.LOCATION);
};

/** 게임 시작을 알려주기 위한 패킷 */
export const gameStartPacket = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const start = protoMessages.gameNotification.Start;

  const payload = { gameId, timestamp };
  const message = start.create(payload);
  const startPacket = start.encode(message).finish();
  return makeNotification(startPacket, PACKET_TYPE.GAME_START);
};

/** 핑 패킷을 알려주기 위한 패킷 */
export const createPingPacket = (timestamp) => {
  const protoMessages = getProtoMessages();
  const ping = protoMessages.common.Ping;

  const payload = { timestamp };
  const message = ping.create(payload);
  const pingPacket = ping.encode(message).finish();

  return makeNotification(pingPacket, PACKET_TYPE.PING);
};
