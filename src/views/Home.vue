<template>
  <div class="container">
    <div class="row">
      <div class="controls three columns">
        <h6>Screen Controls</h6>
        <button class="button-primary" v-on:click="openScreen">Open Screen</button>
        <hr>
        <button v-on:click="step('boot')">Boot</button>
        <button v-on:click="step('intro')">Intro</button>
        <button v-on:click="step('rules')">Rules</button>
        <button v-on:click="step('nothing')">Stop Show</button>
        <hr>
        <button v-on:click="step('simulate')">Simulate</button>
      </div>
      <div class="nine columns">
        <h6>Improvisers</h6>
        <table class='u-full-width'>
          <tr>
            <td>Name</td>
            <td>Subjective Pronoun</td>
            <td>Objective Pronoun</td>
            <td>Possessive Pronoun</td>
          </tr>
          <tr v-for="improviser, i in improvisers">
            <td><input type="text" v-model="improviser.name" v-on:keyup="addImproviserSlot"></td>
            <td><input type="text" v-model="improviser.pronouns.subjective" v-on:keyup="addImproviserSlot"></td>
            <td><input type="text" v-model="improviser.pronouns.objective" v-on:keyup="addImproviserSlot"></td>
            <td><input type="text" v-model="improviser.pronouns.possessive" v-on:keyup="addImproviserSlot"></td>
          </tr >
        </table>
        <div class="row">
          <label for="performance-duration">Duration (minutes)</label>
          <input type="number" id="performance-duration" v-model="performanceDuration">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

var data = {
  performanceDuration: 20,
  improvisers: [
    {
      name: '',
      pronouns: {
        subjective: 'he',
        objective: 'him',
        possessive: 'his'
      }
    },
  ],
  showStep: 'nothing'
}

export default {
  name: 'App',

  data() {
    return data;
  },

  mounted() {
		// this.screen = window.open('/screen');

    window.onmessage = ({ showStep }) => {
      if (!showStep) return;

      this.showStep = showStep;
    }
  },

  methods: {
    openScreen() {
      this.screen = window.open('/screen')
    },

    step(message) {
      this.screen.postMessage({
        step: message,
        improvisers: this.improvisers.filter(improviser => improviser.name.length > 0),
        performanceDuration: parseFloat(this.performanceDuration),
      })
    },

    addImproviserSlot(e) {
      if (this.improvisers[this.improvisers.length - 1].name.length > 0) {
        this.improvisers.push({
          name: '',
          pronouns: {
            subjective: 'he',
            objective: 'him',
            possessive: 'his'
          }
        });
      }
    },
  },
}
</script>

<style lang='scss'>
.controls {
  button {
    width: 100%;
  }
}
</style>
