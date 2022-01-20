<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="container">
          <div class="j-m article">
            <Common-PageDevideHeight />

            <div
              class="content"
              v-html="data.merchantinfo.detail"
            ></div>

            <Common-PageDevideHeight />
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      data: {
        // 商家信息
        merchantinfo: {}
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  mounted () {
    this.F_loadMerchantInfo()
  },

  methods: {
    // 获取信息
    async F_loadMerchantInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.service.getServiceInfo(this.merchantInfo.id)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.data.merchantinfo = data.result
        return
      }

      this.$toast('信息加载失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.article{
  line-height: 1.6;

  .content{
    font-size: 14px;
  }
}
</style>

<style scoped>
.content >>> img{
  max-width: 100%;
}

.content >>> table{
  width: 100%;
  border-collapse:collapse;
}

.content >>> table td,
.content >>> table tr{
  border: 1px solid #ebedf0;
}
</style>
