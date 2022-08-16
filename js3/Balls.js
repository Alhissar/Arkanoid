import Ball from "./Ball.js";

export default class Balls {
  constructor(tiles, n = 1) {
    this.tiles = tiles;
    this.name = 'balls';
    this.all = [];
    this.alive = 1;

    for (let i = 0; i < n; i++) {
      this.all.push(new Ball(tiles, 'ball' + i));
    }
  }

  get stuck() {
    let nb = 0;
    this.all.forEach(ball => {
      nb = (ball.stuck) ? ++nb : nb;
    });
    return nb;

  }

  draw(game, dt) {
    this.all.forEach(ball => {
      ball.draw(game, dt);
    });
  }

  fireOff() {
    this.all.forEach((ball, index) => {
      ball.onFire = false;
      ball.trail.length = 0;
      ball.id = ball.idBeforeFire;
    });
  }

  fireOn() {
    this.all.forEach((ball, index) => {
      ball.onFire = true;
      if (ball.id !== 'onfire') ball.idBeforeFire = ball.id;
      ball.id = 'onfire';
    });
  }

  slow() {
    const factor = 0.9;
    this.all.forEach(ball => {
      ball.speed *= factor;
      if (ball.vel.x === 0) {
        ball.oldVel.x *= factor;
        ball.oldVel.y *= factor;
      } else {
        ball.vel.len *= factor;
      }
    });
  }

  multi() {
    // si les billes sont stuck, on les ranime
    this.run();

    if (this.alive > 3) return;
    // on cycle dans les billes
    // pour chaque bille, on push 2 new Ball(tiles, 'ball0')
    // on initialise la pos et vel des nouvelles billes
    const newBalls = [];
    this.all.forEach((ball, index) => {
        for (let b = 0; b < 2; ++b) {
            const rand = Math.floor(Math.random() * 3);
            const newball = new Ball(this.tiles, `ball${rand}`);
            newball.pos.x = ball.pos.x;
            newball.pos.y = ball.pos.y;
            newball.vel.x = ball.vel.x;
            newball.vel.y = ball.vel.y;
            newball.randomAngle();
            newball.dead = false;
            newball.stuck = false;
            newBalls.push(newball);
      }
    });
    this.all.push(...newBalls);
    this.fireOff();
    this.run();
  }

  reset() {
    if (this.alive > 0) {
      this.all.length = 0;
    }
    this.all.push(new Ball(this.tiles, 'ball0'));
    this.all[0].dead = false;
  }

  run() {
    this.all.forEach(ball => {
      if (ball.stuck) {
        ball.stuck = false;
        ball.vel.x = ball.oldVel.x;
        ball.vel.y = ball.oldVel.y;
      }
    });
  }

  update(dt) {
    const previous = this.alive;
    this.alive = 0;
    this.all.forEach(ball => {
      if (ball.update(dt)) {
        ++this.alive;
      }
    });
    if (this.alive !== previous) {
      this.all = this.all.filter(ball => !ball.dead);
    }
  }
}