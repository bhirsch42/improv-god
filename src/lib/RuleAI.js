/*
args:

rules
improvisers
ruleGens
addRule
removeRule
endShow

data.rules.splice(data.rules.indexOf(rule), 1)
*/

import RuleGenerator from './RuleGenerator'

function RuleAI({
    rules,
    improvisers,
    ruleData,
    allowRepeatRules,
    addRule,
    removeRule,
    doNothing,
    endShow,
    displayCommand,
    showDuration,
    lateGameTime
  }) {

  this.rules = rules || []

  this.ruleGenerator = new RuleGenerator({
    improvisers  : improvisers,
    ruleData     : ruleData,
    allowRepeats : allowRepeatRules || false
  })

  window.ruleGenerator = this.ruleGenerator

  let resolve = () => Promise.resolve()

  this.addRuleToView        = addRule        || resolve
  this.removeRuleFromView   = removeRule     || resolve
  this.doNothingInView      = doNothing      || resolve
  this.endShowInView        = endShow        || resolve

  this.displayCommandInView = displayCommand || resolve
  this.showDuration         = showDuration   || 20 * 60 * 1000 // default 20 minutes
  this.lateGameTime         = lateGameTime   || this.showDuration * .6

  console.log("Show Duration: " + this.showDuration)

  this.intervalId     = null
  this.timeStarted    = 0
  this.activeRules    = 0;
  this.timeOfLastRule = 0;
  this.timeOfLastFlip = 0;

  this.reweightRules(0)
}

RuleAI.prototype.start = function() {
  this.timeStarted = Date.now()
  this.intervalId = setInterval(() => {this.step()}, 1000)
}

RuleAI.prototype.stop = function() { // creates strange behavior if later restarted
  if (this.intervalId) {
    clearInterval(this.intervalId)
  }
}

RuleAI.prototype.reweightRules = function(timeElapsed) {
  let rules = this.rules
  let showRatio = timeElapsed / this.showDuration
  let totalWeight = 0
  rules.forEach(rule => {
    let weight = rule.lateGame ? ((showRatio * 2) * (showRatio * 2)) : 1
    totalWeight += weight
    rule.probCeil = totalWeight
  })
  rules.forEach(rule => {
    rule.probCeil /= totalWeight
  })
}

RuleAI.prototype.endShow = function() {
  this.endShowInView()
  this.stop()
}

RuleAI.prototype.doNothing = function() {
  this.doNothingInView()
}

RuleAI.prototype.addRule = function(timeElapsed, ruleIndex) {
  this.reweightRules(timeElapsed)
  let rule = ruleGenerator.generateRule(ruleIndex)
  rule.timeCreated = timeElapsed

  if (rule.maxDuration.length && rule.maxDuration == '0') {
    this.displayCommandInView(rule)
  } else {
    this.timeOfLastRule = timeElapsed
    this.activeRules++

    this.addRuleToView(rule)
      .then(() => this.rules.push(rule))
  }
}

RuleAI.prototype.removeRule = function(timeElapsed) {
  let rule = null

  let rulesByAge = this.rules.slice().sort((rule1, rule2) => rule1.timeCreated - rule2.timeCreated)
  rule = rulesByAge.find(rule => rule.maxDuration.length && timeElapsed - rule.timeCreated >= parseInt(rule.maxDuration) * 1000)
  console.log(rule)
  rule = rule ? rule : rulesByAge[0]

  this.activeRules--

  this.removeRuleFromView(rule)
    .then(() => this.rules.splice(this.rules.indexOf(rule), 1))
}

RuleAI.prototype.step = function(args) {
  args = args ? args : {}
  let timeElapsed = typeof args.timeElapsed == 'number' ? args.timeElapsed : Date.now() - this.timeStarted
  let timeSinceLastRule = timeElapsed - this.timeOfLastRule
  let timeSinceLastFlip = timeElapsed - this.timeOfLastFlip
  let percentComplete = timeElapsed / this.showDuration
  let perComSq = (timeElapsed * timeElapsed) / (this.showDuration * this.showDuration)
  if (timeSinceLastFlip < 15000) {
    this.doNothing()
    return
  }
  this.timeOfLastFlip = timeElapsed

  if (timeElapsed > this.showDuration - 30 * 1000) {
    this.endShow()
    return
  }

  if (timeElapsed < 90 * 1000) {
    this.doNothing()
    return
  }

  let removeOdds = (Math.pow(this.activeRules, 3) + 4) * ((1-perComSq) * .8 + .2)
  let addOdds = perComSq * 30 + 4
  let nothingOdds = Math.max(1 - (timeSinceLastRule / (90 * 1000)), 0) * ((1 - percentComplete) * 100)


  let sum = removeOdds + addOdds + nothingOdds
  let removeBound = removeOdds / sum
  let addBound = addOdds / sum + removeBound

  let r = Math.random()
  if (r < removeBound) {
    if (this.activeRules > 0) {
      this.removeRule(timeElapsed)
      return
    }
  } else if (r < addBound) {
    this.addRule(timeElapsed)
    return
  }
  this.doNothing()
}

export default RuleAI
