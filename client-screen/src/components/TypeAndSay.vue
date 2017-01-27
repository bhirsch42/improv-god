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

	function speak(text, doneReading) {
		var utterance = new SpeechSynthesisUtterance(text)
		if (doneReading) {
			utterance.onend = doneReading;
		}
		// utterance.voice = _.find(speechSynthesis.getVoices(), {name: 'Google US English'});
		utterance.pitch = .1;
		utterance.rate = .9;
		speechSynthesis.speak(utterance);
	}

	var oldText = ''

	var speakNewText = _.debounce((data) => {
    let newText = data.$slots.default[0].text;
    if (oldText != newText) {
      oldText = newText;
      speak(data.$slots.default[0].text, data.doneReading);
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