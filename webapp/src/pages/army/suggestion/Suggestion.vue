<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="j-m">
            <div class="height-overlay"></div>

            <div class="editor">
              <van-field
                v-model="content"
                rows="10"
                autosize
                type="textarea"
                maxlength="200"
                placeholder="请填写意见反馈（最多可输入200字）"
                show-word-limit
              />
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
            <Common-PageDevideHeight />
            <van-button round type="info" size="large" @click="F_submitData">
              提交
            </van-button>
            <Common-PageDevideHeight />
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
      content: ''
    }
  },

  mounted () {

  },

  methods: {
    // 提交意见反馈
    async F_submitData () {
      if (!this.content) {
        this.$toast('请输入反馈内容')
        return
      }

      const finalContent = this.$Common.strTrim(this.content)

      if (finalContent === '') {
        this.$toast('请输入有效反馈内容')
        return
      }

      this.$Common.showLoading(true)

      const data = await this.$Api.suggestion.add(finalContent)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.$toast('反馈提交成功，请后续关注消息中心回复内容')
        this.$router.back()
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
  height: 50px;
}

.editor{
  position: relative;
  z-index: 1;
  background: #FFF;
  box-shadow: 0 2px 8px 0 rgba(180,193,203,0.50);
  border-radius: 4px;
  overflow: hidden;
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
