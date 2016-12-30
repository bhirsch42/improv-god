<template>
  <div id="app">
    <button v-on:click="step('boot')">Start Show</button>
    <button v-on:click="step('nothing')">Stop Show</button>
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
  components: {
    Hello
  },
  methods: {
    step(message) {
      socket.emit('admin to screen', {step: message})
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
