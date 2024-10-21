import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';

const server = net.createServer(onConnection);

// 초기화작업이 정상적으로 이루어지면 서버가 실행되도록 함.
initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`Echo server listening on ${config.server.host}에서 실행중입니다.`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
