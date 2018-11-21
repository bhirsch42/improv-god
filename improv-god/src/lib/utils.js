export function speak(text, voice) {
  return new Promise(resolve => {
    var utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = resolve

    if (voice) {
      utterance.voice = _.find(speechSynthesis.getVoices(), {name: voice});
    }

    utterance.pitch = .1;
    utterance.rate = .9;
    speechSynthesis.speak(utterance);
  })
}
