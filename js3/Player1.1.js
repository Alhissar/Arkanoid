// import {playAudio} from './sounds.js';
import { SpriteSheet } from './SpriteSheet.js';
import { createAnim } from './SpriteSheet.js';
import Entity from './Entity.js';

export default class Player extends Entity {
  constructor(tiles) {
    super(80, 22);
    // codage en dur de this.size.x = 120 pour spritesheet()
    // dans le cas ou player.id === 'extended'
    this.sprites = new SpriteSheet(tiles, 0, 44, 120, this.size.y);
    this.lifeSprite = new SpriteSheet(tiles, 690, 0, 32, 32);
    this.lifeSprite.define('life', 0, 0);
    this.states = [
      ['default60', 1, 0], ['default80', 0, 0], ['default120', 2, 0], 
      ['Sdefault60', 1, 4], ['Sdefault80', 0, 4], ['Sdefault120', 2, 4],
      ['laser80', 3, 0], ['Slaser80', 3, 4]
    ];
    this.anims = createAnim(4, this.states, 0, 1);
    // this.anims = {default: [[0,0], [0,1], [0,2], ...};
    this.createSprites(this.sprites, this.states, this.anims);
    
    this.dyingSprites = new SpriteSheet(tiles, 0, 468, 156, 52);
    this.dyingStates = [
      ['default60', 0, 1], ['default80', 0, 0], ['default120', 1, 1],
      ['Sdefault60', 2, 1], ['Sdefault80', 2, 0], ['Sdefault120', 3, 1],
      ['laser80', 1, 0], ['Slaser80', 3, 0]
    ];
    this.dyingAnims = createAnim(4, this.dyingStates, 0, 1);
    this.createSprites(this.dyingSprites, this.dyingStates, this.dyingAnims);
    this.explOffset = { x: 18, y: 15 };


    this.fps = 8;
    // this.id = 'default80';
    this.running = false;
    this.state = 'default';
    this.sticky = false;
    this.lifes = 3;
    this.name = 'player';
    this.pos.set(240, 610);
    // this.score = 0;
  }

  get center() {
    return {
      x: (this.left + this.right) / 2,
      y: (this.top + this.bottom) / 2,
    };
  }

  /**
   * Gère les collisions,
   * Renvoie le résumé
   * @param {object} object 
   * @return {Array} [ {name: string, pos: {x,y}}, ...]
   */
  collides(object) {
    let entities = [object];

    /**
     * @type {array} Résumé des collisions
     */
    const collisions = [];
    if (object.name === 'balls') entities = object.all;
    if (object.name === 'enemies') entities = object.all;
    
    entities.forEach((entity, index) => {
      const intersects = this.intersects(entity);
      if (!intersects || entity.dead) return;

      const collision = {};
      collision.name = entity.name;
      //
      // collision avec les billes
      if (entity.name === "ball") {
        if (entity.vel.y < 0) return;
        
        // entity.pos.y = this.top - entity.size.y;
        entity.stickOffset = entity.center.x - this.center.x;
        
        // on stocke vel.len avant les calculs d'angle
        const len =  entity.vel.len;
        // il faut calculer un angle et modifier entity.vel en consequence
        // de PI/8 à 3PI/8 droite
        const angle = Math.abs(entity.stickOffset) * 
                      (-Math.PI / 240) +
                      3/8  * Math.PI;
        entity.vel.angle = angle;
        // on inverse vel.x si offset négatif
        if (entity.stickOffset < 0) entity.vel.x = -entity.vel.x;
        // on inverse vel.y (vel.y augmente quand la bille descend)
        entity.vel.y = -entity.vel.y;
        // on récupère vel.len d'avant les calculs
        entity.vel.len = len;
        
        if (this.sticky) {
          entity.pos.y = this.top - entity.size.y;
          this.normalizeOffset(entity);
          entity.stick(this);
        }
        collision.sound = 'player';
      }

      //
      // collision avec les bonus
      //
      if (entity.name === 'bonus') {
        collision.sound = entity.id;
        entity.score += 100;
        
        switch (entity.id) {
          case 'extended':
          this.size.x += (this.size.x === 60) ? 20 : 40;
          if (this.size.x > 120) this.size.x = 120;
          this.state = 'default';
          break;
          case 'short':
          this.size.x -= (this.size.x === 80) ? 20 : 40;
          if (this.size.x < 60) this.size.x = 60;
          this.state = 'default';
          break;
          case 'sticky':
          this.sticky = true;
          break;
          case 'life':
          ++this.lifes;
          break;
          case 'laser':
          this.state = 'laser';
          this.size.x = 80;
          break;
          case 'neutron':
          this.state = 'default';
          this.sticky = false;
          break;
          case 'multi':
          this.sticky = false;
          break;
          
          default:
          // this.size.x = 80;
        }

        this.id = this.getId();
        entity.dead = true;
      }

      if (entity.name === 'enemy' && !entity.dying) {
        entity.kill();
        collision.sound = 'crash';
      }

      collisions.push(collision);
    });
    return collisions;
  }

  /**
   * Dessine les vies du joueur
   */
  drawLifes(game) {
    const context = game.getContext('2d');
    const sprite = this.lifeSprite.tiles.get('life');
    for (let life = 1; life < this.lifes; ++life) {
      context.drawImage(sprite, life * 15, 640);
    }
  }

  /**
   * Renvoie l'Id du joueur (ex: Sdefault80)
   */
  getId() {
    let id = '';
    if (this.sticky) id += 'S';
    id += this.state + this.size.x;
    return id;
  }

  loose(balls) {
    --this.lifes;
    if (this.lifes > 0) {
      this.reset(balls);
    } else {
      console.log('GAME OVER');
    }
  }

  normalizeOffset(ball) {
    const half = this.size.x / 2;
    if (ball.stickOffset > half) ball.stickOffset = half;
    if (ball.stickOffset < 0 && ball.stickOffset < -half) {
      ball.stickOffset = -half;
    }
  }

  /**
   * Réinitialise le joueur et la bille
   * @param {Balls} balls 
   */
  reset(balls){
    this.size.x = 80;
    this.sticky = false;
    this.dying = false;
    this.dead = false;
    this.state = 'default';
    this.id = this.getId();
    this.running = false;
    balls.reset();
    // balls.fireOff();
    balls.all[0].pos.set(this.center.x - 5, 600);
  }

  

  /**
   * Mise à jour du joueur et de l'offset de ball
   * @param {Ball} ball necessaire pour le calcul de sa position
   * @param {Event} x delta X
   */
  update(balls, x) {
    
    this.pos.x += Math.floor(x);
    if (this.pos.x < 0) this.pos.x = 0;
    if (this.right > 572) this.right = 572;

    // on cycle dans les billes
    balls.all.forEach(ball => {
      if (ball.dead) return;
      if (ball.stickOffset > this.size.x / 2) {
        this.normalizeOffset(ball);
      }
      if (this.running) {
        if (ball.stuck) {
          ball.pos.x = ball.stickOffset + this.center.x - ball.size.x / 2;
        }
      }
      
      if (!this.running) {
        ball.pos.x = ball.stickOffset + this.center.x - ball.size.x / 2;
      }
    });
  }
}