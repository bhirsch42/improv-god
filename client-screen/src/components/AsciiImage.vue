<template>
  <div class="ascii-image" v-bind:class="{loaded: asciiLoaded}">
    <img id='image-del' src='../assets/del.png'></img>
    <img id='image-amy' src='../assets/amy.png'></img>
    <img id='image-charna' src='../assets/charna.png'></img>
    <img id='image-keith' src='../assets/keith.png'></img>
    <img id='image-tj' src='../assets/tj.png'></img>
    <img id='image-ian' src='../assets/ian.png'></img>
    <img id='image-viola' src='../assets/viola.png'></img>
    <pre class="ascii-text">
      {{ text }}
    </pre>
    <div class="loading-cover"></div>
  </div>
</template>

<script>
function print(data) {
  data.asciiLoaded = false;
  let jscii = new Jscii({
    el: document.getElementById(`image-${data.imagename}`),
    fn: function(art) {
      setTimeout(() => {
        data.text = _.replace(art, /&nbsp;/g, ' ');
        data.asciiLoaded = true;
      }, 100)
    }
  });
}

var oldName = ''

export default {
  name: 'ascii-image',
  props: ['imagename'],
  data() {
    return {
      text: '',
      asciiLoaded: false
    }
  },
  mounted() {
    oldName = this.imagename
    print(this)
  },
  updated() {
    if (oldName != this.imagename) {
      print(this)
      oldName = this.imagename
    }
  }
}

</script>

<style lang="scss" scoped>

.ascii-image {
  display: flex;
  overflow: hidden;
  position: relative;
  .ascii-text {
    border: 1px solid #3cff12;
    font-size: 3px;
    letter-spacing: .4em;
  }

  img {
    display: none;
  }

  .loading-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    transform: translateY(0%);
  }

  &.loaded {
    .loading-cover {
      transform: translateY(100%);
      transition: transform 1s linear;
    }
  }
}

</style>