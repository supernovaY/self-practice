<template>
  <a class="c lineto-txtlr" @click="F_jumpUrl">
    <div class="input j-flex">
      <div class="img" v-if="article.coverPhoto && article.coverPhoto.indexOf('[') === 0 && JSON.parse(article.coverPhoto).length">
        <van-image :src="JSON.parse(article.coverPhoto)[0]" fit="cover" />
      </div>
      <div class="flex">
        <div class="title">
          {{ article.title || '' }}
        </div>
        <div class="datetext">{{ article.publishTime || '' }}</div>
        <div class="tags">
          <van-tag plain>{{article.supportTypeName}}</van-tag>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    article: {
      default () {
        return {}
      },
      required: true
    }
  },

  computed: {
  },

  methods: {
    // 跳转阅读详情
    F_jumpUrl () {
      this.$router.push('/army/startbusiness/supportdetail/' + this.article.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
  font-size: 12px;
  .van-tag{
    padding: 2px 8px;
  }
}
.flex{
  position: relative;
}
.img{
  width: 88px;
  height: 58px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
  .van-image{
    height: 100%;
    width: 100%;
  }
}
.datetext{
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  color: $--color-menugray;
}
.title{
  font-size: 18px;
}
.datetext{
  color: $--color-menugray;
}
.info{
  position: relative;
  .datetext{
    position: absolute;
    right: 0;
    bottom: 4px;
  }
}

</style>
