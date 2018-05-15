export default class Score {
  constructor() {
    this.game = 0;
    this.level = 0;
    this.player = 0;
  }

  get total() {
    return this.ennemies + this.player;
  }

  add(scorable) {
    this.score += scorable.score;
  }

  draw(scorables) {
    const location = document.getElementById('score');
    let currentScore = 0;
    scorables.forEach(scorable => {
      currentScore += scorable.score;
    });
    if (currentScore === this.level) return;
    this.level = currentScore;
    location.innerText = this.level;
  }

  newLevel() {
    this.ennemies = 0;
    this.player = 0;
  }
}
