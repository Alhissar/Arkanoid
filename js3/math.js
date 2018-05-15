export class Vec2 {
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

}

export class Vel extends Vec2 {
  constructor(x = 0, y = 0) {
    super(x, y);
  }

  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set len(l) {
    const ang = (this.y > 0) ? Math.acos(this.x / this.len) : - Math.acos(this.x / this.len);
    this.x = Math.cos(ang) * l;
    this.y = Math.sin(ang) * l;
  }

  get angle() {
    return (this.y > 0) ? Math.acos(this.x / this.len) : - Math.acos(this.x / this.len);
  }

  /**
   * donne un angle au vecteur velocity
   * @param {number} a en radians
   */
  set angle(a) {
    this.x = Math.cos(a) * this.len;
    this.y = Math.sin(a) * this.len;
  }
}