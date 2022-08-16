import { SpriteSheet } from './SpriteSheet.js';
import { createAnim } from './SpriteSheet.js';
import Entity from './Entity.js';
import {Vel} from './math.js';

export default class Ball extends Entity {
  constructor(tiles, id) {
    super(10, 10);
    this.name = 'ball';
    this.vel = new Vel();
    this.sprites = new SpriteSheet(tiles, 660, 0, this.size.x, this.size.y);
    this.states = [['ball0', 0, 0], ['ball1', 0, 1], ['ball2', 1, 0], ['bullet', 2, 1], ['onfire', 2, 0]];
    this.anims = createAnim(1, this.states, 0, 0);
    this.createSprites(this.sprites, this.states, this.anims);
    this.id = id;
    this.idBeforeFire = id;
    this.dead = true;
    this.onFire = false;
    this.speed = 1;
    this.stuck = true;
    this.oldVel = {x: 150, y: -320};
    this.stickOffset = 0;
    this.trail = [];
    this.trailMax = 8;
  }

  get box() {
    return {
      left: [this.left, this.left, this.center.y, this.center.y],
      right: [this.right, this.right, this.center.y, this.center.y],
      top: [this.center.x, this.center.x, this.top, this.top],
      bottom: [this.center.x, this.center.x, this.bottom, this.bottom],
    };
  }

  get center() {
    return {
      x: (this.left + this.right) / 2,
      y: (this.top + this.bottom) / 2,
    };
  }

    draw(canvas, dt) {
    if (this.dead && this.trail.length === 0) return;

    const context = canvas.getContext('2d');
    const sprite = this.sprites.tiles.get(`${this.id + 0}`);
    if (!this.dead) context.drawImage(sprite, this.pos.x, this.pos.y);
    this.trail.forEach((pos, i) => {
        context.globalAlpha = 1 / this.trailMax * i;
        context.drawImage(sprite, pos.x, pos.y);
    })
    context.globalAlpha = 1;
  }

  randomAngle() {
    let signX = Math.sign(this.vel.x);
    let signY = Math.sign(this.vel.y);
    const rand = Math.random();
    // lerp
    const randX = (400 - 150) * rand + 150;
    const randY = (350 - 300) * rand + 300;
    this.vel.x = randX * signX;
    this.vel.y = randY * signY;
    this.speed *= 1.04;
  }

  saveVel() {
    this.oldVel.x = this.vel.x;
    this.oldVel.y = this.vel.y;
  }

  stick(player) {
    this.saveVel();
    this.vel.set(0, 0);
    this.pos.y = 600;
    this.stuck = true;
  }

  update(dt) {
    // if (this.dead) return false;
    let response = true;
    
    if (this.dead || this.trail.length === this.trailMax) this.trail.shift();
    if (this.dead && this.trail.length === 0) return false;
    const pos = this.pos;
    if ((this.name === 'bullet' || this.onFire) && !this.dead) this.trail.push({...pos});

    if (this.vel.y === 0) return true;
    if (this.dead) return false;

    if (this.bottom > 750) {
      this.dead = true;
      this.saveVel();
      this.vel.set(0,0);
    }

    if (this.top <= 0 && this.name === 'bullet') {
      this.dead = true;
      this.saveVel();
      this.vel.set(0, 0);
    }
    
    // if (this.dead) return false;
    if (this.dead) response = false;
    if (this.left <= 0 || this.right >= 572) {
      this.vel.x = - this.vel.x;
    }
    if (this.left < 0) this.pos.x = 0;
    if (this.right > 572) this.pos.x = 572 - this.size.x;
    if (this.top <= 0) {
      this.vel.y = Math.abs(this.vel.y);
      this.pos.y = 0;
    }

    // ajouter this.speed dans le calcul ?
    this.pos.x += this.vel.x * dt * this.speed;
    this.pos.y += this.vel.y * dt * this.speed;
    return response;
  }
}