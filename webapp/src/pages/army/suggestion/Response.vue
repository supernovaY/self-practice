<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="j-m">
            <div class="height-overlay"></div>

            <div class="editor j-common-content j-common-content-padding">
              <div class="title">我的反馈</div>

              <Common-PageDevideHeight />

              <div v-html="suggestion.content || ''"></div>
            </div>

            <Common-PageDevideHeight />

            <div class="editor j-common-content j-common-content-padding">
              <div class="title">回复：</div>

              <Common-PageDevideHeight />

              <div v-html="suggestion.feedback || ''"></div>

              <div
                v-if="!suggestion.feedback"
              >
                <!-- 无数据 -->
                <van-empty class="j-small" description="请耐心等待工作人员回复" />
              </div>
            </div>
          </div>

          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      suggestion: {}
    }
  },

  watch: {
    '$router.params.id' () {
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    // 加载意见反馈信息
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.suggestion.getResponseDetail(
        this.$route.query.id
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.suggestion = data.result
        return
      }

      this.$toast(data.message)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.height-overlay{
  height: 90px;
}

.editor{
  position: relative;
  z-index: 1;

  .title{
    font-size: 18px;
  }
}

.headerbk{
  background: $--color-primary url(../../../assets/img/img_yjfk_top@3x.png) no-repeat left top;
  background-size: contain;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 226px;
}

.container{
  background: #FFF;
  position: relative;
}
</style>
