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
		props: ['names', 'step'],
		data() {
			return {
				message: ''
			};
		},
		mounted() {
			var delays = [
				[6400, "Welcome to the improv show. I will be in control for the next 25 minutes."],
				[5600, "I will declare rules. The improvisers must follow these rules."],
				[2800, "Obediently."],
				[3000, "Unquestioningly."],
				[4000, "Please welcome your improvisers to the stage."]
			]
			this.names.forEach((name, i) => {
				if (i == this.names.length - 1) {
					name = 'and ' + name;
				}
				delays.push([2000, name])
			})

			delays = delays.concat([
				[4000, "You have fifteen seconds to get a suggestion."],
				[1000, "15"],
				[1000, "14"],
				[1000, "13"],
				[1000, "12"],
				[1000, "11"],
				[1000, "10"],
				[1000, "9"],
				[1000, "8"],
				[1000, "7"],
				[1000, "6"],
				[1000, "5"],
				[1000, "4"],
				[1000, "3"],
				[1000, "2"],
				[2000, "1"],
				[2000, "Good."],
				[4000, "The show will now begin."],
				[4000, "Lights down."],
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