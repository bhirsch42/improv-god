<template>
  <div id="rules" v-on:click="newRule">
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
          <TypeAndSay :timeout="40">
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

var data = {
  rules: [],
  step: 'board',
  newRuleStep: 'new rule',
  newRuleText: ''
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
  setTimeout(() => {
    data.newRuleStep = 'new rule'
    data.step = 'board'
    alert02.play();
  }, 4000)
}

function removeRule() {
  sixBoops.play();
  var rule = random(data.rules);
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

function random(arr) {
  return arr[parseInt(Math.random() * arr.length)];
}

function randInd(arr) {
  return parseInt(Math.random() * arr.length);
}

function generateRule(args) {
  var names = args.names;
  var ruleGens = args.ruleGens.wholeRules

  var improviser = () => {
    return random(names);
  }

  var uniqueImproviser = () => {
    return names.splice(1, randInd(names))[0]
  }

  var parseRuleGen = (ruleGen) => {
    return eval('`' + ruleGen + '`');
  }

  var rule = parseRuleGen(random(ruleGens))

  return {text: rule, removing: false}
}

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
      removeRule();
      break;
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
      removeRule();
    }
  },
  mounted() {
    data.ruleGens = this.ruleGens;
    data.names = this.names;
    var strategy = new Strategies.Flip15(15 * 60 * 1000);
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
    top: 15px;
    left: 0;
    height: 10vh;

    padding-bottom: 5px;
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