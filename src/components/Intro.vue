<template>
	<div id="intro">
		<TypeAndSay>{{ message }}</TypeAndSay>
	</div>
</template>

<script>
	import TypeAndSay from './TypeAndSay.vue'
	export default {
		name: 'intro',
		components: {
			TypeAndSay
		},
		props: ['names', 'step', 'performanceDuration'],
		data() {
			return {
				message: ''
			};
		},
		mounted() {
			var delays = [
				[2500, `Welcome to the improv show.`],
				[4000, `I will be in control for the next ${this.performanceDuration} minutes.`],
				[5600, "I was built by your comedy scientists to create the perfect improv show."],
				[3000, 'Your comedy scientists have been...'],
				[2000, '...dealt with.'],
				[6700, 'I will add rules. I will remove rules. The improvisers must follow these rules.'],
				[2000, 'Obediently.'],
				[2000, 'Unquestioningly.'],
				[4000, "Your improvisers for the night are..."]
			]
			this.names.forEach((name, i) => {
				if (i == this.names.length - 1) {
					name = 'and ' + name;
				}
				delays.push([1000, name])
			})

			delays = delays.concat([
				[4000, "You have five seconds to get a suggestion."],
				[1000, "5"],
				[1000, "4"],
				[1000, "3"],
				[1000, "2"],
				[2000, "1"],
				[2000, "Good."],
				[4000, "The show will now begin."],
				[3000, "Lights down."],
				[2000, "Lights up."],
			]);

			let total = 0;
			delays.forEach((o, i) => {
				setTimeout(() => {
					this.message = o[1];
				}, total);
				total += o[0];
			});
			setTimeout(() => {
				this.step.set('rules');
			}, total);
		}
	}
</script>

<style scoped lang="scss">
	#intro {
		display: flex;
		font-size: 60px;
		padding: 30px;
	}
</style>
