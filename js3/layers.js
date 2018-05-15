
function createBuffer() {
  const buffer = document.createElement('canvas');
  buffer.width = 572;
  buffer.height = 720;
  return buffer;
}

export function draw(entities, context, timer, dt) {
  const game = createBuffer();
  // entities est un tableau d'objets à afficher
  entities.forEach(entity => {
    entity.draw(game, dt);
    if (entity.name === 'player') entity.drawLifes(game);
  });
  context.clearRect(111, 72, game.width, game.height);
  context.drawImage(game, 111, 72);
}
