 <template>
  <div @click="F_select">
    <div class="coupon">
      <!-- 优惠券背景样式 -->
      <img
        v-if="coupon.active || coupon.status === 2 || coupon.status === 1"
        class="styleimg" src="../../assets/img/img_yhq@3x.png" />
      <img
        v-if="coupon.active === false || coupon.status == 3 || coupon.status == 4"
        class="styleimg" src="../../assets/img/img_yhq_zh@3x.png" />

      <div class="container">
        <div class="j-flex content">
          <div class="left-dicount">
            <div class="discount-money j-flex j-flex-center">
              <div class="flex">
                <span class="icon fas fa-yen-sign"></span>
                <span class="number">{{ coupon.discountAmount }}</span>

                <div class="info-dheight"></div>

                <div>
                  <span v-if="coupon.thresholdAmount === 0">
                    无门槛
                  </span>

                  <span v-if="coupon.thresholdAmount > 0">
                    支付满{{ coupon.thresholdAmount }}元可用
                  </span>
                </div>

              </div>
            </div>

            <div class="usestatus j-flex j-flex-center">
              <div class="flex">
                <span v-if="coupon.status == 4">已使用</span>
                <span v-if="coupon.status == 3">已失效</span>
              </div>
            </div>
          </div>

          <div class="flex right-detail">
            <div class="detailinfo j-flex j-flex-vtc">
              <div class="flex">
                <div class="j-flex j-flex-center">
                  <div class="coupon-name flex">
                    {{ coupon.name }}
                  </div>

                  <div v-if="showbtn && !selectmode">
                    <van-button
                      v-if="!coupon.active && coupon.status == 4"
                      round
                      type="info"
                      size="mini"
                      @click="F_jumpUseDetail">
                      使用详情
                    </van-button>

                    <van-button
                      v-if="coupon.status == 1"
                      round
                      type="info"
                      size="mini"
                      color="#F76120"
                      :disabled="true">
                      未生效
                    </van-button>

                    <van-button
                      v-if="coupon.status === 2"
                      round
                      type="info"
                      size="mini"
                      color="#F76120"
                      @click="F_goUse">
                      马上使用
                    </van-button>
                  </div>

                  <div v-if="selectmode" class="coupon-select">
                    <van-radio :name="coupon.id"></van-radio>
                  </div>
                </div>

                <div class="info-dheight"></div>

                <div class="j-fc-gray j-flex">
                  <div class="flex">
                    适用{{ coupon.area || '' }}{{ coupon.relType === 1 ? '全部商家' : '部分商家' }}
                  </div>
                </div>
              </div>

              <div>
                <div class="j-fc-gray j-flex">
                  <div class="info-title">发放时间：</div>
                  <div class="flex">
                    <span v-if="coupon.giveOutTime">
                      {{ coupon.giveOutTime.split(' ')[0] }}
                    </span>

                    <span v-if="coupon.createTime && !coupon.giveOutTime">
                      {{ coupon.createTime ? coupon.createTime.split(' ')[0] : '' }}
                    </span>
                  </div>
                </div>

                <div class="info-dheight"></div>
                <div class="info-dheight"></div>
              </div>
            </div>

            <div
              v-if="showexpiredate"
              class="expiretime j-flex j-flex-center"
            >
              <div class="flex j-fc-gray">
                有效期：
                {{ new Date(coupon.startTime).Format('yyyy/MM/dd') }}
                ~
                {{ new Date(coupon.endTime).Format('yyyy/MM/dd') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 优惠券组件
 */
export default {
  name: 'Coupon',

  props: {
    // 优惠券信息
    coupon: {
      type: Object,
      default () {
        return {

        }
      }
    },

    // 是否强制不显示按钮
    showbtn: {
      type: Boolean,
      default: true
    },

    // 选择模式
    selectmode: {
      type: Boolean,
      default: false
    },

    // 是否显示有效期
    showexpiredate: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      // 优惠券状态
      pagestatus: {
        1: '暂时不可使用',
        2: '可用',
        3: '已过期',
        4: '已使用'
      }
    }
  },

  mounted () {

  },

  methods: {
    // 跳转使用详情
    F_jumpUseDetail () {
      this.$router.push('/army/mycoupons/usedetail/' + this.coupon.id)
    },

    // 跳转使用
    F_goUse () {
      this.$router.push('/army/qrcode' + this.$Common.KhttpBuildQuery({
        action: 'coupon',
        couponid: this.coupon.id
      }))
    },

    // 选择模式 触发事件上
    F_select (e) {
      e.preventDefault()
      this.$emit('select', this.coupon)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.coupon{
  position: relative;
  font-size: 10px;
  line-height: 1.3;

  .coupon-select{
    position: relative;

    &:after{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
    }
  }

  .styleimg{
    width: 100%;
    display: block;
  }

  .coupon-name{
    font-size: 14px;
  }

  .info-title{
    width: 65px;
  }

  .info-dheight{height: 4px;}

  .container{
    position: absolute;
    left: 4%;
    right: 4%;
    top: 10%;
    bottom: 10%;

    .content{
      width: 100%;
      height: 100%;
    }
  }

  .right-detail{
    .detailinfo{
      position: absolute;
      left: 4%;
      right: 4%;
      top: 6%;
      bottom: 22%;
      overflow-y: auto;
    }

    .expiretime{
      position: absolute;
      left: 4%;
      right: 4%;
      top: 76%;
      bottom: 0%;
      color: $--color-menugray;
    }
  }

  .left-dicount{
    height: 100%;
    width: 32%;
    position: relative;

    .discount-money{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 22%;
      text-align: center;
      color: #FFF;

      .icon{
        font-size: 18px;
        margin-right: 4px;
      }

      .number{
        font-size: 24px;
        letter-spacing: 1px;
        font-weight: bold;
      }
    }

    .usestatus{
      position: absolute;
      left: 0;
      right: 0;
      top: 76%;
      bottom: 0%;
      text-align: center;
      color: $--color-menugray;
    }
  }
}
</style>

<style scoped>
.coupon >>> .van-button--mini{
  line-height: 1;
  height: 20px;
}
</style>
