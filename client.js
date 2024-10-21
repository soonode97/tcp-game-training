import net from 'net';
import { writeHeader, readHeader } from './utils.js';
import { TOTAL_LENGTH_SIZE, HANDLER_ID } from './constants.js';

// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  const message = 'hello';
  //   const message = 'V'.repeat(1024);
  const buffer = Buffer.from(message);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);
  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data);

  const { length, handlerId } = readHeader(buffer);
  console.log(`handlerId:${handlerId}, length:${length}`);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
  const message = buffer.subarray(headerSize);

  console.log(`server 에게 받은 메시지: ${message}`);

  console.log(data);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
