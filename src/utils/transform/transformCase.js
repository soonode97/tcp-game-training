/** 카멜 케이스로 변환하는 함수 파일
 *
 * 사용 이유:
 * 현재 DB 스키마는 스네이크케이스로 쓰여져 있기 때문에 select 쿼리를 사용하면 스네이크케이스로 변환해준다.
 * 이것을 코드 컨벤션에 맞게 카멜 케이스로 사용하고 싶어 lodash 패키지를 사용하여 변환할 예정이다.
 */
import camelCase from 'lodash/camelCase.js';

export const toCamelCase = (obj) => {
  // 인자로 받는 obj가 배열인 경우
  if (Array.isArray(obj)) {
    // 배열인 경우, 배열의 각 요소에 대해 재귀적으로 toCamelCase 함수를 호출
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    // 객체인 경우, 객체의 키를 카멜케이스로 변환하고, 값에 대해서도 재귀적으로 toCamelCase 함수를 호출
    return Object.keys(obj).reduce((result, key) => {
      result[camelCase(key)] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  // 객체도 배열도 아닌 경우, 원본 값을 반환
  return obj;
};
