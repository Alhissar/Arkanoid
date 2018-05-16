import { SpriteSheet } from './SpriteSheet.js';
import { createAnim } from './SpriteSheet.js';
import Entity from './Entity.js';

export default class Brick extends Entity {
  constructor(tiles) {
    super(44, 22);
    this.sprites = new SpriteSheet(tiles, 0, 0, this.size.x, this.size.y);
    this.states = [['n', 0, 0], ['o', 1 ,0], ['c', 2, 0], ['g', 3, 0],
      ['r', 0, 1], ['b', 1, 1], ['m', 2, 1], ['y', 3, 1],
      ['G', 4, 1], ['S', 4, 0], ['s', 14, 0]];
    // ajouter ici le code pour les sprites animés de S et G
    // this.states.push(...)
    for (let i=0; i < 9; i++) {
      this.states.push(['G' + i, 5 + i, 1]);
      this.states.push(['S' + i, 5 + i, 0]);
    }

    this.anims = createAnim(1, this.states, 1, 0);
    // this.anims = { n: [[0, 0]], ...};
    this.createSprites(this.sprites, this.states, this.anims);
    this.fps = 60;
    this.name = 'brick';
  }

  draw(canvas, dt) {
    // this.acc = (!this.acc) ? dt : this.acc + dt;
    const context = canvas.getContext('2d');

    if (this.dying) {
      if (this.acc * 25 > this.dyingAnims[this.id].length) {
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
    this.frameNB = Math.floor((0 * 25) % this.animToDraw.length);
    const sprite = this.spriteToDraw.tiles.get(`${this.id + this.frameNB}`);
    context.drawImage(sprite, this.pos.x, this.pos.y);

  }
  
}