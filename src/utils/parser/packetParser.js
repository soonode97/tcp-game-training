import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';

export const packetParser = (data) => {
  // 패킷을 파싱하기 전 프로토파일을 불러온다.
  const protoMessages = getProtoMessages();

  // ------------------------
  // 1. 공통 패킷 구조를 디코딩
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

  // 2. 클라이언트 버전 체크 (검증1)
  // console.log(`Client Version: ${clientVersion}`);
  if (clientVersion !== config.client.version) {
    console.error(`클라이언트 버전이 일치하지 않습니다.`);
  }

  // -------------------------
  // 3. 패킷의 페이로드 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);

  // 아래 에러처리는 이미 getProtoTypeNameByHandlerId 에서 하고있는 로직으로 주석처리
  // if(!protoTypeName) {
  //   console.error(`알 수 없는 핸들러 ID: ${handlerId}`);
  // }

  // index.js에 있는 initial.InitialPacket을 예로 들어 설명
  // namespace는 initial, typeName은 InitialPacket이 담길예정.
  const [namespace, typeName] = protoTypeName.split('.');

  const payloadType = protoMessages[namespace][typeName];
  let payload;

  try {
    payload = payloadType.decode(packet.payload);
  } catch (e) {
    console.error(e);
  }

  // 4. 패킷 구조가 잘못되었을 수 있으니 에러를 확인 (검증2)
  // 위에서 payload가 잘 디코딩되었지만 데이터가 뭔가 원활하지 않은 경우 처리
  // 하지만 위 decode에서 이런 과정을 거치기 때문에 의미가 크게 있지 않음.
  const errorMessage = payloadType.verify(payload);
  if (errorMessage) {
    console.error(errorMessage);
  }

  // 5. 필드가 비어있는 경우 => 필수 필드가 누락되어 있는 경우 처리 (검증3)
  // 이 payloadType의 필드는 프로토버퍼 메시지에 담긴 값들이다.
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    console.log(`missingField가 있습니다: ${missingFields.join(', ')}`);
  }

  return { handlerId, userId, payload, sequence };
};
