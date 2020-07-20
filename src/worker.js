import convert from 'color-convert'

onmessage = function (e) {
  const [arr, config] = e.data;
  const calcArr = calcIndexArr(arr, config)
  postMessage(calcArr)
};

function calcIndexArr(imageData, config) {
  const RGBArr = calcRGBArr(imageData);
  const { skinsColorArr, offset } = config
  return RGBArr.map(([r, g, b]) => {
    let minDev = 255 * 255 * 3
    let minIdx = 0
    skinsColorArr.forEach(([R, G, B], idx) => {
      const dev = Math.pow(R - r - offset.r, 2) + Math.pow(G - g - offset.g, 2) + Math.pow(B - b - offset.b, 2)
      if (dev < minDev) {
        minDev = dev
        minIdx = idx
      }
    })
    return minIdx
  })
}

function calcRGBArr(imageData) {
  let arr = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    arr.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]])
  }
  return arr;
}
