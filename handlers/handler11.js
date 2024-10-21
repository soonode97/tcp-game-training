const handler11 = (data) => {
  const splitData = data.toString().split('');

  // or data.toString().split('').reverse().join('');

  let revertData = '';

  for (let i = splitData.length; i > 0; i--) {
    revertData += splitData[i - 1];
  }

  return Buffer.from(revertData);
};

export default handler11;
