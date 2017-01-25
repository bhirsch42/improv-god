<template>
  <div id="rules">
    <div v-if="step == 'board'">
      <div id="board-title">
        Active Rules
      </div>
      <div id="board">
        <div v-for="rule in rules">
          <div class="rule" :class="{removing: rule.removing}">
            {{ rule.text }}
          </div>      
        </div>
      </div>
    </div>
    <div v-if="step == 'new rule'">
      <div id="new-rule" :class="{'flash-text': newRuleStep == 'new rule'}">
        <div v-if="newRuleStep == 'new rule'">
          <div class="flash-text">
            NEW RULE
          </div>
        </div>
        <div v-if="newRuleStep == 'read rule'">
          <TypeAndSay :timeout="40" :doneReading="doneReading">
            {{ newRuleText }}
          </TypeAndSay>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import TypeAndSay from './TypeAndSay.vue'
import Strategies from '../utils/Strategies.js'

require('Howler')
var alert01 = new Howl({src:'http://localhost:8082/static/sounds/alert01.ogg'})
var alert02 = new Howl({src:'http://localhost:8082/static/sounds/alert02.ogg'})
var sixBoops = new Howl({src:'http://localhost:8082/static/sounds/sixBoops.ogg'})
var endSong = new Howl({src: 'http://localhost:8082/static/sounds/Who Likes to Party.mp3'})

var data = {
  rules: [],
  step: 'board',
  newRuleStep: 'new rule',
  newRuleText: '',
  doneReading() {
    setTimeout(() => {
      console.log('doneSpeaking');
      data.newRuleStep = 'new rule'
      data.step = 'board'
      alert02.play();
    }, 500);
  }
}

function addRule(rule) {
  data.step = 'new rule'
  alert01.play();
  data.rules.push(rule)

  setTimeout(() => {
    data.newRuleText = rule.text
  }, 1500)
  setTimeout(() => {
    data.newRuleStep = 'read rule'
  }, 1400)
}

function removeRule(rule) {
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
    data.rules.splice(data.rules.indexOf(rule), 1);
  }, 3100)
}

function removeRandomRule() {
  removeRule(random(data.rules));
}

function random(arr) {
  return arr[parseInt(Math.random() * arr.length)];
}

function randInd(arr) {
  return parseInt(Math.random() * arr.length);
}

function generateRule(args) {
  var names = args.names;
  var ruleData = args.ruleGens

  var improviser = () => {
    return random(names);
  }

  var uniqueImproviser = () => {
    return names.splice(1, randInd(names))[0]
  }

  var getWord = category => {
    return random(ruleData.wordLists[category]);
  }

  var parseRuleGen = (ruleGen) => {
    return eval('`' + ruleGen + '`');
  }
  console.log(ruleData);
  var rule;

  if (Math.random() < .3) {
    rule = parseRuleGen(random(ruleData.wholeRules));
  } else {
    rule = parseRuleGen(random(ruleData.listRules));
  }

  return {text: rule, removing: false}
}

var showOver = false;

function doAction(action) {
  console.log('doAction', action)
  switch (action) {
    case 'default':
      break;
    case 'addRule':
      addRule(generateRule({
        ruleGens: data.ruleGens,
        names: data.names
      }))
      break;
    case 'removeRule':
      removeRandomRule();
      break;
    case 'end show':
      if (showOver) return;
      showOver = true;
      endSong.play();
  }
}

export default {
  name: 'rules',
  props: ['ruleGens', 'names'],
  data() {
    return data
  },
  components: {
    TypeAndSay
  },
  methods: {
    newRule() {
      sixBoops.play();
      removeRandomRule();
    }
  },
  mounted() {
    data.ruleGens = this.ruleGens;
    data.names = this.names;
    var strategy = new Strategies.Flip15(8 * 60 * 1000);
    setInterval(() => {
      doAction(strategy.getAction())
    }, 1000)
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
  }

  #board-title {
    position: absolute;
    top: 30px;
    left: 0;
    height: 8vh;

    padding-bottom: 0px;
    margin-left: 30px;
    border-bottom: 10px solid $green;
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