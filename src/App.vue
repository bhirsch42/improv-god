<template>
  <div id="app">
    <BootAnimation></BootAnimation>
  </div>
</template>

<script>
import BootAnimation from './components/BootAnimation'
import io from 'socket.io-client'
require('./Jscii.js')
// typeWriter(fakeCode, 0)




var socket = io.connect('http://localhost:8081');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

// var client = new XMLHttpRequest();
// client.open('GET', './assets/fake_code.js');
// client.onreadystatechange = function() {
//   console.log(client.responseText);
// }
// client.send();


export default {
  name: 'app',
  components: {
    BootAnimation
  },
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
