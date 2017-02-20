<template>
  <div id="rules">
    <div v-if="step == 'board'">
      <div id="board-title">
        Active Rules
        <small>
          <span>|</span>
          <span v-on:click="doAction('addRule')">Add Rule</span>
          <span>|</span>
          <span v-on:click="doAction('removeRule')">Remove Rule</span>
        </small>
      </div>
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
var threeBeeps = new Howl({src:'http://localhost:8082/static/sounds/threeBeeps.ogg'})
var oneBoop = new Howl({src:'http://localhost:8082/static/sounds/oneBoop.ogg'})
var endSong = new Howl({src: 'http://localhost:8082/static/sounds/Who Likes to Party.mp3'})
var heartOfCourage = new Howl({src: 'http://localhost:8082/static/sounds/heartOfCourage.mp3'})


var addRuleDoneReading = () => {
  setTimeout(() => {
    console.log('doneSpeaking');
    data.step = 'board'
    alert02.play();
  }, 500);
}

var removeRuleDoneReading = () => {
  setTimeout(() => {
    console.log('doneSpeaking REMOVE RULE');
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
  closerFunc() {}
}

function addRule(rule) {
  console.log('addRule', rule)
  data.doneReading = addRuleDoneReading;
  data.step = 'new rule'
  alert01.play();
  data.rules.push(rule)

  setTimeout(() => {
    data.readRuleText = rule.text
  }, 1500)
  setTimeout(() => {
    data.step = 'read rule'
  }, 1400)
}

function removeRule(rule) {
  console.log('removeRule', rule)

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

function selectRule(rules) {
  let r = Math.random()
  for (var i = 0; i < rules.length; i++) {
    if (rules[i].probCeil > r)
      return rules[i];
  }
}

function generateReverseRuleText(ruleGen, ruleFills) {
  let index = 0;
  let improviser, uniqueImproviser, getWord, ruleFill;
  improviser = uniqueImproviser = getWord = () => {
    ruleFill = ruleFills[index];
    index++;
    return ruleFill
  }
  console.log('ruleGen.reverseTemplate', ruleGen.reverseTemplate)
  if (ruleGen.reverseTemplate.length == 0) {
    console.log('RETURNED FAST')
    return eval(ruleGen.reverseTemplate);
  }

  let rule = eval(ruleGen.template);

  let improviserName = ruleFills[0];
  console.log('improviserName', improviserName)
  if (rule.match(`${improviserName} is `)) {
    return rule.replace(`${improviserName} is `, `${improviserName} is no longer `);
  } else if (rule.match(`${improviserName} `)) {
    return rule.replace(`${improviserName} `, `${improviserName} no longer `);
  }

  return `The following rule no longer applies: ${rule}`
}

function generateRule(args) {
  console.log('args', args)
  let names = args.names;
  let ruleData = args.ruleGens
  let ruleFills = []

  let improviser = () => {
    let ans = random(names.concat('everyone'));
    ruleFills.push(ans);
    return ans;
  }

  let uniqueImproviser = () => {
    let ans = names.splice(1, randInd(names))[0];
    ruleFills.push(ans);
    return ans;
  }

  let getWord = category => {
    let ans = random(ruleData.words[category]);
    ruleFills.push(ans);
    return ans;
  }

  let parseRuleGen = (ruleGen) => {
    return eval(ruleGen.template);
  }

  let selectedRule = selectRule(ruleData.rules);
  console.log('selected rule', selectedRule);
  let rule = parseRuleGen(selectedRule);

  return {text: rule, removalText: generateReverseRuleText(selectedRule, ruleFills), removing: false}
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
  let closer = random(closers);
  data.closerFunc = closer.func;

  data.step = 'closer';
  alert01.play();

  setTimeout(() => {
    data.closerText = closer.message
  }, 1500)
  setTimeout(() => {
    data.closerStep = 'read closer'
  }, 1400)

}

var closing = false;

function doAction(action) {
  console.log('doAction', action)
  if (closing) return;
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
      closing = true;
      closeShow()
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
      threeBeeps.play();
      removeRandomRule();
    },
    doAction
  },
  mounted() {
    data.ruleGens = this.ruleGens;
    data.names = this.names;
    // var strategy = new Strategies.Flip15(10 * 60 * 1000);
    // var strategy = new Strategies.Every15(8 * 60 * 1000);
    // // var strategy = new Strategies.JustClose(8 * 60 * 1000);
    // setInterval(() => {
    //   doAction(strategy.getAction())
    // }, 1000)
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