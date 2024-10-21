/** 중앙 집중식 관리 파일
 *
 * 사용 이유: 만약에 process.env.~~ 가 어느곳에서 사용중이라고 했을 때
 * 한 군데가 아니라 여러 곳일 경우 전부다 바꿔야 하지만 현재 파일에서 바꾸면 다 바꾸어지기 때문에 유지보수면에서 편리함
 *
 * 사용 파일:
 * 1. env.js
 * 2. header.js
 */

import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import { PACKET_TYPE_LENGTH, TOTAL_LENGTH } from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
  },
};
