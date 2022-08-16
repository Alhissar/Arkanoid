import loadLevel from './loaders/loadLevel.js';
import { draw } from './layers.js';
import { playAudio } from './sounds.js';

const changeBG = (levelNB) => {
    // Faire ici le changement de bg (background)
    const urls = ['Tuile-vert-80p', 'Tuile-sable-80p', 'Tuile-noir-80p', 'Tuile-violet-80p', 'Tuile-boue-80p', 'Tuile-bleu-80p'];
    const rand = levelNB % urls.length;
    const $bgStyle = document.getElementById('bg').style;
    $bgStyle.background = `url("img/${urls[rand]}.jpg") repeat`;
    $bgStyle.opacity = 1;

}

const lvlStart = (n) => {

}

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
      collisions.forEach(({sound, name, pos}) => {
        play(sound);
        if (pos) bonus.pop(pos);
        if (sound === 'multi') {
          balls.multi();
          player.sticky = false;
        }
        if (name === 'bonus') {
          if (sound === 'neutron') { balls.fireOn(); }
          else { balls.fireOff(); }
          if (sound === 'slow') balls.slow();
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
        timer.pause();
        timer.update = roundStart;
        timer.start();
      }
    }

    // scores.update([bonus, bricks, enemies]);
    scores.bonus = bonus.score;
    scores.bricks = bricks.score;
    scores.enemies = enemies.score;
    scores.draw();
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
    if (timer.count === 0) {
        // 1ere itération de la boucle 'game over'

    }
    timer.count += dt;
    if (timer.count > 4) {
        timer.pause();
        bricks.levelNB = 1;
        player.lifes = 3;
        timer.count = 0;
        bricks.resetLevels();
        [bonus, bricks, enemies].forEach(entity => { entity.score = 0 });
        scores.reset();
        scores.draw();
        timer.update = roundStart;
        timer.start();
    }
};

  const loose = function loose(dt) {

  };

  const paused = function pause(dt) {

  };

  const roundStart = (dt) => {
    const $in = document.getElementById('in').style;
    const $level = document.getElementById('level');
    if (timer.count == 0) {
        play('level');
        changeBG(bricks.lvlNumber - 1);
        $in.opacity = 1;
        $level.innerHTML = `LEVEL ${bricks.lvlNumber}`;
        timer.ingame = false;
        player.dead = true;
        player.appear = false;
    }
    timer.count += dt;
    // on lance le jeu passé 3s
    if (timer.count > 3) {
        $in.opacity = 0;
        player.running = true;
        bonus.dead = true;
        enemies.reset();
        timer.update = ingame;
        timer.count = 0;
        console.log(`roundStart() : Round ${bricks.lvlNumber}`);
        timer.start();
    }
    // temporisation pour apparition du player
    if (timer.count > 1 && timer.count < 1.2 && !player.appear) {
        player.reset(balls);
    }
    draw([bricks, player], context, timer, dt);
  }

  const start = function start(dt) {
    if (timer.count === 0) {
        document.getElementById('paused').innerText = "CLICK TO PLAY";
    }
    timer.count = 1;
    if (document.pointerLockElement === canvas) {
        document.getElementById('paused').innerText = "GAME PAUSED";
        console.log('GO !');
        timer.count = 0;
        timer.pause();
        timer.update = roundStart;
        timer.start();
    }
  };

/** la boucle en cas de victoire, fin de niveau
 * @type {fonction qui définit timer.update}
 */
  const victory = function victory(dt) {
    if (timer.count === 0) {
      player.running = false;
      console.log('YOU WIN !!!');
      timer.count += dt;
      timer.update = victory;
      timer.start();
    }
    timer.count += dt;
    // new
    if (timer.count > 0.5) {
        timer.pause();
        timer.ingame = true;
        loadLevel(bricks.lvlNumber + 1).then(lvl => {
            bricks.level = lvl;
            bricks.lvlNumber += 1;
            timer.update = roundStart;
            timer.start();
        });
    }
    draw([], context, timer, dt);
  };

//
timer.update = start;
timer.start();
}