import loadLevel from './loaders/loadLevel.js';
import { draw } from './layers.js';
import { playAudio } from './sounds.js';

export default function loops(game, mode) {
  const audio = game.audio;
  const audioContext = game.audioContext;
  const balls = game.balls;
  const bonus = game.bonus;
  const bricks = game.bricks;
  const canvas = game.canvas;
  const context = game.context;
  const enemies = game.enemies;
  const play = playAudio(audio, audioContext);
  const player = game.player;
  const scores = game.scores;
  const shoot = game.shoot;
  const timer = game.timer;

/**
 * La boucle principale, en jeu
 * qui définit timer.update
 * 
 * @type {function}
 */
  const ingame = function ingame(dt) {
    if (!timer.ingame) timer.ingame = true;
    [balls, bonus, shoot].forEach(entity => entity.update(dt));
    enemies.update(bricks, dt);

    let collisions = [];
    collisions = collisions.concat(...[bricks.collides(balls)]);
    collisions = collisions.concat(...[bricks.collides(shoot)]);
    collisions = collisions.concat(...[player.collides(balls)]);
    collisions = collisions.concat(...[player.collides(bonus)]);
    collisions = collisions.concat(...[player.collides(enemies)]);
    collisions = collisions.concat(...[enemies.collides(balls)]);
    collisions = collisions.concat(...[enemies.collides(shoot)]);

    if (collisions.length !== 0) {
      collisions.forEach(collision => {
        play(collision.sound);
        if (collision.pos) bonus.pop(collision.pos);
        if (collision.sound === 'multi') {
          balls.multi();
          player.sticky = false;
        }
        if (collision.name === 'bonus') {
          if (collision.sound === 'neutron') { balls.fireOn(); }
          else { balls.fireOff(); }
        }
      });
    }

    // vie perdue ?
    if (balls.alive === 0) {
      if (!player.dead && !player.dying) {
        play('lost');
        player.kill();
        bonus.dead = true;
      } else if (player.dead) {
        player.loose(balls);
      }
    }

    scores.draw([bonus, bricks, enemies]);
    const toDraw = [balls, bricks, bonus, player, shoot, enemies];
    draw(toDraw, context, timer, dt);

    // victoire ?
    if (bricks.count === 0 && player.running) {
      shoot.reset();
      timer.pause();
      timer.ingame = false;
      victory(dt);
    }

    // game over ?
    if (player.lifes === 0) {
      timer.pause();
      timer.update = gameOver;
      timer.start();
    }
  };

  const gameOver = function over(dt) {
    // console.log('game over');
  };

  const loose = function loose(dt) {

  };

  const paused = function pause(dt) {

  };

  const start = function start(dt) {
    if (timer.count === 0) {
      document.getElementById('paused').innerText = "CLICK TO PLAY";
      // timer.pause();
      // timer.update = ingame;
    }
    timer.count = 1;
    if (document.pointerLockElement === canvas) {
      document.getElementById('paused').innerText = "GAME PAUSED";
      timer.update = ingame;
      player.running = true;
      // timer.start();
    }
  };

/** la boucle en cas de victoire, fin de niveau
 * @type {fonction qui définit timer.update}
 */
  const victory = function victory(dt) {
    let lvlNumber = bricks.lvlNumber;
    if (!timer.ingame && timer.count === 0) {
      player.running = false;
      console.log('YOU WIN !!!');
      timer.update = victory;
      timer.start();
    }
    timer.count += dt;
    
    if (timer.count > 3 && !timer.ingame) {
      timer.pause();
      timer.ingame = true;
      loadLevel(bricks.lvlNumber + 1).then(lvl => {
        bricks.level = lvl;
        bricks.lvlNumber = lvlNumber + 1;
        
        player.reset(balls);
        bonus.dead = true;
        enemies.reset();
        
        timer.update = ingame;
        timer.start();
      });
    }
    
    draw([], context, timer, dt);
  };

//
//
player.reset(balls);
timer.update = start;
timer.start();
}