<template>
  <div id="boot-animation">
    <div id="fakecode" v-if="step == 'fakeCode'">
      <pre>
        <TypeWriter :timeout="40" :spliton="'\n'">{{ fakeCode }}</TypeWriter>
      </pre>
    </div>

    <div id="green-flash" class="glitch" v-if="step == 'greenFlash'"></div>

    <div id="ascii" v-if="step == 'ascii'">
      <pre id="loading">
        <TypeWriter :timeout="60">

Calibrating comedic timing...
Nullifying transactions...
Finding light...
Simulating montage...

        </TypeWriter>
      </pre>
      <AsciiImage :imagename="asciiName"></AsciiImage>
    </div>

    <div id="title" v-bind:class="{inverted: titleInverted}" v-if="step == 'title'">
      <div>IMPROV</div>
      <div>GOD</div>
    </div>

    <div id="subtitle" v-bind:class="{inverted: titleInverted}" v-if="step == 'subtitle'">
      <div>FAMILY REUNION</div>
      <div>EDITION</div>
    </div>


  </div>
</template>

<script>

import _ from 'lodash'
import TypeWriter from './TypeWriter.vue'
import AsciiImage from './AsciiImage.vue'
import { Howler } from 'howler'

var fakeCode = require('../lib/FakeCode.js');

var data = {
  fakeCode: fakeCode,
  step: 'greenFlash',
  asciiArt: '',
  asciiLoaded: false,
  asciiName: 'nothing',
  titleInverted: false
}


function walkThroughFaces() {
  // Walk through ascii faces of improvisers for gag loading screen
  var nameList = ['del', 'charna', 'ian', 'tj', 'viola', 'keith', 'amy']
  function goThroughAsciiImages(nameList, timeout, n) {
    if (n < (nameList.length)) {
      data.asciiName = nameList[n]
      console.log('data', data.asciiName)
      n++;
      setTimeout(function() {
        goThroughAsciiImages(nameList, timeout, n)
      }, timeout);
    }
  }
  goThroughAsciiImages(nameList, 1100, 0)
}

var sounds = {
  electricHum: new Howl({ src: require('../assets/sounds/electricHum.ogg') }),
  glitch01: new Howl({ src: require('../assets/sounds/glitch01.ogg') }),
  glitch02: new Howl({ src: require('../assets/sounds/glitch02.ogg') }),
  glitch03: new Howl({ src: require('../assets/sounds/glitch03.ogg') }),
  impact: new Howl({ src: require('../assets/sounds/impact.ogg') }),
  scanner: new Howl({ src: require('../assets/sounds/scanner.ogg') }),
  tinyglitch01: new Howl({ src: require('../assets/sounds/tinyglitch01.ogg') }),
}

export default {
  name: 'boot-animation',
  components: {
    TypeWriter,
    AsciiImage
  },
  props: ['showStep'],
  data() {
    return data
  },
  mounted() {
    sounds.electricHum.play()
    setTimeout(() => {
      this.step = 'greenFlash'
      sounds.glitch01.play()
    }, 1000)
    setTimeout(() => {
      this.step = 'fakeCode'
      sounds.glitch01.stop()
    }, 1500)
    setTimeout(() => {
      this.step = 'greenFlash'
      sounds.glitch02.play()
    }, 4500)
    setTimeout(() => {
      this.step = 'ascii'
      walkThroughFaces();
      sounds.glitch02.stop()
      sounds.scanner.play()
    }, 5000)
    setTimeout(() => {
      this.step = 'greenFlash'
      sounds.glitch03.play()
      sounds.scanner.stop()
    }, 12500)
    setTimeout(() => {
      this.step = 'nothing'
      sounds.glitch03.stop()
    }, 13000)
    setTimeout(() => {
      this.step = 'title'
      sounds.impact.play()
    }, 15000)
    setTimeout(() => {
      this.step = 'subtitle'
      sounds.impact.play()
    }, 18000)
    let tempOffset = 3000
    setTimeout(() => {
      this.titleInverted = true
      sounds.tinyglitch01.play();
    }, 18000 + tempOffset)
    setTimeout(() => {
      this.step = 'greenFlash'
    }, 18100 + tempOffset)
    setTimeout(() => {
      this.step = 'nothing'
    }, 18300 + tempOffset)
    setTimeout(() => {
      this.showStep.set('intro');
    }, 19500 + tempOffset)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#fakecode {
  font-family: 'VT323';
  position: absolute;
  margin: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  width: 100vw;
  min-height: 100vh;
}

#ascii {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#loading {
  font-family: 'VT323';
  width: 50%;
  font-size: 40px;
}

#title, #subtitle {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 55vh;
  &.inverted {
    color: black;
    background-color: #3cff12;
  }
}

#subtitle {
  font-size: 30vh !important;
}

#green-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #3cff12;
  clip:rect(0,900px,0,0);
  animation:noise-anim .1s infinite linear alternate-reverse;
}

@keyframes noise-anim{
  $steps:40;
  @for $i from 0 through $steps{
    #{percentage($i*(1/$steps))}{
      clip:rect(random(1000)+px,9999px,random(1000)+px,0);
    }
  }
}

</style>
