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

function RuleAI(args) {
	this.rules = args.rules ? args.rules : []
  this.ruleGenerator = new RuleGenerator({
  	improvisers: args.improvisers,
  	ruleData: args.ruleData,
  	allowRepeats: args.allowRepeatRules ? args.allowRepeatRules : false
  })
  window.ruleGenerator = this.ruleGenerator
  this.addRule = args.addRule ? args.addRule : (rule, cb) => {cb}
  this.removeRule = args.removeRule ? args.removeRule : (rule, cb) => {cb}
  this.displayCommand = args.displayCommand ? args.displayCommand : (rule) => {}
  this.doNothing = args.doNothing ? args.doNothing : () => {}
  this.endShow = args.endShow ? args.endShow : () => {}
  this.showDuration = args.showDuration ? args.showDuration : 15 * 60 * 1000 // default 15 minutes
  this.intervalId = null
  this.timeStarted = 0
	this.activeRules = 0;
	this.timeOfLastRule = 0;
	this.timeOfLastFlip = 0;
}

RuleAI.prototype.start = function() {
	this.timeStarted = Date.now()
	this.intervalId = setInterval(this.step, 1000)
}

RuleAI.prototype.stop = function() { // creates strange behavior if later restarted
	if (this.intervalId) {
		clearInterval(this.intervalId)
	}
}

RuleAI.prototype.AIendShow = function() {
	this.endShow()
	this.stop()
}

RuleAI.prototype.AIdoNothing = function() {
	this.doNothing()
}

RuleAI.prototype.AIaddRule = function(timeElapsed) {
	let rule = ruleGenerator.generateRule()
	rule.timeCreated = timeElapsed
	if (rule.maxDuration.length && rule.maxDuration == '0') {
		this.displayCommand(rule)
		return
	}
	this.timeOfLastRule = timeElapsed
	this.activeRules++
	let cb = () => {
		this.rules.push(rule)
	}
	this.addRule(rule, cb)
}

RuleAI.prototype.AIremoveRule = function(timeElapsed) {
	let rule = null

	let rulesByAge = this.rules.slice().sort(rule=>rule.timeCreated)
	rule = rulesByAge.find(rule => rule.maxDuration.length && timeElapsed - rule.timeCreated >= parseInt(rule.maxDuration))
	rule = rule ? rule : rulesByAge[0]

	this.activeRules--
	let cb = () => {
		this.rules.splice(this.rules.indexOf(rule), 1)
	}
	this.removeRule(rule, cb)
}

RuleAI.prototype.step = function(args) {
	let timeElapsed = typeof args.timeElapsed == 'number' ? args.timeElapsed : Date.now() - this.timeStarted
	let timeSinceLastRule = timeElapsed - this.timeOfLastRule
	let timeSinceLastFlip = timeElapsed - this.timeOfLastFlip
	let percentComplete = timeElapsed / this.showDuration
	let perComSq = (timeElapsed * timeElapsed) / (this.showDuration * this.showDuration)
	if (timeSinceLastFlip < 15000) {
		this.AIdoNothing()
		return
	}
	this.timeOfLastFlip = timeElapsed

	if (timeElapsed > this.showDuration - 30 * 1000) {
		this.AIendShow()
		return
	}

	if (timeElapsed < 90 * 1000) {
		this.AIdoNothing()
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
			this.AIremoveRule(timeElapsed)
			return
		}
	} else if (r < addBound) {
		this.AIaddRule(timeElapsed)
		return
	}
	this.doNothing()
}

export default RuleAI