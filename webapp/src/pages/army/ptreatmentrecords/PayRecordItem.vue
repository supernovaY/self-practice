<template>
  <div class="c lineto-txt">
    <div
      :class="showrighticon ? 'input addon j-flex j-flex-center' : 'input j-flex j-flex-center'"
      @click="F_toDetail">
      <div class="flex">
        <div class="title">
          <div class="j-flex j-flex-center">
            <div class="flex">
              <span class="fas fa-store j-fc-gray"></span> <span class="ft-bold">{{ service.name || '' }}</span>
            </div>

            <div>
              <div
                class="j-fc-gray"
                v-if="service.payStatus === 0"
              >未支付</div>

              <div
                class="j-fc-blue"
                v-if="service.payStatus === 1"
              >支付中</div>

              <div
                class="j-fc-red"
                v-if="service.payStatus === 4"
              >已退款</div>

              <div
                class="j-fc-blue"
                v-if="service.payStatus === 2"
              >已支付</div>

              <div
                class="j-fc-gray"
                v-if="service.payStatus === 5"
              >交易关闭</div>
            </div>
          </div>
        </div>

        <div class="divideheight-8"></div>

        <div class="j-flex">
          <div
            class="imgcover"
            :style="{'background-image': 'url(' + service.icon + ')'}">
          </div>

          <div class="flex">
            <div class="payinfo">
              <div class="j-fc-gray">
                <span v-if="service.payStatus === 0" class="j-fc-red van-count-down">
                  订单即将在<van-count-down class="j-fc-red" :time="waitpaytimecounter" format="mm分ss秒" />后超时
                </span>

                <span class="fz-12">
                  <span v-if="service.payStatus === 2">
                    支付时间：{{ service.payTime }}
                  </span>

                  <span v-if="service.payStatus === 4">
                    退款时间：{{ service.refundTime }}
                  </span>

                  <span v-if="service.payStatus === 5">
                    交易关闭时间：{{ service.updateTime }}
                  </span>
                </span>
              </div>

              <div class="divideheight-8"></div>

              <div>
                <div
                  v-for="(labelItem,labelIndex) in service.label"
                  :key="labelIndex"
                  class="label-container">
                  <van-tag
                    type="primary"
                    size="large"
                    color=" rgba(128,141,161,0.10)"
                    text-color="#808DA1"
                    >{{ labelItem }}</van-tag
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付成功状态 -->
    <div
      class="input paystatus-tipbar j-flex"
      v-if="service.payStatus == 2 || service.payStatus == 4">
      <div class="textcontent j-fc-blue flex">
        <div class="j-flex">
          <div class="flex">
            消费：{{ service.totalAmount }}元
          </div>
          <div>|</div>
          <div class="flex">
            优惠：{{ service.discountsTotalAmount }}元
          </div>
          <div>|</div>
          <div class="flex ft-bold title">
            支付：{{ service.realAmount }}元
          </div>
        </div>
      </div>
    </div>

    <!-- 5交易关闭 -->
    <div
      class="input paystatus-tipbar j-flex"
      v-if="service.payStatus == 5"
    >
      <div class="j-fc-deepgray flex" style="text-align: right;">
        <div class="j-flex">
          <div class="flex ft-bold title">
            消费：{{ service.totalAmount }}元
          </div>
        </div>
      </div>

      <!-- 已退款 -->
      <div
        class="input paystatus-tipbar j-flex"
        v-if="service.payStatus == 4">
        <div class="textcontent j-fc-blue flex">
          <div class="j-flex">
            <div class="flex">
              消费：{{ service.totalAmount }}元
            </div>
            <div>|</div>
            <div class="flex">
              优惠：{{ service.discountsTotalAmount }}元
            </div>
            <div>|</div>
            <div class="flex ft-bold title">
              退款：{{ service.refundAmount }}元
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    // 订单数据
    service: {
      type: Object,
      default () {
        return {}
      },
      required: true
    },

    // 是否显示右侧角标
    showrighticon: {
      type: Boolean,
      default: true
    },

    // 点击跳转详情控制
    clickjump: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      // 倒计时秒数
      waitpaytimecounter: 0,

      // 超时15分钟
      expire: 15 * 60 * 1000
    }
  },

  computed: mapState({
    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    // 如果当前订单未待支付且在15分钟内 则显示倒计时
    setTimeout(() => {
      if (this.service.payStatus === 0) {
        this.F_waitPayTimer()
      }
    }, 500)
  },

  methods: {
    // 跳转详情
    F_toDetail () {
      if (this.clickjump) {
        this.$router.push('/army/payrecords/detail/' + this.service.id)
      }
    },

    // 倒计时时间处理
    F_waitPayTimer () {
      if (this.browerEnvStatus.isIOS) {
        this.service.createTime = this.service.createTime.replace(/-/g, '/')
      }
      // console.log('倒计时时间', this.service.createTime)

      const timeleft = new Date(this.service.createTime).getTime() - new Date().getTime() + this.expire

      this.waitpaytimecounter = timeleft
      setTimeout(() => {
        this.service.payStatus = 5
      }, timeleft)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.fz-12{
  font-size: 12px;
}

.ft-bold{
  font-weight: bold;
}

.van-count-down{
  display: inline-block;
  font-size: 12px;
}

.title{
  font-size: 14px;
}

.payinfo{
  text-align: right;

  .money-number{
    font-size: 18px;
  }
}

.paystatus-tipbar{
  padding: 0 0 10px 0;
  font-size: 12px;

  .textcontent{
    padding: 8px 0;
    background: #ecf9ff;
    text-align: center;
  }

  .textcontent-refund{
    background: #FFFBE8;
    color: $--color-orange;
    text-align: left;
    padding: 8px 12px;
  }
}

.imgcover{
  position: relative;
  width: 88px;
  height: 64px;
  margin-right: 8px;
  border-radius: 4px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.divideheight-8{
  height: 8px;
}

.van-tag--large {
  font-size: 12px;
}
</style>
