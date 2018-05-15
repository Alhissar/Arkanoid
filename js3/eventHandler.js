import { playAudio } from './sounds.js';

export default function eventHandler(game) {
  const play = playAudio(game.audio, game.audioContext);
  return function handler() {
    document.addEventListener('keydown', e => {
      // e.preventDefault();
      if (e.key === 'm') {
        game.balls.multi();
        game.player.sticky = false;
        play('multi');
      }
      if (e.key === 'l') {
        game.player.state = 'laser';
        game.player.size.x = 80;
        // game.player.sticky = false;
      }
      if (e.key === 'e') {
        game.player.state = 'default';
        game.player.size.x = 120;
      }
      if (e.key === "s") {
        game.player.sticky = true;
      }
      if (e.key === "f") {
        game.balls.fireOn();
      }
      game.player.id = game.player.getId();
    });

    document.addEventListener('mousemove', e => {
      e.preventDefault();
      if (!game.timer.ingame ||
          document.pointerLockElement !== game.canvas) return;
      game.player.update(game.balls, e.movementX);
    });

    document.addEventListener('click', e => {
      if (game.audioContext.state !== 'running') game.audioContext.resume();
      if (document.pointerLockElement !== game.canvas) {
        game.canvas.requestPointerLock();
        return;
      }
      if (!game.timer.ingame) return;
      if (game.player.running && game.player.lifes === 0) return;

      if (!game.player.running || game.balls.stuck > 0) {
        game.balls.run(0);
        game.player.running = true;
      } else if (game.player.running && game.player.state === 'laser') {
        game.shoot.fire(game.player);
        play('fire2');
      }
    });

    document.addEventListener('pointerlockchange', e => {
      const pause = document.getElementById('paused');
      if (document.pointerLockElement !== game.canvas) {
        game.timer.pause();
        pause.innerText = 'GAME PAUSED';
        pause.style.visibility = 'visible';
        pause.style.animationName = 'pulsing';
      } else {
        pause.style.visibility = 'hidden';
        pause.style.animation = '';
        game.timer.start();
      }
    }); 
  };
}