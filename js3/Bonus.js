import { Vel } from './math.js';

import {SpriteSheet} from './SpriteSheet.js';
import {createAnim} from './SpriteSheet.js';
import Entity from './Entity.js';

export default class Bonus extends Entity{
  constructor(tiles) {
    super(44, 22);
    this.vel = new Vel();
    this.sprites = new SpriteSheet(tiles, 0, 220, this.size.x, this.size.y);
    this.states = [
      ['life', 0, 0], ['extended', 0, 1], ['short', 0, 2], 
      ['sticky', 0, 3], ['laser', 0, 4], ['multi', 0, 5],
      ['neutron', 8, 5], ['slow', 0, 8]
    ];
    this.anims = createAnim(8, this.states, 1, 0);
    // this.anims = {life: [[0, 0], [1, 0], [2,0], [3,0]], ...};
    this.createSprites(this.sprites, this.states, this.anims);
    // this.fps = 25;
    this.name = 'bonus';
    this.id = 'multi';
    this.dead = true;
    this.score = 0;
  }

  pop({x, y}) {
    // 15% de pop un bonus
    if (!this.dead || Math.random() * 100 > 15) return false;
    this.pos.set(x,y);
    this.dead = false;
    this.vel.y = 150;
    // valeur hardcodée 7 : this.states.length - 1
    this.id = this.states[1 + Math.random() * 7 | 0][0];
    // 2% de chance d'obtenir une vie supp. à la place
    if (Math.random()*100 < 2) this.id = 'life';
    return true;
  }

  update(dt) {
    if (this.bottom > 750) {
      this.dead = true;
      this.vel.set(0, 0);
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

  }

}