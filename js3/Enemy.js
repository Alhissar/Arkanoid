import { Vel } from './math.js';

import {SpriteSheet} from './SpriteSheet.js';
import {createAnim} from './SpriteSheet.js';
import Entity from './Entity.js';

export default class Enemy extends Entity{
  constructor(tiles, id) {
    super(44, 44);
    this.vel = new Vel();
    this.sprites = new SpriteSheet(tiles, 748, 0, this.size.x, this.size.y);
    this.states = [
      ['marble', 0, 0], ['saturn', 1, 0], ['cony', 2, 0], 
      ['pyramid', 3, 0], ['molecule', 4, 0], ['cube', 5, 0],
    ];
    this.anims = createAnim(25, this.states, 0, 1);
    // this.anims = { marble: [[0, 0], [0, 1], [0,2], [0,3]], ...};
    this.createSprites(this.sprites, this.states, this.anims);

    this.dyingSprites = new SpriteSheet(tiles, 1024, 0, 64, 64);
    this.dyingStates = [
      ['marble', 0, 0], ['saturn', 0, 0], ['cony', 0, 0],
      ['pyramid', 0, 0], ['molecule', 0, 0], ['cube', 0, 0], 
    ];
    this.dyingAnims = createAnim(20, this.dyingStates, 0, 1);
    this.createSprites(this.dyingSprites, this.dyingStates, this.dyingAnims);
    // this.fps = 25;
    this.explOffset = {x: 10, y: 10};
    this.name = 'enemy';
    this.id = id;
    this.dead = true;
    this.score = 0;
  }

  collides(entities) {
    const rand = [-400, -350, -300, 300 , 350, 400];
    const collisions = [];
    entities.all.forEach(entity => {
      if (!this.intersects(entity) ||
          this.dead ||
          entity.stuck ||
          this.dying) return ;
      
      const collision = {};
      // this.dead = true;
      this.dying = true;
      this.acc = 0;
      this.score += 10;
      if (entity.name === 'ball') {
        const len = entity.vel.len;
        entity.vel.x = rand[Math.random() * 6 |0];
        entity.vel.y = (Math.random() > 0.8) ? 320 : -320;
        entity.vel.len = len * 1.04;
      }
      if (entity.name === 'bullet') entity.dead = true;
      collision.name = entity.name;
      collision.sound = 'crash';
      collisions.push(collision);
    });
    if (collisions.length === 0) return false;
    return collisions;
  }

  update(bricks, dt) {
    if (this.dead) return false;

    if (this.dying) {
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
      return true;
    }

    if (this.left <= 0 || this.right >= 572) {
      this.vel.x = - this.vel.x;
    }
    if (this.left < 0) this.pos.x = 0;
    if (this.right > 572) this.right = 572;
    if (this.top <= 0 || this.bottom > 720) {
      this.vel.y = - this.vel.y;
    }
    if (this.top < 0) this.pos.y = 0;
    if (this.bottom > 720) this.bottom = 720;
    if (Math.random() < 0.015) {
      const angle = this.vel.angle + (Math.random() - 0.5) * 1.4;
      this.vel.angle = angle ;
      this.vel.len = 90;
    }

    this.pos.x += this.vel.x * dt;
    bricks.collides(this, 'x');
    this.pos.y += this.vel.y * dt;
    bricks.collides(this, 'y');
    return true;
  }
}
