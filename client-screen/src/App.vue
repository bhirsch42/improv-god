<template>
  <div id="app">
    <div v-if="step.current == 'boot'">
      <BootAnimation :showStep="step"></BootAnimation>      
    </div>
    <div v-if="step.current == 'intro'">
      <Intro :names="names" :step="step"></Intro>      
    </div>
    <div v-if="step.current == 'rules'">
      <Rules :ruleGens="rules" :names="names"></Rules>      
    </div>
  </div>
</template>

<script>
import BootAnimation from './components/BootAnimation'
import Intro from './components/Intro'
import Rules from './components/Rules'
import io from 'socket.io-client'
require('./Jscii.js')

var socket = io.connect('http://localhost:8082');

socket.emit('screen to admin', {message: "The screen sent this me!"})

export default {
  name: 'app',
  components: {
    BootAnimation,
    Intro,
    Rules
  },
  data() {
    return {
      step: {current: 'nothing'},
      names: [],
      rules: {}
    }
  },
  mounted() {
    socket.on('admin to screen', (data) => {
      console.log(data);
      this.step.current = data.step;
      this.names = data.names;
      this.rules = data.rules;
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
