<template>
  <div class="ascii-image" v-bind:class="{loaded: asciiLoaded, 'no-load': noLoad}">
    <img id='image-andy' src='../assets/andy.png'></img>
    <img id='image-bret' src='../assets/bret.png'></img>
    <img id='image-kerri' src='../assets/kerri.png'></img>
    <img id='image-will' src='../assets/will.png'></img>
    <img id='image-austin' src='../assets/austin.png'></img>
    <img id='image-freddy' src='../assets/freddy.png'></img>
    <img id='image-lauren' src='../assets/lauren.png'></img>
    <img id='image-seth' src='../assets/seth.png'></img>
    <img id='image-ben' src='../assets/ben.png'></img>
    <img id='image-jessica' src='../assets/jessica.png'></img>
    <img id='image-mack' src='../assets/mack.png'></img>
    <img id='image-sylvia' src='../assets/sylvia.png'></img>

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
