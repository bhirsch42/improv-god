<template>
  <div id="rules">
    <div v-if="step == 'board'">
      <div id="board-title">
        Rules
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
    <div v-if="step == 'improvisers'" id="add-improviser">
      <div v-for="improviser in improvisers">
        <div class="ascii-image-wrapper" :class='{onstage: onstageImprovisers.indexOf(improviser) !== -1}'>
          <AsciiImage :imagename='improviser.name.toLowerCase()' :noLoad='true' :width='80'></AsciiImage>
          <div class="image-name">
            {{ improviser.name }}
          </div>
        </div>
      </div>
      <div class="improviser-sentence">
        {{ improviserSentence }}
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
        <div v-if="closerStep == 'playing out'" class="big-message">
          &lt;playing you out&gt;
        </div>
        <div v-if="closerStep == 'lights down'" class="big-message">
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
import _ from 'lodash'
import RuleAI from '../lib/RuleAI'
import AsciiImage from './AsciiImage.vue'
import { speak } from '../lib/utils'
import { Howl } from 'howler'

var alert01 = new Howl({ src: require('../assets/sounds/alert01.ogg') })
var alert02 = new Howl({ src: require('../assets/sounds/alert02.ogg') })
var threeBeeps = new Howl({ src: require('../assets/sounds/threeBeeps.ogg') })
var oneBoop = new Howl({ src: require('../assets/sounds/oneBoop.ogg') })
var endSong = new Howl({ src: require('../assets/sounds/Who Likes to Party.mp3') })
var heartOfCourage = new Howl({ src: require('../assets/sounds/heartOfCourage.mp3') })
var sixBoops = new Howl({ src: require('../assets/sounds/sixBoops.ogg') })
var closerMusic = new Howl({ src: require('../assets/sounds/closerMusic.ogg') })

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
  adMessage: 'like us on facebook.com/improvgod',
  onstageImprovisers: [],
  improviserSentence: ''
}

function addImprovisers(enteringImprovisers) {
  if (enteringImprovisers.length === 0) {
    return
  }

  data.doneReading = addRuleDoneReading;
  data.step = 'improvisers'
  alert02.play();

  let names = enteringImprovisers.map(improviser => improviser.name)
  let sentence = ""

  if (names.length === 1) {
    sentence = `${names[0]} enters.`
  } else if (names.length === 2) {
    sentence = `${names[0]} and ${names[1]} enter.`
  } else {
    sentence = `${names.slice(0, names.length - 1).join(', ')} and ${names[names.length - 1]} enter.`
  }

  data.improviserSentence = sentence;

  setTimeout(() => {
    speak(sentence).then(() => {
      setTimeout(() => {
        alert02.play();
        data.step = 'board'
      }, 400)
    })
  }, 700)

  data.onstageImprovisers.push(...enteringImprovisers)

  return Promise.resolve(enteringImprovisers)
}

function removeImprovisers(exitingImprovisers) {
  if (exitingImprovisers.length === 0) {
    return
  }

  data.doneReading = addRuleDoneReading;
  data.step = 'improvisers'
  alert02.play();

  let names = exitingImprovisers.map(improviser => improviser.name)
  let sentence = ""

  if (names.length === 1) {
    sentence = `${names[0]} exits.`
  } else if (names.length === 2) {
    sentence = `${names[0]} and ${names[1]} exit.`
  } else {
    sentence = `${names.slice(0, names.length - 1).join(', ')} and ${names[names.length - 1]} exit.`
  }

  data.improviserSentence = sentence;

  setTimeout(() => {
    speak(sentence).then(() => {
      setTimeout(() => {
        alert02.play();
        data.step = 'board'
      }, 400)
    })
  }, 700)

  data.onstageImprovisers = _.without(data.onstageImprovisers, ...exitingImprovisers)

  return Promise.resolve(exitingImprovisers)
}

function addRule(rule) {
  data.doneReading = addRuleDoneReading;
  data.step = 'new rule'
  alert01.play();

  setTimeout(() => {
    data.readRuleText = rule.text
  }, 1500)

  setTimeout(() => {
    data.step = 'read rule'
  }, 1400)

  return Promise.resolve()
}

function removeRule(rule) {
  data.doneReading = removeRuleDoneReading;
  data.step = 'remove rule'
  threeBeeps.play();

  setTimeout(() => {
    data.readRuleText = rule.removalText
  }, 1100)

  setTimeout(() => {
    data.step = 'read rule'
  }, 1000)

  return new Promise(resolve => setTimeout(resolve, 3100))
}

function quickRemoveRule(rule) {
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

  return new Promise(resolve => setTimeout(resolve, 3100))
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
      data.closerStep = ''
    }, 25000)
    setTimeout(() => {
      endSong.play()
      data.closerStep = 'advertise'
      setInterval(() => {
        data.adMessage = data.adMessage + ' like us on facebook.com/improvgod'
      }, 510)
    }, 35000)
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
  props: ['ruleGens', 'improvisers', 'performanceDuration'],
  data() {
    return data
  },
  components: {
    TypeAndSay,
    AsciiImage
  },
  mounted() {
    let ruleAI = new RuleAI({
      addRule: addRule,
      displayCommand: displayCommand,
      endShow: closeShow,
      improvisers: this.improvisers,
      removeRule: quickRemoveRule,
      ruleData: this.ruleGens,
      rules: data.rules,
      addImprovisers: addImprovisers,
      removeImprovisers: removeImprovisers,
      showDuration: this.performanceDuration * 60 * 1000,
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

  .big-message {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10vh;
  }

  #rules {
    font-size: 60px;
    padding: 30px;
    position: relative;
    top: 50px;
  }

  #board-title {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    font-size: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: .2;
  }

  #board {
    position: fixed;
    top: 0;
    width: 100vw;
    left: 0;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
  }

  .rule {
    border: 10px solid $green;
    padding: 15px;
    margin-top: 30px;
    margin-left: 30px;
    font-size: 80px;
    background-color: black;
  }

  .removing {
    color: black;
    background-color: $green;
  }

  #new-rule {
    font-size: 120px;
  }

  #remove-improviser, #add-improviser {
    position: relative;
    top: -75px;
    display: flex;
    flex-wrap: wrap;
    color: red;

    .ascii-image {
      margin-right: 15px;
      margin-bottom: -15px;
      margin-top: 30px;
      border: 1px solid red;
    }

    .onstage {
      color: #3cff12;
      .ascii-image {
        border: 1px solid #3cff12;
      }
    }
  }

  .flash-text {
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    position: fixed;
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

  .improviser-sentence {
    margin-top: 50px;
    font-size: 100px;
    color: $green;
    position: absolute;
    bottom: -200px;
  }

</style>
