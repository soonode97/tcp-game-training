/** 패킷 헤더에 대해 정의된 파일 */
export const TOTAL_LENGTH = 4; // 헤더의 전체 길이
export const PACKET_TYPE_LENGTH = 1; // 패킷 타입의 길이

export const PACKET_TYPE = {
  PING: 0,
  NORMAL: 1,
  LOCATION: 3,
  GAME_START: 6,
};
