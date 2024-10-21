import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE, MAX_MESSAGE_LENGTH } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('connect', () => {});

  // 서버가 클라이언트로 데이터를 받을때마다 발생
  // 데이터는 버퍼 형태로 제공, 주로 요청을 처리하거나 응답을 준비할 때 사용
  socket.on('data', (data) => {
    const buffer = Buffer.from(data);
    const { length, handlerId } = readHeader(buffer);
    console.log(`handlerId:${handlerId}, length:${length}`);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error: Message length, ${length}`);
      socket.write(`Error: Message too long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error: No handler found for ID, ${handlerId}`);
      socket.write(`Error: Invalid handler ID, ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
    const message = buffer.subarray(headerSize);

    // 콘솔로그안에 버퍼 객체가 들어가면 자동으로 문자열 혹은 숫자로 변환된다 => js 기능 중 하나
    console.log(`client 에게 받은 메시지: ${message}`);

    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);
    const responseHeader = writeHeader(responseBuffer.length, handlerId);
    const responsePacket = Buffer.concat([responseHeader, responseBuffer]);
    socket.write(responsePacket);
  });

  // 이 소켓 서버에 접속한 어떤 유저의 연결이 끊겼을 때 발생
  // 클라이언트가 더 이상 데이터를 보내지 않을 떄 발생
  // 이 이벤트를 통해 연결이 정상 종료되었는지 확인이 가능. 주로 자원을 정리하거나 로그를 남길때 사용
  socket.on('end', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  // 이 소켓 서버에 접속한 어떤 유저의 에러가 발생했을 때 발생
  // 이 이벤트 이후 바로 'close'가 발생, 예외 상황을 처리하고 적절한 로그를 남기거나 에러 대응을 할 때 중요.
  socket.on('error', (err) => {
    console.log(`Socket error, ${err}`);
  });

  // 소켓이 완전히 닫힐 떄 발생.
  // 연결의 양쪽 끝이 모두 종료된 경우를 의미 (서버/클라 종료)
  // 리소스 해제나 후속 작업을 처리할 때 유용
  socket.on('close', () => {});
});

server.listen(PORT, () => {
  console.log(`Echo Server listening on port ${PORT}`);
  console.log(server.address());
});

/**
 * 그 외에 덜 사용하는 이벤트 종류
 *
 * 1. connect : 소켓이 연결되었을 때 발생, 주로 클라측에서 사용
 * 2. drain : 쓰기 버퍼가 비워졌을 때 발생, 더 많은 데이터를 써도 안전함을 의미
 * 3. lookup : 호스트 이름을 해결한 후 연결하기 전 발생, 주소 패밀리와 주소에 대한 정보 제공
 * 4. ready : 소켓이 사용 준비가 되었을 때 발생
 * 5. timeout : 소켓이 비활성 상태로 인해 타임아웃 되었을 때 발생
 */

/** 버퍼와 스트림
 * : TCP 데이터 통신을 위한 매개체, 이진 데이터를 다루기 위한 특별한 객체
 *
 * 8비트 단위의 데이터 배열
 * 각 요소는 0부터 255 사이의 정수 값을 가진다
 *
 * 1. 고정 길이(1바이트)
 * 2. 빠른 접근(바이트 배열을 다루기위한 객체이므로 빠르게 접근)
 * 3. Buffer 객체 그대로 출력할 시 10진수 -> 16진수 순서로 변환하여 출력
 * 4. 하지만 Buffer 객체의 주소를 직접 접근하여 출력하려고 하면 10진수로 출력 ex) Buffer[0]
 */
