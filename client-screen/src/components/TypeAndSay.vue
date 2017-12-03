<template>
	<div id="type-and-say">
		<TypeWriter :volume="typingVolume" :timeout="timeout">
			<slot></slot>
		</TypeWriter>
	</div>
</template>

<script>
	import TypeWriter from './TypeWriter.vue';
	import _ from 'lodash';
	import { speak } from '../lib/utils'

	var oldText = ''

	var speakNewText = _.debounce((data) => {
    let newText = data.$slots.default[0].text;
    if (oldText != newText) {
      oldText = newText;
      speak(data.$slots.default[0].text)
      	.then(data.doneReading);
    }
	}, 100);

	export default {
		name: 'type-and-say',
		components: {
			TypeWriter
		},
	  props: {
	    'timeout': {default: 70},
	    'typingVolume': {default: .1},
	    'doneReading': {default(){}}
	  },
		data() {
			return {};
		},
	  mounted() {
	  	speakNewText(this);
	  },
	  updated() {
	  	speakNewText(this);
	  },
	}
</script>

<style>
	#type-and-say {
		font-size: 200px;
	}
</style>