<template>
  <div id="app">
    <div id="controls">
      <button :class="{running: showStep == 'boot'}" v-on:click="step('boot')">Boot</button>
      <button :class="{running: showStep == 'intro'}" v-on:click="step('intro')">Intro</button>
      <button :class="{running: showStep == 'rules'}" v-on:click="step('rules')">Rules</button>
      <button :class="{running: showStep == 'nothing'}" v-on:click="step('nothing')">Stop Show</button>
      <hr style="width: 100%">
      <button :class="{running: showStep == 'simulate'}" v-on:click="step('simulate')">Simulate</button>
    </div>
    <div id="improviser-names">
      <table>
        <tr>
          <td>#</td>
          <td>Name</td>
          <td>Subjective Pronoun</td>
          <td>Objective Pronoun</td>
          <td>Possessive Pronoun</td>
        </tr>
        <tr v-for="improviser, i in improvisers" :style="{backgroundColor: improviser.name.length > 0 ? 'white' : 'orange'}">
          <td>{{ i + 1 }})</td>
          <td><input type="text" v-model="improviser.name" v-on:keyup="addImproviserSlot"></td>
          <td><input type="text" v-model="improviser.pronouns.subjective" v-on:keyup="addImproviserSlot"></td>
          <td><input type="text" v-model="improviser.pronouns.objective" v-on:keyup="addImproviserSlot"></td>
          <td><input type="text" v-model="improviser.pronouns.possessive" v-on:keyup="addImproviserSlot"></td>
        </tr >
        
      </table>
    </div>
  </div>
</template>

<script>
import Hello from './components/Hello'
import io from 'socket.io-client'
import _ from 'lodash'

var data = {
  improvisers: [{
    name: '',
    pronouns: {
      subjective: 'she',
      objective: 'her',
      possessive: 'hers'
    }
  }],
  showStep: 'nothing'
}

var socket = io.connect('http://localhost:8082');

socket.emit('admin to screen', {message: "The admin sent this to the screen!"})

socket.on('screen to admin', (screenData) => {
  _.extend(data, screenData);
})

export default {
  name: 'app',
  data() {
    return data;
  },
  components: {
    Hello
  },
  methods: {
    step(message) {
      socket.emit('admin to screen', {
        step: message,
        improvisers: this.improvisers.filter(improviser => improviser.name.length > 0)
      })
    },
    addImproviserSlot(e) {
      console.log('addImproviserSlot')
      if (this.improvisers[this.improvisers.length - 1].name.length > 0) {
        this.improvisers.push({
          name: '',
          pronouns: {
            subjective: 'she',
            objective: 'her',
            possessive: 'hers'
          }
        });
      }
    }
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: space-around;
}

#controls {
  display: flex;
  flex-direction: column;
  width: 150px;
  button {
    position: relative;
    margin: 10px;
    height: 30px;
    font-size: 20px;
    &.running {
      background-color: red;
      color: white;
    }
  }
}
</style>
