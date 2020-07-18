import convert from 'color-convert'

onmessage = function (e) {
  const [arr, config] = e.data;
  const calcArr = calcIndexArr(arr, config)
  postMessage(calcArr)
};

function calcIndexArr(imageData, config) {
  const HSLArr = calcHSLArr(imageData);
  const { hueCount, lightnessCount, size } = config;
  const HueLen = 366 / hueCount
  const LightnessLen = 101 / lightnessCount
  return HSLArr.map(([h, s, l]) => {
    return [Math.floor(((h + 350) % 365) / HueLen), Math.floor(l / LightnessLen)]
  })
}

function calcHSLArr(imageData) {
  let arr = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    arr.push(convert.rgb.hsl(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]))
  }
  return arr;
}
