import Ball from './Ball.js';

export default class Shoot {
  constructor(tiles) {
    this.all = [];
    this.tiles = tiles;
  }

  createFire(player) {
    const duo = [];
    for (let i = 0; i < 2; ++i) {
      const fire = new Ball(this.tiles, 'bullet');
      fire.pos.y = 600;
      fire.vel.y = -800;
      fire.name = 'bullet';
      fire.stuck = false;
      fire.dead = false;
      duo.push(fire);
    }
    duo[0].pos.x = player.left + 8;
    duo[1].pos.x = player.right - 18;
    return duo;
  }
  
  draw(game, dt) {
    this.all.forEach(fire => {
      fire.draw(game, dt);
    });
  }

  fire(player) {
    const duo = this.createFire(player);
    this.all.push(...duo);
  }

  reset() {
    this.all.length = 0;
  }

  update(dt) {
    this.all = this.all.filter(fire => !fire.dead || fire.trail.length !== 0);

    this.all.forEach( fire => {
      fire.update(dt);
    });
  }
}