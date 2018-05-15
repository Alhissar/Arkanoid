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
      ball.id = 'ball0';
    });
  }

  fireOn() {
    this.all.forEach((ball, index) => {
      ball.onFire = true;
      ball.id = 'onfire';
    });
  }

  multi() {
    let ballAlive = null;
    let ballAliveIndex = 0;
    // si les billes sont stuck, on les ranime
    this.run();

    if (this.alive > 3) return;
    // on cycle dans les billes
    // pour chaque bille, on push 2 new Ball(tiles, 'ball0')
    // on initialise la pos et vel des nouvelles billes
    const newBalls = [];
    this.all.forEach((ball, index) => {
      for (let b = 0; b < 2; ++b) {
        const newball = new Ball(this.tiles, 'ball0');
        newball.pos.x = ball.pos.x;
        newball.pos.y = ball.pos.y;
        newball.stuck = false;
        newBalls.push(newball);
      }
    });
    this.all.push(...newBalls);
    // on stocke la derniere bille en vie
    this.all.forEach( (ball, index) => {
      if (!ball.dead) {
        ballAlive = ball;
        ballAliveIndex = index;
      } else {
        ball.pos.x = ballAlive.pos.x;
        ball.pos.y = ballAlive.pos.y;
        const speed = 150 + (Math.random() * 150);
        ball.vel.y = Math.random() < 0.5 ? -320 : 320;
        ball.vel.x = (Math.random() < 0.5) ? -speed : speed;
        ball.dead = false;
        ball.vel.len = ballAlive.vel.len;
        
      }
      this.fireOff();
    });  
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