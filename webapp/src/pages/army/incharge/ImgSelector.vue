<template>
  <div>
    <label class="uploadinfo">
      <div class="iconshow j-flex j-flex-center">
        <div class="flex">
          <span class="iconcamera"></span>
        </div>
      </div>

      <div
        class="imgfilepreview"
        :style="imgStyle"
      ></div>

      <slot></slot>
      <input type="file" accept="image/*" @change="F_selectFile" />
    </label>

    <div class="titlename">{{ titlename }}</div>
  </div>
</template>

<script>
export default {
  props: {
    titlename: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      // 图片文件预览数据
      imgbase64: ''
    }
  },

  computed: {
    // 选择后的图片预览样式数据
    imgStyle () {
      return this.imgbase64 ? 'background-image: url(' + this.imgbase64 + ');' : ''
    }
  },

  methods: {
    // 选择文件 图片预览+压缩处理
    F_selectFile (evt) {
      // console.log(evt)

      const files = evt.target.files

      if (files.length > 0) {
        this.$Common.kCompass({
          fileinput: files[0]
        }).then((result) => {
          // console.log(result)
          this.imgbase64 = result.result

          // 图片选择事件回调
          this.$emit('selectimg')
        }).catch(() => {
          // this.imgbase64 = ''

          // // 图片选择事件回调
          // this.$emit('selectimg')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.titlename{
  text-align: center;
}

.uploadinfo {
  display: block;
  position: relative;

  input {
    display: none;
  }

  img {
    width: 100%;
    display: block;
  }

  .iconshow{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    z-index: 1;

    .iconcamera{
      display: inline-block;
      background: url(../../../assets/img/ic_fjtj@3x.png) no-repeat center center;
      background-size: contain;
      width: 38px;
      height: 38px;
    }
  }

  .imgfilepreview{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
}
</style>
