export default function loadLevel(lvl) {
  return new Promise (resolve => {
    fetch(`./levels/${lvl}.txt`)
    .then(txt => txt.text())
    .then(lvltxt => {
      const tmp = lvltxt.split('\n');

      const lvl = tmp.map(row => {
        row = row.split('');
        row.pop();
        const result = [];
        row.forEach(brick => {
          if (brick === ' ') {brick = undefined;}
          result.push(brick);
        });
        return result;
      });
      resolve(lvl);
    });
  });
}