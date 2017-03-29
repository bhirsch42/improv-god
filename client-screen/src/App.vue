<template>
  <div id="app">
    <div v-if="step.current == 'boot'">
      <BootAnimation :showStep="step"></BootAnimation>
    </div>
    <div v-if="step.current == 'intro'">
      <Intro :names="names" :step="step"></Intro>
    </div>
    <div v-if="step.current == 'rules'">
      <Rules :ruleGens="rules" :improvisers="improvisers"></Rules>
    </div>
    <div v-if="step.current == 'simulate'">
      <Simulation :ruleGens="rules" :names="names" :improvisers="improvisers"></Simulation>
    </div>
  </div>
</template>

<script>
import BootAnimation from './components/BootAnimation'
import Intro from './components/Intro'
import Rules from './components/Rules'
import Simulation from './components/Simulation'
import io from 'socket.io-client'
require('./Jscii.js')

var socket = io.connect('http://localhost:8082');

socket.emit('screen to admin', {message: "The screen sent this me!"})

export default {
  name: 'app',
  components: {
    BootAnimation,
    Intro,
    Rules,
    Simulation
  },
  data() {
    return {
      step: {
        current: 'nothing',
        set(s) {
          this.current = s;
          socket.emit('screen to admin', {showStep: this.current});
        }
      },
      improvisers: [],
      names: [],
      rules: {}
    }
  },
  mounted() {
    socket.on('admin to screen', (data) => {
      let s = data.showStep;

      this.step.set(data.step);
      this.improvisers = data.improvisers;
      this.names = data.improvisers.map(improviser => improviser.name);
      this.rules = data.rules;

      if (s != 'nothing' && this.step.current == 'nothing') {
        location.reload()
      }
    })
  }
}
</script>

<style>
@font-face {
  font-family: 'VT323';
  src:  url('./assets/VT323/VT323-Regular.ttf') format('ttf');
}

body, html {
  font-family: 'VT323';
  background-color: black;
  color: #3cff12;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

#app {

}
</style>
