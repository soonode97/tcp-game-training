/**
 * 서버 혹은 세션이 실행되고 생성될 수 있는 (가능성이 있는)
 * 1. 모든 유저들의 위치 공유를 해야할 때
 * 2. 보스의 체력을 모든 유저에게 공유를 해야할 때
 * 3. 몬스터 생성을 모든 유저에게 공유해야할 때
 *
 * 그러한 주기와 스케쥴링을 담당하는 매니저 파일
 */

class BaseManager {
  constructor() {
    // 만약에 부모 클래스 그대로 생성하려고 하면 에러가 발생하도록 함.
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances.');
    }
  }

  // 여기 아래부터는 이 BaseManager의 자식클래스들이 사용할 메서드들을 정의
  addPlayer(playerId, ...args) {
    // 위에서 부모 클래스 그대로 생성에 대한 에러 처리를 해주었지만
    // 혹시나 구현되지 않고 메서드가 호출되었을 때에 대한 에러 상황을 처리해 줌.
    throw new Error('Method not implemented.');
  }

  removePlayer(playerId) {
    throw new Error('Method not implemented.');
  }

  clearAll() {
    throw new Error('Method not implemented.');
  }
}

export default BaseManager;
