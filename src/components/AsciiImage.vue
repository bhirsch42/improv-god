<template>
  <div class="ascii-image" v-bind:class="{loaded: asciiLoaded, 'no-load': noLoad}">
    <img id='image-del' src='../assets/img/del.png'></img>
    <img id='image-amy' src='../assets/img/amy.png'></img>
    <img id='image-charna' src='../assets/img/charna.png'></img>
    <img id='image-keith' src='../assets/img/keith.png'></img>
    <img id='image-tj' src='../assets/img/tj.png'></img>
    <img id='image-ian' src='../assets/img/ian.png'></img>
    <img id='image-viola' src='../assets/img/viola.png'></img>

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
    width: data.width,
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
  props: ['imagename', 'noLoad', 'width'],
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
  watch: {
    imagename () {
      if (oldName != this.imagename) {
        print(this)
        oldName = this.imagename
      }
    }
  }
}

</script>

<style lang="scss" scoped>

.ascii-image {
  overflow: hidden;
  position: relative;
  display: inline-block;
  border: 1px solid #3cff12;

  .ascii-text {
    font-size: 3px;
    letter-spacing: .4em;
    margin: -5px 0 -5px 0;
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

  &.no-load {
    .loading-cover {
      display: none;
    }
  }
}

</style>
