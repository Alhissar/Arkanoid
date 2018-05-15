import loadLevel from './loaders/loadLevel.js';
import { draw } from './layers.js';
import { playAudio } from './sounds.js';

export default function loops(game, mode) {
  // const audio = game.audio;
  // const audioContext = game.audioContext;
  // const balls = game.balls;
  // const bonus = game.bonus;
  // const bricks = game.bricks;
  // const canvas = game.canvas;
  // const context = game.context;
  // const enemies = game.enemies;
  const play = playAudio(game.audio, game.audioContext);
  // const player = game.player;
  // const scores = game.scores;
  // const shoot = game.shoot;
  // const timer = game.timer;

/**
 * La boucle principale, en jeu
 * qui définit timer.update
 * 
 * @type {function}
 */
  const ingame = function ingame(dt) {
    if (!game.timer.ingame) game.timer.ingame = true;
    [game.balls, game.bonus, game.shoot].forEach(entity => entity.update(dt));
    game.enemies.update(game.bricks, dt);

    let collisions = [];
    collisions = collisions.concat(...[game.bricks.collides(game.balls)]);
    collisions = collisions.concat(...[game.bricks.collides(game.shoot)]);
    collisions = collisions.concat(...[game.player.collides(game.balls)]);
    collisions = collisions.concat(...[game.player.collides(game.bonus)]);
    collisions = collisions.concat(...[game.player.collides(game.enemies)]);
    collisions = collisions.concat(...[game.enemies.collides(game.balls)]);
    collisions = collisions.concat(...[game.enemies.collides(game.shoot)]);

    if (collisions.length !== 0) {
      collisions.forEach(collision => {
        play(collision.sound);
        if (collision.pos) game.bonus.pop(collision.pos);
        if (collision.sound === 'multi') game.balls.multi();
        if (collision.name === 'game.bonus') {
          if (collision.sound === 'neutron') { game.balls.fireOn(); }
          else { game.balls.fireOff(); }
        }
      });
    }

    // vie perdue ?
    if (game.balls.alive === 0) {
      play('lost');
      game.bonus.dead = true;
      game.player.loose(game.balls);
    }

    game.scores.draw([game.bonus, game.bricks, game.enemies]);
    const toDraw = [game.balls, game.bricks, game.bonus, game.enemies, game.player, game.shoot];
    draw(toDraw, game.context, game.timer, dt);

    // victoire ?
    if (game.bricks.count === 0 && game.timer.running) {
      game.shoot.reset();
      game.timer.pause();
      victory(dt);
    }

    // game over ?
    if (game.player.lifes === 0) {
      game.timer.pause();
      game.timer.update = gameOver;
      game.timer.start();
    }
  };

  const gameOver = function over(dt) {
    // console.log('game over');
  };

  const paused = function pause(dt) {

  };

  const start = function start(dt) {
    if (game.timer.count === 0) {
      document.getElementById('paused').innerText = "CLICK TO PLAY";
      // game.timer.pause();
      // game.timer.update = ingame;
    }
    game.timer.count = 1;
    if (document.pointerLockElement === game.canvas) {
      document.getElementById('paused').innerText = "GAME PAUSED";
      game.timer.update = ingame;
      game.player.running = true;
      // game.timer.start();
    }
  };

/** la boucle en cas de victoire, fin de niveau
 * @type {fonction qui définit game.timer.update}
 */
  const victory = function victory(dt) {
    let lvlNumber = game.bricks.lvlNumber;
    if (!game.timer.running) {
      game.timer.count = 0;
      game.timer.ingame = false;
      game.player.running = false;
      console.log('YOU WIN !!!');
      game.timer.update = victory;
      game.timer.start();
    }

    game.timer.count += dt;
    if (game.timer.count > 3) {
      game.timer.pause();
      loadLevel(game.bricks.lvlNumber + 1).then(lvl => {
        game.bricks.level = lvl;
        game.bricks.lvlNumber = lvlNumber + 1;

        game.player.reset(game.balls);
        game.bonus.dead = true;
        game.enemies.reset();

        game.timer.update = ingame;
        game.timer.ingame = true;
        game.timer.start();
      });
    }


    draw([], game.context, game.timer, dt);
  };

//
//
game.player.reset(game.balls);
game.timer.update = start;
game.timer.start();

}