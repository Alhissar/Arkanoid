export default class Timer {
  constructor(dt = 1/120) {
    this.running = false;
    this.ingame = false;
    this.count = 0;

    let lastTime = 0;
    let acc = 0;
  
    this.updateProxy = (time) => {
      acc += (time - lastTime) / 1000;
      // Si l'accumulateur est trop grand (jeu en pause ou onglet basculé),
      // reset de l'acc. (seuil de l'acc : 0.2s)
      if (acc > 0.2) acc = dt * 1.1;
      while (acc > dt) {
        this.update(dt);
        acc -= dt;
      }
      lastTime = time;

      if (this.running) {
        this.enqueue();
      }
    };
  }
  
  enqueue() {
    this.frames = requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.running = true;
    this.enqueue();
  }

  pause() {
    this.running = false;
    this.count = 0;
    cancelAnimationFrame(this.frames);
  }
}