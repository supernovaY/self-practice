<template>
  <div>
    <div class="containerbox">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in 4" :key="item">
          <div class="certitem">
            <div class="text j-flex j-flex-center">
              <div>残疾军人证</div>
            </div>
            <img src="@/assets/img/img_banner@3x.png" />
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.containerbox {
  margin: 0;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;

  .certitem {
    position: relative;

    .text {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      color: #fff;
      font-size: 22px;
      margin: 0;
      padding: 16px;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
