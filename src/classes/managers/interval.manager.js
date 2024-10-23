/**
 * base.manager.js에서 선언한 부모클래스를 통해
 * 특정한 이벤트에 대한 인터벌 처리를 위한 자식 클래스를 생성하고 관리하는 파일
 */

import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    // 인터벌이 여러 종류가 있을 수 있으므로 맵 객체를 선언
    this.intervals = new Map();
  }

  // 인터벌의 종류 중 addPlayer는 유저 타입의 인터벌을 생성하는 메서드이자 유저를 등록하는 것
  // type을 지정해준 이유는 스케쥴링이 유저뿐만 아니라 던전, 보스, 월드 등 다양한 곳에서 사용할 수 있기 때문.
  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId));
    {
      // 특정 유저의 유저 스케쥴에도 다양한 종류가 있을 수 있으니 맵 객체로 value를 추가
      this.intervals.set(playerId, new Map());
    }
    // 위 작업으로 유저의 인터벌을 초기화 해주고
    // 1. type으로 지정하고 callback 함수의 반환갑으로 새로 할당한다.
    // 2. callback 함수의 동작할 시간을 정해준다.
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  addGame(gameId, callback, interval) {
    this.addPlayer(gameId, callback, interval, 'game');
  }

  addUpdatePosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, 'updatePosition');
  }

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  // 유저의 인터벌을 모두 지우는 것도 있고,
  // 유저가 가진 인터벌 중 특정 인터벌만 지우고 싶은 경우가 있기 때문에 생성한 메서드
  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    });

    this.intervals.clear();
  }
}

export default IntervalManager;
