// Scale face and back images if their size > 3MB
// returns BLOB
const pica = require("pica")({ features: ["js", "wasm", "ww"] });

export default async function prepareImage(file) {
  if (file.type.match(/image\/(png|jpg|jpeg)/) && file.size > 1 * 1024 * 1024) {
    const img = await createImage(window.URL.createObjectURL(file));

    console.log(`Original image size: ${img.width} x ${img.height}`);
    console.log(img.width);

    const dst = document.createElement("canvas");

    if (Math.max(img.height, img.width) > 2000) {
      if (img.height > img.width) {
        dst.height = 2000;
        dst.width = (img.width * 2000) / img.height;
      } else {
        dst.width = 2000;
        dst.height = (img.height * 2000) / img.width;
      }
    } else {
      dst.width = img.width;
      dst.height = img.height;
    }
    const result = await pica.resize(img, dst, {
      unsharpAmount: 80,
      unsharpRadius: 0.6,
      unsharpThreshold: 2
    });

    const data = await pica.toBlob(result, "image/jpeg", 0.8);
    // download(data, 'image.jpg', 'image/jpeg')
    return data;
  } else {
    return file;
  }
}

function createImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
