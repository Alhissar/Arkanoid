export function createAnim(frames, states, addX, addY) {
  const animFrameObj = {};
  states.forEach(([name, x, y]) => {
    animFrameObj[name] = [];
    for (let i = 0; i < frames; i++) {
      animFrameObj[name].push([x + addX * i, y + addY * i]);
    }
 });
 return animFrameObj;
}

export class SpriteSheet {
  constructor(image, x, y, w, h) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.tiles = new Map();
  }

  define(name, x, y) {
    const sprite = document.createElement('canvas');
    sprite.width = this.width;
    sprite.height = this.height;
    sprite.getContext('2d').drawImage(this.image,
      this.x + x * this.width,
      this.y + y * this.height,
      this.width,
      this.height,
      0, 0, this.width, this.height);
    this.tiles.set(name, sprite);
  }

  draw(name, context, x, y) {
    const tile = this.tiles.get(name);
    if (!tile) return;
    context.drawImage(tile, x, y);
  }
}