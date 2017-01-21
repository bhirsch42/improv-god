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

	function speak(text) {
		var utterance = new SpeechSynthesisUtterance(text)
		// utterance.voice = _.find(speechSynthesis.getVoices(), {name: 'Google US English'});
		utterance.pitch = .1;
		utterance.rate = .9;
		speechSynthesis.speak(utterance);
	}

	var oldText = ''

	export default {
		name: 'type-and-say',
		components: {
			TypeWriter
		},
	  props: {
	    'timeout': {default: 70},
	    'typingVolume': {default: .1}
	  },
		data() {
			return {};
		},
	  mounted() {
	    let newText = this.$slots.default[0].text;
	    if (oldText != newText) {
	      oldText = newText;
	      speak(this.$slots.default[0].text);
	    }
	  },
	  updated() {
	    let newText = this.$slots.default[0].text;
	    if (oldText != newText) {
	      oldText = newText;
	      speak(this.$slots.default[0].text);
	    }
	  },
	}
</script>