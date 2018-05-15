export function playAudio(audio, audioContext) {
  return function play(id) {
    const source = audioContext.createBufferSource();
    const volume = audioContext.createGain();
    volume.gain.setValueAtTime(0.15, 0);
    source.connect(volume);
    volume.connect(audioContext.destination);
    source.buffer = audio[id];
    source.start(0);
  };
}