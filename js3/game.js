import Balls from './Balls.js';
import Bonus from './Bonus.js';
import Bricks from './Bricks.js';
import Enemies from './Enemies.js';
import Player from './Player1.1.js';
import Score from './Score.js';
import Shoot from './Shoot.js';
import Timer from './Timer.js';

export default class Game {
  constructor(tiles, level) {
    this.balls = new Balls(tiles, 1);
    this.bricks = new Bricks(tiles, level);
    this.bonus = new Bonus(tiles);
    this.canvas = document.getElementById('screen');
    this.context = this.canvas.getContext('2d');
    this.enemies = new Enemies(tiles, 6);
    this.player = new Player(tiles);
    this.shoot = new Shoot(tiles);
    this.tiles = tiles;
    this.timer = new Timer();
    this.scores = new Score();
  }

  loop(name) {
    
  }

}