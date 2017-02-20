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
      Tonight's Improvisers
      <div v-for="improviser, i in improvisers">
        {{ i + 1 }}) <input type="text" v-model="improviser.name" v-on:keyup="addImproviserSlot">
        <label><input type="radio" v-model="improviser.gender" value="male" /> Male</label>
        <label><input type="radio" v-model="improviser.gender" value="female" /> Female</label>
      </div >
    </div>
  </div>
</template>

<script>
import Hello from './components/Hello'
import io from 'socket.io-client'
import _ from 'lodash'

var data = {
  improvisers: [{name: '', gender:'male'}],
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
        improvisers: this.improvisers.filter(o => o.name.length > 0),
        names: (
          this.improvisers.map((o) => {
            return o.name;
          }).filter((o) => {
            return o.length > 0;
          })
        )
      })
    },
    addImproviserSlot(e) {
      console.log('addImproviserSlot')
      if (this.improvisers[this.improvisers.length - 1].name.length > 0) {
        this.improvisers.push({name: '', gender: 'male'});
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
