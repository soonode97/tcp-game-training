/** 커스텀 에러 핸들링위한 파일 */
class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'CustomError';
  }
}

export default CustomError;
