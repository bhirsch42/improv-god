<template>
  <div id="screen">
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
import BootAnimation from '../components/BootAnimation'
import Intro from '../components/Intro'
import Rules from '../components/Rules'
import Simulation from '../components/Simulation'
require('../lib/Jscii.js')

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
          parent.postMessage({showStep: this.current});
        }
      },
      improvisers: [],
      names: [],
      rules: {}
    }
  },
  mounted() {
    parent.onmessage = ({ data }) => {
      console.log('SCREEN', data)
      if (!data.improvisers.length > 0) return;

      let s = data.showStep;

      this.step.set(data.step);
      this.improvisers = data.improvisers;
      this.names = data.improvisers.map(improviser => improviser.name);
      this.rules = data.rules;

      if (s != 'nothing' && this.step.current == 'nothing') {
        location.reload()
      }
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'VT323';
  src:  url('../assets/fonts/VT323-Regular.ttf') format('ttf');
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
</style>
