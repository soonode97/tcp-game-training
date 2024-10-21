/** 핸들러 10에 관련된 매핑 파일 */

const handler10 = (data) => {
  const processedData = data.toString().toUpperCase();
  return Buffer.from(processedData);
};

export default handler10;
