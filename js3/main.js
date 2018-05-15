
import Game from './Game.js';
import loadLevel from './loaders/loadLevel.js';
import loadImage from './loaders/loadImage.js';
import loadSounds from './loaders/loadSoundFiles.js';
import eventHandler from './eventHandler.js';
import loop from './loops.js';

const audio = {};
const audioContext = new window.AudioContext();
const CreateSounds = loadSounds(audio, audioContext);

Promise.all([loadImage('./img/sprites.png'), 
loadImage('./img/borders.png'), 
loadLevel(1)],
CreateSounds)
.then(([tiles, borders, level]) => {
  const game = new Game(tiles, level);
  game.audio = audio;
  game.audioContext = audioContext;

  eventHandler(game)();

  // window.player = player;

  // on affiche les bordures dans le contexte general
  game.context.drawImage(borders, 0, 0);

  loop(game);

});