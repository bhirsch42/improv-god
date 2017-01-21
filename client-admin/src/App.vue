<template>
  <div id="app">
    <div id="controls">
      <button v-on:click="step('boot')">Boot</button>
      <button v-on:click="step('intro')">Intro</button>
      <button v-on:click="step('rules')">Rules</button>
      <button v-on:click="step('nothing')">Stop Show</button>
    </div>
    <div id="improviser-names">
      Names of Improvisers
      <div v-for="improviser, i in improvisers">
        {{ i + 1 }}) <input type="text" v-model="improviser.name" v-on:keyup="addImproviserSlot">
      </div >
    </div>
  </div>
</template>

<script>
import Hello from './components/Hello'
import io from 'socket.io-client'

var socket = io.connect('http://localhost:8082');

socket.emit('admin to screen', {message: "The admin sent this to the screen!"})

socket.on('screen to admin', (data) => {
  console.log(data);
})

export default {
  name: 'app',
  data() {
    return {
      improvisers: [{name: ''}]
    }
  },
  components: {
    Hello
  },
  methods: {
    step(message) {
      socket.emit('admin to screen', {
        step: message,
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
        this.improvisers.push({name: ''});
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
