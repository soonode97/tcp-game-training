import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getGameSession } from '../../sessions/game.session.js';
import { getUserById } from '../../sessions/user.session.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const joinGameHandler = async ({ socket, userId, payload }) => {
  try {
    const { gameId } = payload;

    // 게임 세션이 존재하는지 확인
    const gameSession = getGameSession(gameId);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // 유저가 존재하는지 확인
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // 해당 세션에 유저가 이미 존재하는지 확인
    // 지금은 연결하려는 세션에 한정하여 확인하지만 추후에는 어떤 세션이든 중복으로 참여가 불가한 세션에 있는지 확인하는 검증을 해야할듯 싶음.
    const existUser = gameSession.getUser(user.id);

    if (!existUser) {
      gameSession.addUser(user);
    }

    const joinGameResponse = createResponse(
      HANDLER_IDS.JOIN_GAME,
      RESPONSE_SUCCESS_CODE,
      { gameId, message: '게임에 참가했습니다.' },
      user.id,
    );

    socket.write(joinGameResponse);
  } catch (e) {
    handlerError(socket, e);
  }
};

export default joinGameHandler;
