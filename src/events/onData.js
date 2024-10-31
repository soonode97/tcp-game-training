import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../sessions/user.session.js';
import { handleError } from '../utils/errors/errorHandler.js';
import { packetParser, pingPacketParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength; // 4+1 = 5
  while (socket.buffer.length >= totalHeaderLength) {
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // 소켓에서 전달받은 패킷의 전체 길이가 length 이상인 경우 수행
    if (socket.buffer.length >= length) {
      const packet = socket.buffer.subarray(totalHeaderLength, length);

      socket.buffer = socket.buffer.subarray(length);
      // console.log(`length: ${length}, packetType:${packetType}`);
      // console.log(`packet: ${packet}`);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING: {
            const { user, pingMessage } = pingPacketParser(socket, packet);
            user.handlePong(pingMessage);
            break;
          }
          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload } = packetParser(packet);

            const handler = getHandlerById(handlerId);

            await handler({ socket, userId, payload });
            break;
          }
        }
      } catch (e) {
        handleError(socket, e);
      }
    }
  }
};
