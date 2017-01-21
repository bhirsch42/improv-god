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
			if (timeSinceLastFlip > 15000) {
				this.timeOfLastFlip = Date.now()
				if (Math.random() < (1/8) * this.activeRules) {
					this.activeRules--;
					return 'removeRule'
				}
				else if (Math.random() > .5) {
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

	}
}