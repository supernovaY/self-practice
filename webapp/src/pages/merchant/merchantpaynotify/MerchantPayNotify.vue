<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="j-m">
            <div class="height-overlay"></div>

            <div class="editor j-common-content j-common-content-padding">
              <Common-PageDevideHeight />

              <div class="title">
                <span class="j-fc-blue fas fa-check-circle"></span> 收款成功
              </div>

               <Common-PageDevideHeight />

               <div class="title-paymoney">
                 <span class="fas fa-yen-sign"></span> <span class="number">{{ orderinfo.realAmount || '' }}</span>
               </div>
               <Common-PageDevideHeight />
            </div>

            <Common-PageDevideHeight />

            <div class="editor j-common-content j-common-content-padding">
              <div class="form-group">
                <div class="c lineto-txtlr noborder">
                  <div class="input j-flex j-flex-center">
                    <div class="label-msg">
                      消费金额
                    </div>

                    <div class="flex right-txt">
                      {{ orderinfo.totalAmount || '' }}元
                    </div>
                  </div>
                </div>

                <div class="c lineto-txtlr noborder">
                  <div class="input j-flex j-flex-center">
                    <div class="label-msg">
                      折扣金额
                    </div>

                    <div class="flex right-txt">
                      {{ data.discountdetail.amount || '0' }}元
                    </div>
                  </div>
                </div>

                <div class="c lineto-txtlr noborder">
                  <div class="input j-flex j-flex-center">
                    <div class="label-msg">
                      优惠券金额
                    </div>

                    <div class="flex right-txt">
                      {{ data.coupondiscount.amount || '0' }}元
                    </div>
                  </div>
                </div>

                <div class="c lineto-txtlr noborder">
                  <div class="input j-flex j-flex-center">
                    <div class="label-msg">
                      优惠金额
                    </div>

                    <div class="flex right-txt">
                      {{ orderinfo.discountsTotalAmount || '0' }}元
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="j-m">
            <Common-PageDevideHeight />
            <van-button type="info" size="large" @click="$router.back()">
              确定
            </van-button>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
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
      // 订单信息
      orderinfo: {},

      // 数据存放
      data: {
        // 折扣情况
        discountdetail: {},

        // 优惠券优先
        coupondiscount: {}
      }
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
    // 加载订单信息
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.getOrderDetail(
        this.$route.params.id
      )

      this.$Common.showLoading(false)

      // console.log('订单详情', data)

      if (data.code === 2000) {
        this.orderinfo = data.result

        // 折扣数据提取 discountType = 0 为优惠券抵扣 1为折扣
        this.orderinfo.discounts.map((item) => {
          if (item.discountType === 0) {
            this.data.coupondiscount = item
          }

          if (item.discountType === 1) {
            this.data.discountdetail = item
          }
        })
        return
      }

      this.$toast('收款结果查询失败')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.title{
  text-align: center;
  font-size: 24px;
}

.title-paymoney{
  text-align: center;
  font-size: 18px;

  .number{
    font-size: 26px;
  }
}

.height-overlay{
  height: 70px;
}

.editor{
  position: relative;
  z-index: 1;
}

.headerbk{
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat left top;
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
