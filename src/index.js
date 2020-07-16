let skins = ["🏴", "🏴", "🦓", "🗻", "🐩", "🏳", "💭", "💭"];

const config = {
  size: 1000,
  elementSize: 1,
  get elementCount() { return skins.length - 1 },
  lineCount: 1000
};

function drawImage(indexArr, numPerLine) {
  let log = ''
  let sum = 0
  for (const [i, v] of indexArr.entries()) {
    log += skins[v || 0] + ' '
    sum += 1
    if (sum === numPerLine) {
      log += '\n'
      sum = 0
    }
  }
  // console.log(log)
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
    const emojisStr = document.querySelector('.input_emojis').value
    if (emojisStr) {
      skins = emojisStr.trim().split(/\s/g)
    }
    console.log(skins)
    // Read File
    const fileReader = e.target.elements.file.files[0];
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

document.querySelector("form").addEventListener("submit", onSubmit);
