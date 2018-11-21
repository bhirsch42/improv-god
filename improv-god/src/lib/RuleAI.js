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
    entrancesAndExits,
    addImprovisers,
    removeImprovisers
  }) {

  this.entrancesAndExits = entrancesAndExits;
  this.improvisers = this.entrancesAndExits ? [] : improvisers;
  this.improviserPool = this.entrancesAndExits ? improvisers : false;

  this.ruleGenerator = new RuleGenerator({
    improvisers    : this.improvisers,
    improviserPool : this.improviserPool,
    ruleData       : ruleData,
    allowRepeats   : allowRepeatRules || false
  })

  window.ruleGenerator = this.ruleGenerator

  let resolve = () => Promise.resolve()

  this.addRuleToView             = addRule           || resolve
  this.removeRuleFromView        = removeRule        || resolve
  this.doNothingInView           = doNothing         || resolve
  this.endShowInView             = endShow           || resolve
  this.addImproviserstoView      = addImprovisers    || resolve
  this.removeImprovisersFromView = removeImprovisers || resolve
  this.displayCommandInView      = displayCommand    || resolve
  this.showDuration              = showDuration      || 9 * 60 * 1000 // default 9 minutes
  this.rules                     = rules             || []
  this.intervalId                = null
  this.timeStarted               = 0
  this.timeOfLastRule            = 0;
  this.timeOfLastFlip            = 0;
  this.lastAddedImprovisers = 0;
  this.showEnded = false;


  this.reweightRules(0)
}

RuleAI.prototype.activeRuleCount = function() {
  return this.rules.length
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

RuleAI.prototype.addImprovisers = function(addCount, elapsedTime) {
  this.lastAddedImprovisers = elapsedTime
  let improvisers = this.ruleGenerator.addImprovisers(addCount);
  this.addImproviserstoView(improvisers)
}

RuleAI.prototype.removeImprovisers = function(removeCount) {
  let improvisers = this.ruleGenerator.removeImprovisers(removeCount);

  // Remove rules involving improvisers that are exiting

  this.removeImprovisersFromView(improvisers).then(() => {
    this.rules.filter(rule => _.intersection(improvisers.map(improviser => improviser.name), rule.improvisers).length > 0).forEach(rule => {
      this.rules.splice(this.rules.indexOf(rule), 1)
    })
  })
}

RuleAI.prototype.addRule = function(timeElapsed, ruleIndex) {
  this.reweightRules(timeElapsed)
  let rule = ruleGenerator.generateRule(ruleIndex)
  rule.timeCreated = timeElapsed

  if (rule.maxDuration.length && rule.maxDuration == '0') {
    this.displayCommandInView(rule)
  } else {
    this.timeOfLastRule = timeElapsed
    this.addRuleToView(rule)
    this.rules.push(rule)
  }
}

RuleAI.prototype.removeRule = function(timeElapsed) {
  let rule = null

  let rulesByAge = this.rules.slice().sort((rule1, rule2) => rule1.timeCreated - rule2.timeCreated)
  rule = rulesByAge.find(rule => rule.maxDuration.length && timeElapsed - rule.timeCreated >= parseInt(rule.maxDuration) * 1000)
  rule = rule ? rule : rulesByAge[0]

  this.removeRuleFromView(rule).then(() => {
    this.rules.splice(this.rules.indexOf(rule), 1)
  })
}

RuleAI.prototype.step = function(timeElapsed) {
  timeElapsed = typeof timeElapsed === 'number' ? timeElapsed : Date.now() - this.timeStarted
  let timeSinceLastRule = timeElapsed - this.timeOfLastRule
  let timeSinceLastFlip = timeElapsed - this.timeOfLastFlip
  let percentComplete = timeElapsed / this.showDuration
  let percentCompleteSquared = (timeElapsed * timeElapsed) / (this.showDuration * this.showDuration)

  if (timeSinceLastFlip < 10000) {
    this.doNothing()
    return
  }

  this.timeOfLastFlip = timeElapsed

  if (timeElapsed > this.showDuration - 30 * 1000) {
    if (!this.showEnded) {
      this.endShow()
      this.showEnded = true
    }

    return
  }

  let removeOdds = (Math.pow(this.activeRuleCount(), 3) + 4) * ((1 - percentCompleteSquared) * .8 + .2)
  let addOdds = percentComplete * 30 + 4
  let nothingOdds = Math.max(1 - (timeSinceLastRule / (90 * 1000)), 0) * ((1 - percentComplete) * 400)
  let addImproviserOdds = percentCompleteSquared * 20 + 4
  let percentOnstage = this.ruleGenerator.getImprovisers().length / this.improviserPool.length
  let removeImproviserOdds = (percentOnstage * .5) * 50
  let offstageImproviserCount = this.improviserPool.length - this.ruleGenerator.getImprovisers().length

  let sum = removeOdds + addOdds + nothingOdds + addImproviserOdds + removeImproviserOdds
  let removeBound = removeOdds / sum
  let addBound = addOdds / sum + removeBound
  let addImproviserBound = addImproviserOdds / sum + addBound
  let removeImproviserBound = removeImproviserOdds / sum + addImproviserBound


  let r = Math.random()
  if (this.ruleGenerator.getImprovisers().length < 2) {
    this.addImprovisers(2)
  } else if (timeElapsed - this.lastAddedImprovisers > 40000 && offstageImproviserCount > 0) {
    let count = Math.min(1 + parseInt(Math.random() * (.8 * percentComplete + .2) * (this.improviserPool.length - this.ruleGenerator.getImprovisers().length)), offstageImproviserCount)
    this.addImprovisers(count, timeElapsed)
  } else if (r < removeBound) {
    if (this.activeRuleCount() > 0) {
      this.removeRule(timeElapsed)
    }
  } else if (r < addBound) {
    this.addRule(timeElapsed)
  } else if (r < addImproviserBound) {
    let count = Math.min(1 + parseInt(Math.random() * (.8 * percentComplete + .2) * (this.improviserPool.length - this.ruleGenerator.getImprovisers().length)), offstageImproviserCount)
    this.addImprovisers(count, timeElapsed)
  } else if (r < removeImproviserBound) {
    let count = 1 + parseInt(Math.random() * this.ruleGenerator.getImprovisers().length)
    this.removeImprovisers(count, timeElapsed)
  } else {
    this.doNothing()
  }
}

export default RuleAI
