/** 핸들러 매핑을 위한 파일 */

import { HANDLER_IDS } from '../constants/handlerIds.js';
import initialHandler from './user/initial.handler.js';
import CustomError from '../utils/error/customError.js';

/**
 * 기존 핸들러 매핑에서는
 *
 * const handlers = {
 * 0:initialHandler
 * ...
 * }
 * 위 코드처럼 번호마다 핸들러 이벤트 함수를 호출하도록 했었다.
 *
 * 하지만 이번에는 핸들러마다 패킷의 payload가 다를 수 있다는 특징이 있기 때문에
 * HANDLER_IDS 라는 별도의 핸들러 번호를 생성하고,
 * 그 안에 핸들러의 함수와 프로토버프 구조체(메시지)을 할당해주는 방식으로 매핑할 예정이다.
 */

const handlers = {
  [HANDLER_IDS.INITIAL]: {
    handler: initialHandler,
    protoType: 'initial.InitialPacket',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, '핸들러 아이디를 찾을 수 없습니다.');
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(ErrorCodes.UNKNOWN_PROTOTYPE_NAME, '프로토타입 이름을 찾을 수 없습니다.');
  }
  return handlers[handlerId].protoType;
};
