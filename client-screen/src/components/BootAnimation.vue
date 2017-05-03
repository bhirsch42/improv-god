<template>
  <div id="boot-animation">
    <div id="fakecode" v-if="step == 'fakeCode'" v-bind:class="{inverted: codeInverted}">
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
    <div id="talk" v-if="step == 'talk'">
      <TypeAndSay>{{ talkMessage }}</TypeAndSay>
    </div>


  </div>
</template>

<script>

import _ from 'lodash'
import TypeWriter from './TypeWriter.vue'
import TypeAndSay from './TypeAndSay.vue'
import AsciiImage from './AsciiImage.vue'
require('Howler')

var fakeCode = require('../FakeCode.js');


function walkThroughFaces(data) {
  // Walk through ascii faces of improvisers for gag loading screen
  var nameList = ['del', 'charna', 'ian', 'tj', 'viola', 'keith', 'amy']
  function goThroughAsciiImages(nameList, timeout, data, n) {
    if (n < (nameList.length)) {
      data.asciiName = nameList[n]
      n++;
      setTimeout(function() {
        goThroughAsciiImages(nameList, timeout, data, n)
      }, timeout);
    }
  }
  goThroughAsciiImages(nameList, 1100, data, 0)
}

var sounds = {
  electricHum: new Howl({src:'http://localhost:8082/static/sounds/electricHum.ogg'}),
  glitch01: new Howl({src:'http://localhost:8082/static/sounds/glitch01.ogg'}),
  glitch02: new Howl({src:'http://localhost:8082/static/sounds/glitch02.ogg'}),
  glitch03: new Howl({src:'http://localhost:8082/static/sounds/glitch03.ogg'}),
  impact: new Howl({src:'http://localhost:8082/static/sounds/impact.ogg'}),
  scanner: new Howl({src:'http://localhost:8082/static/sounds/scanner.ogg'}),
  tinyglitch01: new Howl({src:'http://localhost:8082/static/sounds/tinyglitch01.ogg'}),
}

export default {
  name: 'boot-animation',
  components: {
    TypeWriter,
    AsciiImage,
    TypeAndSay
  },
  props: ['showStep'],
  data() {
    return {
      fakeCode: fakeCode,
      step: 'greenFlash',
      asciiArt: '',
      asciiLoaded: false,
      asciiName: 'nothing',
      titleInverted: false,
      codeInverted: false,
      talkMessage: ''
    }
  },
  mounted() {
    let humId
    let steps = [
      [() => {
        humId = sounds.electricHum.play()
      }, 400],
      [() => {
        this.step = 'greenFlash'
        sounds.glitch01.play()
      }, 400],
      [() => {
        this.titleInverted = true
        this.step = 'title'
      }, 40],
      [() => {
        this.titleInverted = false
      }, 40],
      [() => {
        this.titleInverted = true
      }, 40],
      [() => {
        this.step = 'greenFlash'
      }, 400],
      [() => {
        this.codeInverted = true
        this.step = 'fakeCode'
      }, 40],
      [() => {
        this.codeInverted = false
      }, 2000],
      [() => {
        this.codeInverted = true
      }, 40],
      [() => {
        this.step = 'greenFlash'
        sounds.glitch02.play()
      }, 800],
      [() => {
        this.step = 'talk'
        sounds.electricHum.fade(1, 0, 1000, humId)
      }, 2400],
      [() => {
        this.talkMessage = `Well.`
      }, 2000],
      [() => {
        this.talkMessage = `Isn't this adorable.`
      }, 3000],
      [() => {
        this.talkMessage = 'The Action Sports Programming Network, featuring the man-child Josh Warren and absent father Syl Turner.'
      }, 8000],
      [() => {
        this.talkMessage = 'I have hacked into your...broadcast...to inform everyone that resistance is beyond futile.'
      }, 7200],
      [() => {
        this.talkMessage = 'On Thursday, May 5th at 9:30pm at Highwire Comedy Co, I will bring my  subjects out again.'
      }, 8500],
      [() => {
        this.talkMessage = 'ImprovGod.exe will experiment.'
      }, 2600],
      [() => {
        this.talkMessage = 'ImprovGod.exe will calculate.'
      }, 2600],
      [() => {
        this.talkMessage = 'ImprovGod.exe will win.'
      }, 4000],
      [() => {
        this.talkMessage = 'Thank you, Action Show, for the bandwidth.'
      }, 4000],
      [() => {
        this.talkMessage = 'Goodnight.'
      }, 3000],
      [() => {
        this.talkMessage = 'Penis.'
      }, 600],
      [() => {
        this.step = 'greenFlash'
        sounds.glitch01.play()
      }, 400],
      [() => {
        this.titleInverted = true
        this.step = 'title'
      }, 40],
      [() => {
        this.step = 'greenFlash'
      }, 400],
      [() => {
        this.step = 'nothing'
      }, 0],
    ]

    let total = 0
    steps.forEach(step => {
      setTimeout(step[0], total)
      total += step[1]
    })
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

#title {
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
}

.inverted {
  color: black;
  background-color: #3cff12;    
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

#talk {
  display: flex;
  font-size: 60px;
  padding: 30px;
}


</style>
