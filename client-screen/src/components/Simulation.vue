<template>
	<div id="simulation" v-on:click="simulateShow">
		<h1>Click me to simulate a show</h1>
		<div id="timeline">
			<div v-for="(action, i) in actions" class="action" :style="{left: (i / actions.length * 100) + '%'}">
				<div v-if="action.action != 'doNothing'">
					<div class="rules" :style="{height: action.rules * 8 + 18 + 'px', top: -action.rules * 8 - 18 + 'px'}">
						{{action.rules}}
					</div>
					<div class="message" :style="{height: meaningfulActions.indexOf(action) % 5 * 50 + 50 + 'px'}">
						<span class="text">
							{{ action.action }} {{ formatTime(action.time)}}
						</span>
						<span class="rule-text">
							{{ action.ruleText }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import RuleAI from './RuleAI'

	var data = {
		actions: [],
		meaningfulActions: [],
		ai: null
	}

	function simulateShow() {
		data.actions = [];
		for (let i = 0; i < data.ai.showDuration / 1000; i++) {
			data.ai.step(i * 1000)
		}
		let numRules = 0
		data.actions = data.actions.map((action, i) => {
			if (action.action == 'addRule') {
				numRules++
			}
			if (action.action == 'removeRule') {
				numRules--
			}
			action.time = i * 1000
			action.rules = numRules
			return action
		})
		data.meaningfulActions = data.actions.filter(action => action.action != 'doNothing')
	}

	export default {
		name: 'Simulation',
		props: ['ruleGens', 'names', 'improvisers'],
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
		},
		mounted () {
			data.ai = new RuleAI({
				improvisers: this.improvisers,
				ruleData: this.ruleGens,
				entrancesAndExits: true,
				addRule (rule) {
					data.actions.push({
						action: "addRule",
						ruleText: rule.text
					})
					return Promise.resolve()
				},
				removeRule (rule) {
					data.actions.push({
						action: "removeRule",
						ruleText: rule.text
					})
					return Promise.resolve()
				},
				displayCommand (rule) {
					data.actions.push({
						action: "displayCommand",
						ruleText: rule.text
					})
					return Promise.resolve()
				},
				endShow () {
					data.actions.push({
						action: "endShow",
						ruleText: ''
					})
					return Promise.resolve()
				},
				doNothing () {
					data.actions.push({
						action: "doNothing",
						ruleText: ''
					})
					return Promise.resolve()
				},
				addImprovisers (improvisers) {
					data.actions.push({
						action: "addImprovisers",
						ruleText: improvisers.map(o => o.name).join(', ')
					})
					return Promise.resolve()
				},
				removeImprovisers (improvisers) {
					data.actions.push({
						action: "removeImprovisers",
						ruleText: improvisers.map(o => o.name).join(', ')
					})
					return Promise.resolve()
				}
			})
			simulateShow()
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
	.rule-text {
		font-family: 'Arial';
		font-size: 8px;
	}

</style>