/** 응답에 해주기 위한 패킷을 생성해주는 스크립트 */

import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (handlerId, responseCode, data = null, userId) => {
  const protoMessages = getProtoMessages();

  const responsePacket = protoMessages.response.Response;

  const responsePayload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    // 데이터는 있는 경우 버퍼로 가져오고 없으면 null로 넣기
    data: data ? Buffer.from(JSON.stringify(data)) : null,
  };

  const buffer = responsePacket.encode(responsePayload).finish();

  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUint32BE(
    buffer.length + config.packet.totalLength + config.packet.typeLength,
    0,
  );
  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(PACKET_TYPE.NORMAL);

  return Buffer.concat([packetLength, packetType, buffer]);
};
