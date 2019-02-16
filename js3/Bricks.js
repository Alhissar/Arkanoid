import Brick from './Brick.js';

function reverseY(collided, entity) {
  // collided[1ere bille][1ere lettre de color]
  if (entity.onFire && collided[0].color[0] !== 'G') return;
  entity.vel.y = -entity.vel.y;
}

function reverseX(collided, entity) {
  // collided[1ere bille][1ere lettre de color]
  if (entity.onFire && collided[0].color[0] !== 'G') return;
  entity.vel.x = -entity.vel.x;
}

export default class Bricks {
  constructor(tiles, level) {
    this.lvlNumber = 1;
    this.level = level;
    this.brick = new Brick(tiles);
    this.score = 0;
    this.collisions = 
      [ {name: null, sound: null, pos: {x: 0, y: 0}} ];
  }
  
  get count() {
    let nb = 0;
    for (let i = 0; i < 13; ++i) {
      for (let j = 0; j < this.level.length; ++j) {
        this.brick.id = this.level[j][i];
        if (this.brick.id) {
          if (this.brick.id[0] !== 'G') ++nb;
          if (this.brick.id[0] === 'S') ++nb;
        }
      }
    }
    return nb;
  }

  draw(game, dt) {
    for (let i = 0; i < 13; ++i) {
      for (let j = 0; j < this.level.length; ++j) {
        this.brick.id = this.level[j][i];
        // opti : si brique, on fait les opérations, sinon rien 
        if (this.brick.id) {
          this.brick.pos.x = i * this.brick.size.x;
          this.brick.pos.y = j * this.brick.size.y;
          // on fait l'animation si besoin
          if (this.brick.id.length > 1) {
            const state = this.brick.id[0];
            const acc = parseFloat(this.brick.id.slice(1)) + dt;
            const frame = Math.floor(acc * this.brick.fps);
            this.level[j][i] = state + acc;
            this.brick.id = state + frame;
            if (frame > 8 && state === 'S') {
              this.level[j][i] = this.brick.id = 's';
            }
            if (frame > 8 && state === 'G') {
              this.level[j][i] = this.brick.id = 'G';
            }
          }

          this.brick.draw(game, dt);
        }
      }
    }
  }


  grid(pos) {
    return {
      col: Math.floor(pos.x / this.brick.size.x),
      row: Math.floor(pos.y / this.brick.size.y)
    };
  }

  state(grid) {
    if (this.level[grid.row]) {
      return this.level[grid.row][grid.col];
    }
  }

  collides(group, axis) {
    let entities = group.all;
    if (group.name === 'enemy') {
      entities = [group];
    }
    const collisions = [];

    const destroy = (collided, entity) => {
      if (entity.name === 'enemy') return;

      const brickGrid = this.grid(collided[0].pos);
      const brickId = collided[0].color;
      if (!brickId) return;

      const collision = {};
      collision.name = entity.name;
      
      switch (brickId[0]) {
        case 'G':
          collision.sound = 'ballG';
          // animation de la brique
          this.level[brickGrid.row][brickGrid.col] = 'G0';
          if (entity.name === 'ball') {
            // on augmente de 2% la vitesse
            entity.speed *= 1.002;
            const len = entity.vel.len; // * 1.002;
            // et 1% de chance de modifier le vecteur
            if (Math.random() < 0.01) {
              entity.vel.x += Math.random() * 50 - 25;
            }
            entity.vel.len = len;
          }
          break;
        case 'S':
          collision.sound = 'ball';
          this.score += 10;
          if (entity.onFire) {
            this.level[brickGrid.row][brickGrid.col] = undefined;
          } else {
            if (brickId === 'S') {
              collision.sound = 'ballS';
              entity.speed *= 1.002;
              this.level[brickGrid.row][brickGrid.col] = 'S0';
            } else {
              this.level[brickGrid.row][brickGrid.col] = undefined;
            }
          }
          break;
        default:
          collision.sound = 'ball';
          this.score += 10;
          // info pour pop bonus
          collision.pos = collided[0].pos;
          this.level[brickGrid.row][brickGrid.col] = undefined;
          break;
      }

      // si bullet, on change le son
      if (entity.name === 'bullet') {
        collision.sound = 'fire1';
        entity.dead = true;
      }

      collisions.push(collision);
    };

    const checkCollision = (border) => {
      
      const [x1, x2, y1, y2] = border;
      // x1, x2 convertis en col1, col2
      const c1 = Math.floor(x1 / this.brick.size.x);
      const c2 = Math.floor(x2 / this.brick.size.x);
      const r1 = Math.floor(y1 / this.brick.size.y);
      const r2 = Math.floor(y2 / this.brick.size.y);
      
      // on cycle entre (col1 et col2), row => state
      const status = [];
      for (let y = r1; y <= r2; ++y) {
        for (let x = c1; x <= c2; ++x) {
          if (this.state( {col: x, row: y} )) {
            status.push( 
              {color: this.state({ col: x, row: y }),
               pos:   {x: x * this.brick.size.x, 
                       y: y * this.brick.size.y }});
          }
        }
      }
      // state ? action
      if (status.length !== 0) {
        return status;
      }
    };

    /**
     * on verifie les collisions
     * en séparant les axes x et y !!!
     */
    entities.forEach(entity => {

      if (axis === "y" || !axis) {
        // on vérifie le top
        if (entity.vel.y < 0) {
          const collided = checkCollision(entity.box.top);
          if (collided && !entity.dead) {
            entity.top = collided[0].pos.y + this.brick.size.y + 1;
            reverseY(collided, entity);
            destroy(collided, entity);
          }
        }
        // bottom
        if (entity.vel.y > 0) {
          const collided = checkCollision(entity.box.bottom);
          if (collided && !entity.dead) {
            entity.bottom = collided[0].pos.y - 1;
            reverseY(collided, entity);
            destroy(collided, entity);
          }
        }
      }

      if (axis === "x" || !axis) {
        // left
        if (entity.vel.x < 0) {
          const collided = checkCollision(entity.box.left);
          if (collided && !entity.dead) {
            entity.left = collided[0].pos.x + this.brick.size.x + 1;
            reverseX(collided, entity);
            destroy(collided, entity);
          }
        }
        // right
        if (entity.vel.x > 0) {
          const collided = checkCollision(entity.box.right);
          if (collided && !entity.dead) {
            entity.right = collided[0].pos.x - 1;
            reverseX(collided, entity);
            destroy(collided, entity);
          }
        }

      }
    });

    return collisions;
  }
}