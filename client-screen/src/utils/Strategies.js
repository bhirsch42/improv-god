import _ from 'lodash'

module.exports = {
	Flip15: function(durationOfShow) {

		this.durationOfShow = durationOfShow;
		this.timeCreated = Date.now();
		this.activeRules = 0;
		this.timeOfLastRule = 0;
		this.timeOfLastFlip = 0;

		this.getAction = (timeElapsed) => {
			if (!timeElapsed) {
				timeElapsed = Date.now() - this.timeCreated;;
			}
			var timeSinceLastRule = timeElapsed - this.timeOfLastRule;
			var timeSinceLastFlip = timeElapsed - this.timeOfLastFlip;
			var percentComplete = timeElapsed / this.durationOfShow;
			var perComSq = (timeElapsed * timeElapsed) / (this.durationOfShow * this.durationOfShow);
			if (timeElapsed > durationOfShow) {
				return 'end show'
			}
			if (timeElapsed < 90 * 1000) {
				return 'nothing'
			}
			if (timeSinceLastFlip > 15000) {
				this.timeOfLastFlip = timeElapsed

				let removeOdds = (Math.pow(this.activeRules, 3) + 4) * ((1-perComSq) * .8 + .2);
				let addOdds = perComSq * 30 + 4;
				let nothingOdds = Math.max(1 - (timeSinceLastRule / (90 * 1000)), 0) * ((1 - percentComplete) * 100)


				let sum = removeOdds + addOdds + nothingOdds;
				let removeBound = removeOdds / sum;
				let addBound = addOdds / sum + removeBound;

				let r = Math.random()
				if (r < removeBound) {
					if (this.activeRules > 0) {
						this.activeRules--;
						return 'removeRule'
					}
				} else if (r < addBound) {
					this.timeOfLastRule = timeElapsed;
					this.activeRules++;
					return 'addRule'
				}
			}
			return 'nothing';
		}

	},
	Every15: function(durationOfShow) {

		this.durationOfShow = durationOfShow;
		this.timeCreated = Date.now();
		this.activeRules = 0;
		this.timeOfLastRule = 0;
		this.timeOfLastFlip = 0;

		this.getAction = () => {
			var timeElapsed = Date.now() - this.timeCreated;
			var timeSinceLastRule = Date.now() - this.timeOfLastRule;
			var timeSinceLastFlip = Date.now() - this.timeOfLastFlip;
			var percentComplete = timeElapsed / this.durationOfShow
			if (timeSinceLastFlip > 15000) {
				this.timeOfLastFlip = Date.now()
				if (Math.random() < (this.activeRules/(10*percentComplete + 2))) {
					this.activeRules--;
					return 'removeRule'
				}
				else {
					this.timeOfLastRule = Date.now();
					this.activeRules++;
					return 'addRule'
				}
			}
			return 'nothing';
		}

	},
	JustClose: function(durationOfShow) {
		this.getAction = () => {
			return 'end show'
		}
	},
	HandCrafted: function(options) {
    // let showDuration = options.showDuration
    // let addRule      = options.addRule
    // let generateRule = options.generateRule
    // let removeRule   = options.removeRule
    // let ruleGens     = options.ruleGens
    // let improvisers  = options.improvisers

    _.extend(this, options);

    this.activeRules = []
    this.ruleSelectCount = {}

		this.selectRule = (rules) => {
		  let r = Math.random()
		  for (var i = 0; i < rules.length; i++) {
		    if (rules[i].probCeil > r) {
		    	while (this.ruleSelectCount[rules[i].template] >= 1) {
		    		i = (i + 1) % rules.length
		    	}
  	    	this.ruleSelectCount[rules[i].template] = this.ruleSelectCount[rules[i].template] ? this.ruleSelectCount[rules[i].template] + 1 : 1
  	    	console.log(i);
		      return rules[i];		    	
		    }
		  }
		}

    // this.insertRule = (rule) => {
	   //  return compiledRule;
    // }

    this.distribution = (x) => {
    	return x * x
    }

    this.times = [

    ]
    for (let i = 0; i < parseInt(this.showDuration / 1000 / 60) * 2; i++) {
    	this.times.push(this.distribution(i + 1));
    }

    let max = Math.max(...this.times);

    this.times = this.times.map(t => this.showDuration - ((t / max) * (this.showDuration - 90 * 1000)))
    this.times.reverse()


    this.actions = []

    this.times.forEach(time => {
    	let rule = this.selectRule(this.ruleGens.rules);

    	console.log('selectedRule', rule)
    	let compiledRule = this.generateRule({
	    	selectedRule: rule,
	      ruleGens: this.ruleGens,
	      improvisers: this.improvisers
	    })
    	this.activeRules.push(compiledRule);

    	this.actions.push({
    		func: this.addRule,
    		rule: compiledRule,
    		time: time
    	})
    	this.actions.push({
    		func: this.removeRule,
    		rule: compiledRule,
    		time: time + (Math.random() * 90 + 30) * 1000
    	})
    })

    this.actions.sort((a, b) => a.time - b.time);

    console.log('actions', this.actions);

    let rule = this.ruleGens.rules[23]
  	console.log('selectedRule', rule)
  	let compiledRule = this.generateRule({
    	selectedRule: rule,
      ruleGens: this.ruleGens,
      improvisers: this.improvisers
    })
  	this.activeRules.push(compiledRule);
  	this.addRule(rule)

    setTimeout(() => {
    	console.log('remove timeout strategy', rule)
	    this.removeRule(rule);
    }, 10000)


    this.startTime = 0

    this.start = () => {
    	return;
    	this.startTime = Date.now();
    	let actionQueue = [];
	    setInterval(() => {
	    	let elapsedTime = Date.now() - this.startTime;
	    	this.actions.forEach(action => {
	    		if (action.time < elapsedTime) {
	    			actionQueue.push(action)
	    		}
	    	})
	    	this.actions = this.actions.filter(action => actionQueue.indexOf(action) == -1);

	    	let action = actionQueue.shift();
	    	action.func(action.rule);
	    	console.log(action, actionQueue, this.actions)
	    }, 15000)
    }

	}
}