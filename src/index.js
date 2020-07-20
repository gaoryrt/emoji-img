import emojiColor from './emojiColor'

let skins = []

const config = {
  get skinsColorArr() { return skins.map(emoji => emojiColor(emoji)) },
  get offset() {
    return {
      r: +document.querySelector('#offset_r').value,
      g: +document.querySelector('#offset_g').value,
      b: +document.querySelector('#offset_b').value
    }
  }
};

function drawImage(indexArr, numPerLine) {
  let log = ''
  let sum = 0
  indexArr.forEach(i => {
    log += skins[i] + ' '
    sum += 1
    if (sum === numPerLine) {
      log += '\n'
      sum = 0
    }
  })
  document.querySelector('.img_wrapper').innerHTML = log
}

function render(imageData, numPerLine) {
  const worker = new Worker("worker.js");
  worker.postMessage([imageData, config]);
  // calculate the emojis
  worker.onmessage = function (e) {
    drawImage(e.data, numPerLine);
  };
}

function toImageData(bitmap, imgWidth, imgHeight, width) {
  const c = document.createElement("canvas");
  const resizedHeight = Math.round(width * imgHeight / imgWidth)
  c.width = width;
  c.height = resizedHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(
    bitmap,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    width,
    resizedHeight
  );
  return ctx.getImageData(0, 0, width, resizedHeight);
}

async function onSubmit(e) {
  e.preventDefault();
  try {
    if (document.querySelector('.input_emojis').value) {
      skins = document.querySelector('.input_emojis').value.trim().split(' ')
    }
    const fileReader = document.querySelector('.input_file').files[0];
    const buffer = await new Response(fileReader).arrayBuffer();
    const type = fileReader.name.endsWith(".png") ? "png" : "jpeg";
    const blob = new Blob([buffer], { type: `image/${type}` });
    const imgUrl = URL.createObjectURL(blob)
    const img = new Image()
    const bitmap = await createImageBitmap(blob);
    const numPerLine = +document.querySelector('.numPerLine').value
    img.onload = () => {
      // Get selected emoji
      render(toImageData(bitmap, img.width, img.height, numPerLine), numPerLine);
    }
    img.src = imgUrl
  } catch (e) {
    console.error(e);
  }
}

document.querySelector("form").addEventListener("change", onSubmit);
