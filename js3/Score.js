export default class Score {
  constructor() {
    this.bonus = 0;
    this.bricks = 0;
    this.enemies = 0;
    this.all = ['bonus', 'bricks', 'enemies'];
  }

  draw(scorables = this.all) {
    const location = document.getElementById('score');
    let currentScore = 0;
    scorables.forEach(scorable => { currentScore += this[scorable] });
    if (currentScore === this.level) return;
    // this.level = currentScore;
    location.innerText = currentScore;
  }

  reset() {
    this.all.forEach(scorable => { this[scorable] = 0 });
    this.player = 0;
  }
}
