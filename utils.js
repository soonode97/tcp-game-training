/**
 *
 */

import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

export const readHeader = (buffer) => {
  // 빅인디안, 리틀인디안
  // 1. 빅인디안은 순서대로 읽는것
  // 2. 리틀인디안은 반대로 읽는것
  /**
   * const length = buffer.readUInt32BE(0);
   * const handlerId = buffer.readUInt16BE(TOTAL_LENGTH_SIZE);
   */

  return {
    length: buffer.readUInt32BE(0),
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE),
  };
};

export const writeHeader = (length, handlerId) => {
  /** 헤더를 만들어서 줘야하기 때문에 버퍼 객체가 필요 */

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6

  // headerSize 의 크기가 들어간 버퍼 객체를 생성
  const buffer = Buffer.alloc(headerSize);

  // 버퍼를 앞에서부터 32비트만큼 써줄 예정
  // 메시지의 전체 길이를 담아야 하기 때문에 버퍼의 길이와 헤더사이즈만큼 써야한다.
  buffer.writeUInt32BE(length + headerSize, 0);
  buffer.writeUInt16BE(handlerId, TOTAL_LENGTH_SIZE);

  return buffer;
};
