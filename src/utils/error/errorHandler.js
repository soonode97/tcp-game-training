/** 에러 발생 시, 호출되어 수행되는 미들웨어 함수
 *
 * 우리가 서버를 띄운 상태에서 무언가 에러가 발생한 경우 서버가 다운이 되는데
 * 실제 런칭때 이렇게 에러로 인해 서버가 다운되는 일이 발생하면 안된다.
 *
 * 그래서 try/catch 문을 통해 에러를 핸들링하고 있었는데
 * catch 구문 안에 발생한 에러에 대해 처리를 할 때
 * 아래 handlerError 미들웨어에 정보를 전달하고 호출할 수 있도록 하기 위함이다.
 */

import { createResponse } from '../response/createResponse.js';
import { ErrorCodes } from './errorCodes.js';

export const handlerError = (socket, error) => {
  let responseCode;
  let message;
  // 서버가 에러를 확인하기 위해 콘솔로그로 출력
  // 혹은 에러에 대한 로깅이 필요하다면 여기서 처리를 하면 된다.
  console.log(error);

  // 우리가 정의한 에러 코드가 있는 경우
  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${error.code}, 메세지: ${error.message}`);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반에러: ${error.message}`);
  }

  const errorResponse = createResponse(-1, responseCode, { message }, null);
  socket.write(errorResponse);
};
