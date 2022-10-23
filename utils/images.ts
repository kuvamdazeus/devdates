export function resizeBase64Img(base64: string, newWidth: number, newHeight: number) {
  return new Promise((resolve, _) => {
    let canvas = document.createElement("canvas");

    canvas.style.width = newWidth.toString() + "px";
    canvas.style.height = newHeight.toString() + "px";

    let context = canvas.getContext("2d") as any;
    let img = document.createElement("img");

    img.src = base64;
    img.onload = function () {
      context.scale(newWidth / img.width, newHeight / img.height);
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL() as string);

      canvas.remove();
      img.remove();
    };
  });
}
