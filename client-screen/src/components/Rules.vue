<template>
  <div id="rules">
    <div v-if="step == 'board'">
      <div id="board-title">
        Active Rules
<!--         <small>
          <span>|</span>
          <span v-on:click="doAction('addRule')">Add Rule</span>
          <span>|</span>
          <span v-on:click="doAction('removeRule')">Remove Rule</span>
        </small>
 -->      </div>
      <div id="board">
        <div v-for="rule in rules">
          <div class="rule" :class="{removing: rule.removing}">
            {{ rule.text }}
          </div>      
        </div>
      </div>
    </div>
    <div v-if="step == 'new rule'" id="new-rule">
      <div class="flash-text">
        NEW RULE
      </div>
    </div>
    <div v-if="step == 'new command'" id="new-command">
      <div class="flash-text">
        NEW COMMAND
      </div>
    </div>
    <div v-if="step == 'remove rule'" id="new-rule">
      <div class="flash-text">
        REMOVING RULE
      </div>
    </div>
    <div v-if="step == 'read rule'">
      <TypeAndSay :timeout="40" :doneReading="doneReading">
        {{ readRuleText }}
      </TypeAndSay>
    </div>
    <div v-if="step == 'closer'">
      <div id="closer" :class="{'flash-text': closerStep == 'closer title'}">
        <div v-if="closerStep == 'closer title'">
          <div class="flash-text">
            CLOSER
          </div>
        </div>
        <div v-if="closerStep == 'read closer'">
          <TypeAndSay :timeout="40" :doneReading="closerFunc">
            {{ closerText }}
          </TypeAndSay>
        </div>
        <div v-if="closerStep == 'playing out'">
          &lt;playing you out&gt;
        </div>
        <div v-if="closerStep == 'lights down'">
          Lights down
        </div>
        <div v-if="closerStep == 'advertise'">
          {{ adMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import TypeAndSay from './TypeAndSay.vue'
import Strategies from '../utils/Strategies.js'
import _ from 'lodash'
import RuleAI from './RuleAI'

require('Howler')
var alert01 = new Howl({src:'http://localhost:8082/static/sounds/alert01.ogg'})
var alert02 = new Howl({src:'http://localhost:8082/static/sounds/alert02.ogg'})
var threeBeeps = new Howl({src:'http://localhost:8082/static/sounds/threeBeeps.ogg'})
var oneBoop = new Howl({src:'http://localhost:8082/static/sounds/oneBoop.ogg'})
var endSong = new Howl({src: 'http://localhost:8082/static/sounds/Who Likes to Party.mp3'})
var heartOfCourage = new Howl({src: 'http://localhost:8082/static/sounds/heartOfCourage.mp3'})
var sixBoops = new Howl({src:'http://localhost:8082/static/sounds/sixBoops.ogg'})    
var closerMusic = new Howl({src:'http://localhost:8082/static/sounds/closerMusic.ogg'})    

var addRuleDoneReading = () => {
  setTimeout(() => {
    data.step = 'board'
    alert02.play();
  }, 500);
}

var removeRuleDoneReading = () => {
  setTimeout(() => {
    data.step = 'board'
    oneBoop.play();
  }, 500);
}

var data = {
  rules: [],
  step: 'board',
  readRuleText: '',
  doneReading: addRuleDoneReading,
  closerStep: 'closer title',
  closerText: '',
  closerFunc() {},
  adMessage: 'like us on facebook.com/improvgod'
}

function addRule(rule, cb) {
  data.doneReading = addRuleDoneReading;
  data.step = 'new rule'
  alert01.play();
  cb()

  setTimeout(() => {
    data.readRuleText = rule.text
  }, 1500)
  setTimeout(() => {
    data.step = 'read rule'
  }, 1400)
}

function removeRule(rule, cb) {

  data.doneReading = removeRuleDoneReading;
  data.step = 'remove rule'
  threeBeeps.play();

  setTimeout(() => {
    data.readRuleText = rule.removalText
  }, 1100)
  setTimeout(() => {
    data.step = 'read rule'
  }, 1000)
  setTimeout(() => {
    cb()
  }, 3100)
}

function quickRemoveRule(rule, cb) {
  sixBoops.play();
  setTimeout(() => {
    rule.removing = true;
  }, 0)
  setTimeout(() => {
    rule.removing = false;
  }, 420)   
  setTimeout(() => {    
    rule.removing = true;   
  }, 840)   
  setTimeout(() => {
    rule.removing = false;
  }, 1260)
  setTimeout(() => {
    rule.removing = true;
  }, 1680)

  setTimeout(() => {
    cb()
  }, 3100)
}

function displayCommand(rule) {
  data.doneReading = addRuleDoneReading;
  data.step = 'new command'
  alert01.play();

  setTimeout(() => {
    data.readRuleText = rule.text
  }, 1500)
  setTimeout(() => {
    data.step = 'read rule'
  }, 1400)
}

var closers = [
  {
    message: 'The show is over. Congratulations.',
    func() {
      endSong.play();
    }
  }  
]

function closeShow() {
  data.closerFunc = () => {
    setTimeout(() => {
      data.closerStep = 'playing out'      
    }, 1000)
    setTimeout(() => {
      closerMusic.play()
    }, 1000)
    setTimeout(() => {
      data.closerStep = 'lights down'
    }, 22000)
    setTimeout(() => {
      endSong.play()
      data.closerStep = 'advertise'
      setInterval(() => {
        data.adMessage = data.adMessage + ' like us on facebook.com/improvgod'
      }, 510)
    }, 32000)
  }

  data.step = 'closer';
  alert01.play();

  setTimeout(() => {
    data.closerText = "All rules removed. You have thirty seconds to end the show."
  }, 1500)
  setTimeout(() => {
    data.closerStep = 'read closer'
  }, 1400)
}

export default {
  name: 'rules',
  props: ['ruleGens', 'improvisers'],
  data() {
    return data
  },
  components: {
    TypeAndSay
  },
  mounted() {
    let ruleAI = new RuleAI({
      addRule: addRule,
      displayCommand: displayCommand,
      endShow: closeShow,
      improvisers: this.improvisers,
      removeRule: quickRemoveRule,
      ruleData: this.ruleGens,
      rules: data.rules
    })
    ruleAI.start()
    window.ruleAI = ruleAI
  }
}
</script>

<style scoped lang="scss">
  $green: #3cff12;

  .title {
    border-bottom: 10px solid $green;
    padding: 15px;
  }

  #rules {
    font-size: 60px;
    padding: 30px;
    position: relative;
    top: 50px;
  }

  #board-title {
    position: absolute;
    top: 30px;
    left: 0;
    height: 8vh;

    font-size: 10vh;
    padding-bottom: 5px;
    margin-left: 30px;
    border-bottom: 1vh solid $green;
  }

  #board {
    position: absolute;
    padding-top: 30px;
    top: 10vh;
    width: 100vw;
    left: 0;
    height: 90vh;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .rule {
    border: 10px solid $green;
    padding: 15px;
    margin-top: 30px;
    margin-left: 30px;
    font-size: 50px;
  }

  .removing {
    color: black;
    background-color: $green;
  }

  #new-rule {
    font-size: 120px;
  }

  .flash-text {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 240px;
    animation: flash-text 1s infinite linear;
  }

  @keyframes flash-text{
    1% {background-color: black; color: $green;} 

    24% {background-color: black; color: $green;} 
    25% {background-color: $green; color: black;} 

    49% {background-color: $green; color: black;} 
    50% {background-color: black; color: $green;} 

    74% {background-color: black; color: $green;} 
    75% {background-color: $green; color: black;} 

    99% {background-color: $green; color: black;} 
    100% {background-color: black; color: $green;} 
  }

</style>
