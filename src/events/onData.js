import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { getHandlerById } from '../handlers/index.js';
import { getProtoMessages } from '../init/loadProtos.js';
import { getUserById, getUserBySocket } from '../sessions/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handlerError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

/**
 * @param {*} socket
 * @returns
 *
 * 데이터를 받아서 처리하기 전, 스트림 개념을 알아야 함.
 * 버퍼가 chunk라는 형태로 쪼개져서 전달하는데 이때 원하는 데이터를 조건에 맞게 전달받았을 경우에
 * 처리를 할 수 있도록 로직을 처리해야 한다.
 *
 * => 데이터는 스트림을 통해 청크단위로 조금씩 전송받게 되는데
 * 우리가 원하는 데이터가 들어올때까지 계속 대기하다가 원하는 데이터가 도착하면 처리하는 형태
 */

export const onData = (socket) => async (data) => {
  // 2. 소켓에서 1바이트씩 버퍼의 chunk 데이터가 계속 들어올텐데
  // concat(합치기)을 통해 새로운데이터를 합쳐주는 작업을 해야 함.
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 1. 우리가 지정한 header의 길이인 5바이트까지는 데이터의 실제 정보 (payload)가 담겨있지 않기 때문에
  // 6바이트 이상이 될 때까지 데이터를 계속 받아오는 작업을 진행
  const totalHeaerLength = config.packet.totalLength + config.packet.typeLength;
  while (socket.buffer.length >= totalHeaerLength) {
    // 3. 버퍼의 앞 5바이트까지는 헤더이기 때문에 해당 부분을 따로 저장한다.
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // 4. while이 종료되는 조건을 지정해주어야 한다.
    // 5. 소켓에서 전달받은 패킷의 전체 길이가 length 이상인 경우 수행할 수 있도록 함.
    if (socket.buffer.length >= length) {
      // 5-1. 우리가 원하는 패킷의 내용을 잘 확인할 수 있도록 패킷타입부터 잘라낸다
      const packet = socket.buffer.subarray(totalHeaerLength, length);
      // 5-2. 다음 패킷의 내용도 버퍼에 전달되었을 가능성이 있으니 다음 패킷은 잘라낼 수 있도록 한다.
      socket.buffer = socket.buffer.subarray(length);
      console.log(`length: ${length}, packetType:${packetType}`);
      console.log(`packet: ${packet}`);

      try {
        switch (packetType) {
          case PACKET_TYPE.PING: {
            const protoMessages = getProtoMessages();
            const ping = protoMessages.common.Ping;
            const pingMessage = ping.decode(packet);
            const user = getUserBySocket(socket);

            if (!user) {
              throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
            }
            user.handlePong(pingMessage);
            break;
          }
          case PACKET_TYPE.NORMAL: {
            const { handlerId, userId, payload, sequence } = packetParser(packet);

            const user = getUserById(userId);
            if (user && user.sequence !== sequence) {
              throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다.');
            }

            const handler = getHandlerById(handlerId);

            await handler({ socket, userId, payload });

            // console.log('------------------------');
            // console.log(`handlerId: ${handlerId}`);
            // console.log(`userId: ${userId}`);
            // console.log(`payload: ${payload}`);
            // console.log(`sequence: ${sequence}`);
            break;
          }
        }
      } catch (e) {
        handlerError(socket, e);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않았을 경우
      break;
    }
  }
};
