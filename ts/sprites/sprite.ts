export default class Sprite {
  src: string;
  img: HTMLImageElement;
  constructor(imageName: string) {
    this.src = "./images/" + imageName + ".png";
    this.img = new Image();
  }

  load() {
    const { src, img } = this;
    return new Promise((done, fail) => {
      img.onload = () => done(img);
      img.onerror = fail;
      img.src = src;
    });
  }
}
