import Enemy from "./Enemy.js";

export default class Enemies {
  constructor(tiles, n) {
    this.name = 'enemies';
    this.all = [];
    this.alive = 0;
    this.score = 0;
    this.collisions = [];

    const names = ['molecule', 'molecule', 'molecule', 'molecule', 'molecule', 'molecule'];
    for (let i = 0; i < n; i++) {
      this.all.push(new Enemy(tiles, names[i]));
    }
  }

  collides(entities) {
    let collisions = [];
    
    if (entities.all.length !== 0) {
      this.all.forEach(enemy => {
        const collision = enemy.collides(entities);
        if (collision) {
          collisions = collisions.concat(collision);
          this.score += 10;
        }
      });
    }
    return collisions;
  }

  // identique à Balls
  draw(game, dt) {
    this.all.forEach(enemy => {
      if (enemy.dead) return; 
      enemy.draw(game, dt);
    });
  }

  pop(dt) {
    if (Math.random() > dt / 8) return;
    const enemy = this.all[Math.random() * this.all.length | 0];
    if (!enemy.dead) return;

    enemy.dead = false;
    enemy.vel.set(0, 1);
    enemy.vel.len = 80;
    enemy.vel.angle = Math.random() * 2 * Math.PI;
    enemy.pos.set(500 * Math.random() + 150, 5);
  }

  reset() {
    this.all.forEach(entity => {
      entity.dead = true;
      entity.score = 0;
    });
  }

  update(bricks, dt) {
    this.pop(dt);
    this.alive = 0;
    this.all.forEach(enemy => {
      if (enemy.update(bricks, dt)) {
        ++this.alive;
      }
    });
  }

}