<template>
  <div class="typewriter">
    {{ text }}
  </div>
</template>

<script>

require('Howler')
var sounds = [
  new Howl({src:'http://localhost:8081/static/sounds/type01.ogg'}),
  new Howl({src:'http://localhost:8081/static/sounds/type02.ogg'}),
  new Howl({src:'http://localhost:8081/static/sounds/type03.ogg'}),
  new Howl({src:'http://localhost:8081/static/sounds/type04.ogg'}),
  new Howl({src:'http://localhost:8081/static/sounds/type05.ogg'})
]

var data = {text: ''}
var timeoutIDs = []

function playSound() {
  sounds[parseInt(Math.random() * sounds.length)].play()
}

function typeWriter(text, timeout, n) {
  if (n < (text.length)) {
    data.text += text.charAt(n);
    playSound()
    n++;
    let timeoutID = setTimeout(function() {
      typeWriter(text, timeout, n)
    }, timeout);
    timeoutIDs.push(timeoutID)
  }
}

function lineWriter(lines, timeout, n) {
  if (n < (lines.length)) {
    data.text += `\n${lines[n]}`;
    playSound()
    n++;
    let timeoutID = setTimeout(function() {
      lineWriter(lines, timeout, n)
    }, timeout);
    timeoutIDs.push(timeoutID)
  }
}

function print(text, spliton, timeout) {
  timeoutIDs = []
  if (spliton) {
    lineWriter(text.split(spliton), timeout, 0)
  } else {
    typeWriter(text, timeout, 0)      
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
  props: ['timeout', 'spliton'],
  data() {
    return data
  },
  mounted() {
    print(this.$slots.default[0].text, this.spliton, this.timeout)
  },
  updated() {
    let newText = this.$slots.default[0].text;
    if (oldText != newText) {
      oldText = newText;
      clear();
      print(this.$slots.default[0].text, this.spliton, this.timeout);
    }
  },
  destroyed() {
    clear()
  }
}

</script>

<style scoped>

</style>