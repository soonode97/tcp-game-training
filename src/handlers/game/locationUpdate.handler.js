import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { getGameSession } from '../../sessions/game.session.js';

/** 유저 위치 업데이트 핸들러 */
export const locationUpdateHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;

    const gameSession = getGameSession();
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // 유저 세션에서 유저를 찾기
    // 데이터로 받는게 deviceId 이기 때문에 deviceId를 통한 검색이 필요함
    // 첫 번째 게임 세션만 할 예정
    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '게임 세션에서 유저를 찾을 수 없습니다.');
    }

    user.updatePosition(x, y);

    const packet = gameSession.getAllLocation(userId);
    socket.write(packet);
  } catch (e) {
    handleError(socket, e);
  }
};
