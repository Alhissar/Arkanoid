
import {SpriteSheet} from './SpriteSheet.js';
import {createAnim} from './SpriteSheet.js';
import Entity from './Entity.js';

export default class Enemy extends Entity{
  constructor(tiles, id) {
    super(64, 64);
    this.sprites = new SpriteSheet(tiles, 1024, 0, this.size.x, this.size.y);
    this.states = [['explosion', 0, 1]];
    this.anims = createAnim(20, this.states, 0, 1);
    this.createSprites(this.states, this.anims);
    this.dead = true;
  }

}