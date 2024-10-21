import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

// import.meta.url은 현재 모듈의 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const __filename = fileURLToPath(import.meta.url);

// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  // dir 안에 있는 파일들의 목록을 모두 가져와서 반복을 돈다.
  files.forEach((file) => {
    // 해당 파일의 경로와 파일을 확인한다.
    const filePath = path.join(dir, file);

    // 만약 파일이 폴더라면 해당 경로 안의 파일을 한번 더 검색한다.
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    }
    // 만약 파일이라면 .proto 형태의 파일만 읽어내어 배열에 추가하도록 한다.
    else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });

  // console.log(fileList);

  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};

export const loadProtos = async () => {
  try {
    // root라는 protobufjs의 인스턴스를 생성
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [packageName, types] of Object.entries(packetNames)) {
      console.log(packageName, types);
      protoMessages[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[packageName][type] = root.lookupType(typeName);
      }
    }
    // console.log(protoMessages);

    console.log(`Protobuf 파일 로드 완료.`);
  } catch (err) {
    console.error(`Protobuf 파일 로드 중 오류 발생 : ${err}`);
  }
};

// 우리가 실제로 사용할 protoMessages를 반환해주기 위한 함수를 작성
// 단, 원본이 변경될 우려가 있으니 얕은 복사를 통해 반환을 하도록 함.
export const getProtoMessages = () => {
  // Spread Operator를 사용하여 얕은 복사를 한 상태로 반환.
  return { ...protoMessages };
};
