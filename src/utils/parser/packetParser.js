/** 패킷을 파싱해주는 스크립트 */

import { config } from '../../config/config.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../errors/customError.js';
import { ErrorCodes } from '../errors/errorCodes.js';

export const packetParser = (data) => {
  // 1. 패킷을 파싱하기 전 프로토파일을 가져오기
  const protoMessages = getProtoMessages();

  // 2. 공통 패킷 디코드
  const commonPacket = protoMessages.common.Packet;
  let packet;

  try {
    packet = commonPacket.decode(data);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.version;

  // 3. 클라이언트 버전 체크
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  // 4. 패킷의 페이로드 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);

  const [namespace, typeName] = protoTypeName.split('.');

  const payloadType = protoMessages[namespace][typeName];
  console.log(namespace, typeName);
  let payload;

  try {
    payload = payloadType.decode(packet.payload);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  // 5. 패킷 구조 확인
  const errorMessage = payloadType.verify(payload);
  if (errorMessage) {
    throw new CustomError(ErrorCodes.INVALID_PACKET, '패킷 구조가 일치하지 않습니다.');
  }

  // 6. 필수 필드가 비어있는지 확인
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    throw new CustomError(ErrorCodes.MISSING_FIELDS, '필수 필드가 누락되었습니다.');
  }

  return { handlerId, userId, payload };
};
