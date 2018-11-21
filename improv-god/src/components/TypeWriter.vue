<template>
  <div class="typewriter">
    {{ text }}
  </div>
</template>

<script>
import { Howler } from 'howler'

var sounds = [
  new Howl({ src: require('../assets/sounds/type01.ogg') }),
  new Howl({ src: require('../assets/sounds/type02.ogg') }),
  new Howl({ src: require('../assets/sounds/type03.ogg') }),
  new Howl({ src: require('../assets/sounds/type04.ogg') }),
];

var data = {text: ''}
var timeoutIDs = []

function playSound(volume) {
  if (volume) {
    let i = parseInt(Math.random() * sounds.length)
    sounds[i].volume(volume);
    sounds[i].play();
  }
}

function typeWriter(text, timeout, volume, n) {
  if (n < (text.length)) {
    data.text += text.charAt(n);
    playSound(volume)
    n++;
    let timeoutID = setTimeout(function() {
      typeWriter(text, timeout, volume, n)
    }, timeout);
    timeoutIDs.push(timeoutID)
  }
}

function lineWriter(lines, timeout, volume, n) {
  if (n < (lines.length)) {
    data.text += `\n${lines[n]}`;
    playSound(volume)
    n++;
    let timeoutID = setTimeout(function() {
      lineWriter(lines, timeout, volume, n)
    }, timeout);
    timeoutIDs.push(timeoutID)
  }
}

function print(text, spliton, volume, timeout) {
  timeoutIDs = []
  if (spliton) {
    lineWriter(text.split(spliton), timeout, volume, 0)
  } else {
    typeWriter(text, timeout, volume, 0)
  }
}

function clear() {
  data.text = '';
  timeoutIDs.forEach((id) => {
    clearTimeout(id);
  })
}

var oldText = ''

export default {
  name: 'type-writer',
  props: {
    'timeout': {default: 100},
    'spliton': {default: null},
    'volume': {default: 1.0}
  },
  data() {
    return data
  },
  mounted() {
    print(this.$slots.default[0].text, this.spliton, this.volume, this.timeout)
  },
  updated() {
    let newText = this.$slots.default[0].text;
    if (oldText != newText) {
      oldText = newText;
      clear();
      print(this.$slots.default[0].text, this.spliton, this.volume, this.timeout);
    }
  },
  destroyed() {
    clear()
  }
}

</script>

<style scoped>

</style>
