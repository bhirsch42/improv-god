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
					if (this.activeRules > 1) {
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
	}
}
