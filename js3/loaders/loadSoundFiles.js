
export default function loadSounds(audio, audioContext) {

  function loadAudio(url, id) {
    
    const task = fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => {
        audio[id] = buffer;
      });
    loadingArray.push(task);
  }

  const loadingArray = [];
  const loadingData = 
    [
      ['../sounds/player.wav', 'player'],
      ['../sounds/ball.wav', 'ball'],
      ['../sounds/ballS.wav', 'ballS'],
      ['../sounds/ballG.wav', 'ballG'],
      ['../sounds/fire1.wav', 'fire1'],
      ['../sounds/fire2.wav', 'fire2'],
      ['../sounds/extended.wav', 'extended'],
      ['../sounds/life.wav', 'life'],
      ['../sounds/lost.wav', 'lost'],
      ['../sounds/multi.wav', 'multi'],
      ['../sounds/gameover.wav', 'gameover'],
      ['../sounds/crash.wav', 'crash'],
      ['../sounds/startLevel.wav', 'level'],
    ];
  
  loadingData.forEach( ([url, id]) => {
    loadAudio(url, id);
  });

  return Promise.all(loadingArray);
}