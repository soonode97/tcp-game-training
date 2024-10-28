import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { RESPONSE_SUCCESS_CODE } from '../../constants/response.js';
import { gameSessions } from '../../sessions/sessions.js';
import { addUser } from '../../sessions/user.session.js';
import { createUser, findUserByDeviceId, updateUserLogin } from '../../utils/db/user/user.db.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const initialHandler = async ({ socket, userId, payload }) => {
  try {
    console.log(`initial 핸들러 작동합니다.`);
    const { deviceId, playerId, latency } = payload;

    // 유저가 이미 DB에 저장되어 있는지 확인
    // 없다면 유저 추가
    // 있다면 마지막 로그인 시간 업데이트
    let user = await findUserByDeviceId(deviceId);
    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    // 유저를 DB에 저장하거나 로그인을 기록했으면 세션에 등록
    const sessionUser = addUser(socket, deviceId, playerId, latency, user.x, user.y);

    gameSessions[0].addUser(sessionUser);

    const initialResponse = createResponse(
      HANDLER_IDS.INIT,
      RESPONSE_SUCCESS_CODE,
      { userId: userId, x: user.x, y: user.y },
      deviceId,
    );

    socket.write(initialResponse);
  } catch (e) {
    handleError(socket, e);
  }
};
