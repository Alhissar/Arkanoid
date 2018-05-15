import {Vec2} from './math.js';

export default class Entity {
  constructor(w, h) {
    this.pos = new Vec2();
    this.size = new Vec2(w, h);
    this.fps = 25;
    this.dead = false;
    this.dying = false;
  }

  get left() {
    return this.pos.x;
  }
  set left(x) {
    this.pos.x = x;
  }

  get right() {
    return this.pos.x + this.size.x;
  }
  set right(x) {
    this.pos.x = x - this.size.x;
  }

  get top() {
    return this.pos.y;
  }
  set top(y) {
    this.pos.y = y;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }
  set bottom(y) {
    this.pos.y = y - this.size.y;
  }
  
  get box() {
    return { left:  [this.left, this.left, 
                     this.top, this.bottom],
             right: [this.right, this.right,
                     this.top, this.bottom],
             top:   [this.left, this.right,
                     this.top, this.top],
             bottom: [this.left, this.right,
                     this.bottom, this.bottom],
             };
  }
  
  createSprites(sprites, states, anims) {
    states.forEach(([name, x, y]) => {
      anims[name].forEach(([x,y], index) => {
        sprites.define(`${name + index}`, x, y);
      });
    });
  }

  draw(canvas, dt) {
    if (this.dead || !this.id) {
      this.acc = 0;
      return;
    }
    this.acc = (!this.acc) ? dt : this.acc + dt;
    const context = canvas.getContext('2d');
    const offset = {x: 0, y: 0};

    if (this.dying) {
      if (this.acc * this.fps > this.dyingAnims[this.id].length) {
        this.dead = true;
        this.dying = false;
        return;
      }
      this.animToDraw = this.dyingAnims[this.id];
      this.spriteToDraw = this.dyingSprites;
      offset.x = this.explOffset.x;
      offset.y = this.explOffset.y;
    } else {
      this.animToDraw = this.anims[this.id];
      this.spriteToDraw = this.sprites;
    }
    
    // codage en dur du framerate de l'anim (1/25 ou acc*25)
    // calcule le no de d'image pour l'animation du sprite
    this.frameNB = Math.floor((this.acc * this.fps) % this.animToDraw.length);
    const sprite = this.spriteToDraw.tiles.get(`${this.id + this.frameNB}`);
    // modif de la pos pour l'explosion 
    // (taille de l'explosion > celle  de l'entité)
    context.drawImage(sprite, 
        this.pos.x - offset.x,
        this.pos.y - offset.y);
  }

  intersects(entity) {
    return entity.bottom > this.top &&
      entity.top < this.bottom &&
      entity.right > this.left &&
      entity.left < this.right;
  }

  kill() {
    this.dying = true;
    this.acc = 0;
  }

}