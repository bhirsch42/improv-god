<template>
  <div id="screen">
    <div v-if="step.current == 'boot'">
      <BootAnimation :showStep="step"></BootAnimation>
    </div>
    <div v-if="step.current == 'intro'">
      <Intro :names="names" :performanceDuration="performanceDuration" :step="step"></Intro>
    </div>
    <div v-if="step.current == 'rules'">
      <Rules :ruleGens="rules" :improvisers="improvisers" :performanceDuration="performanceDuration"></Rules>
    </div>
    <div v-if="step.current == 'simulate'">
      <Simulation :ruleGens="rules" :names="names" :improvisers="improvisers" :performanceDuration="performanceDuration"></Simulation>
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
      rules: require('../assets/rules.json'),
    }
  },
  mounted() {
    parent.onmessage = ({ data }) => {
      console.log('SCREEN', data)
      if (!(data.improvisers && data.improvisers.length > 0)) return;

      let s = data.showStep;

      this.step.set(data.step);
      this.improvisers = data.improvisers;
      this.performanceDuration = data.performanceDuration;
      console.log(this.performanceDuration)
      this.names = data.improvisers.map(improviser => improviser.name);

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
  src: url('../assets/fonts/VT323-Regular.ttf');
}

#screen {
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'VT323';
  background-color: black;
  color: #3cff12;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  line-height: normal;
}
</style>
