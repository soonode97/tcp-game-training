import { getProtoMessages } from '../../init/loadProtos.js';

export const packetParser = (data) => {
  // 패킷을 파싱하기 전 프로토파일을 불러온다.
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코팅
  // packetNames.js의 common.Packet을 불러오기 위함
  const Packet = protoMessages.common.Packet;
  let packet;
  try {
    // decode를 하게되면 common.proto에서 정의했던 message Packet 객체에 대한 내용이 담긴다.
    packet = Packet.decode(data);
  } catch (e) {
    console.error(e);
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  const sequence = packet.sequence;
  const payload = packet.payload;

  console.log(`Client Version: ${clientVersion}`);

  return { handlerId, userId, payload, sequence };
};
