<template>
	<div id="simulation" v-on:click="simulateShow">
		<h1>Click me to simulate a show</h1>
		<div id="timeline">
			<div v-for="(action, i) in actions" class="action" :style="{left: getActionPos(action, actions)}">
				<div class="rules" :style="{height: action.rules * 8 + 18 + 'px', top: -action.rules * 8 - 18 + 'px'}">
					<span class="text">
						{{ action.rules }}
					</span>
				</div>
				<div class="message" :style="{height: i % 5 * 28 + 20 + 'px'}">
					<span class="text">
						{{ action.message }} {{ formatTime(action.time)}}						
					</span>
				</div>
			</div>			
		</div>
	</div>
</template>

<script>
	import Strategies from '../utils/Strategies.js'

	var data = {
		actions: []
	}

	function simulateShow() {
		var strategy = new Strategies.Flip15(120 * 60 * 1000);
		var actions = []
		for (let i = 0; i < strategy.durationOfShow + 2; i++) {
			let action = strategy.getAction(i);
			if (action != 'nothing') {
				actions.push({
					message: action,
					time: i,
					rules: strategy.activeRules
				});
			}
		}
		data.actions = actions;
	}

	export default {
		name: 'Simulation',
		data() {
			return data;
		},
		methods: {
			getActionPos(action, actions) {
				let maxTime = actions[actions.length - 1].time;
				return action.time / maxTime * 100 + '%';
			},
			formatTime(ms) {
				let x = ms / 1000
				let seconds = parseInt(x) % 60
				x /= 60
				let minutes = parseInt(x) % 60
				x /= 60
				let hours = parseInt(x) % 24
				x /= 24
				let days = parseInt(x)
				return `${minutes}:${seconds}`;
			},
			simulateShow
		}
	}
</script>

<style lang="scss" scoped>
	#simulation {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	#timeline {
		width: 85%;
		border-bottom: 5px solid white;
		margin-top: 100px;
		position: relative;
	}

	.action {
		position: absolute;
		border-left: 1px solid white;
	}

	.message, .rules {
		position: relative;
		.text {
			background-color: black;	
			z-index: 9999;
			padding: 5px;	
		}
	}

	.message {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		white-space: nowrap;
		// margin-top: -20px;
	}

	.rules {
		border-left: 1px solid white;
		.text {
			padding-bottom: 0;
		}
	}

</style>