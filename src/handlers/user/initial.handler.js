import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { addUser } from '../../sessions/user.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

/** 가장 최초에 접속했을 때 유저 정보를 처리하기 위한 핸들러 */
const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload;

    // deviceId도 유저의 고유한 기기이기 때문에 uuid로 디바이스 아이디를 할당하도록 함.
    addUser(socket, deviceId);

    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: deviceId },
      deviceId,
    );

    // write => 뭔가 처리가 끝났을 때 보내는 것.
    socket.write(initialResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default initialHandler;
