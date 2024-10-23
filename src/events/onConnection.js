/** 이벤트에 관련된 것 중앙 집중 관리 파일
 *
 * 사용 파일:
 * 1. onData.js
 * 2. onEnd.js
 * 3. onError.js
 */

/** 
const server = net.createServer((socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(data);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});
*/

// 위 server.js 코드에서 (socket) => {...} 이 부분을 아래 함수로 대체

import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  // 각 클라이언트마다 고유한 버퍼를 유지시키기 위해 빈 버퍼를 만들어 줌.
  // 유지하는 이유: onData.js 에서 정의한 스트림처럼 chunk 형태로 전달하게 되는데
  // socket에서 받은 데이터를 빈 버퍼에 쌓아 올릴 수 있도록 하기 위해서이다.
  socket.buffer = Buffer.alloc(0);

  socket.on('data', onData(socket));

  socket.on('end', onEnd(socket));

  socket.on('error', onError(socket));
};
