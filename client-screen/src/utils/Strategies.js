module.exports = {
	Flip15: function(durationOfShow) {

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
			if (timeElapsed > durationOfShow) {
				return 'end show'
			}
			if (timeElapsed < 90 * 1000) {
				return 'nothing'
			}
			if (timeSinceLastFlip > 15000) {
				this.timeOfLastFlip = Date.now()
				if (Math.random() < (this.activeRules/(10*percentComplete + 2))) {
					this.activeRules--;
					return 'removeRule'
				}
				else if (Math.random() * percentComplete < .5) {
					this.timeOfLastRule = Date.now();
					this.activeRules++;
					return 'addRule'
				}
				else {
					return 'nothing'
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