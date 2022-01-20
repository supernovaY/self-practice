<template>
  <van-popup
    v-model="pagestatus.show"
    round
    position="bottom"
    closeable
    close-icon-position="top-right"
    :style="{ height: '80%' }">

    <div class="container j-flex j-flex-vtc">
      <div class="title">选择优惠券</div>

      <div class="flex">
        <div class="j-fullcontent">
          <div class="j-fullscrollcontent">
            <van-radio-group v-model="checkedcoupon">
              <Coupon
                v-for="(item,index) in coupons"
                :key="index"
                :coupon="item"
                :selectmode="true"
                @select="F_selectCoupon" />
            </van-radio-group>

            <div class="dicount-tipbar-heightfix"></div>
            <Common-PageDevideHeight />
          </div>
        </div>

        <div class="dicount-tipbar">
          <div class="j-m">
            <div class="j-flex j-flex-center">
              <div class="flex"></div>

              <div v-if="checkedcoupon !== ''" class="dwidth">已选择1张</div>

              <div v-if="checkedcoupon !== ''" class="dwidth">
                可减 <span class="discount-money j-fc-blue">{{ checkedcoupondata.discountAmount }}</span> 元
              </div>

              <div v-if="checkedcoupon === ''" class="dwidth">请选择优惠券</div>

              <div class="confirm-btn">
                <van-button
                  block
                  type="info"
                  size="mini"
                  @click="F_confirmSelect">确定</van-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </van-popup>
</template>

<script>
import { mapState } from 'vuex'
import Coupon from '@/components/coupon/Coupon.vue'

export default {
  components: {
    Coupon
  },

  props: {
    coupons: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      // 状态控制
      pagestatus: {
        show: false
      },

      // 选中优惠ID
      checkedcoupon: '',

      // 选择的优惠券数据
      checkedcoupondata: {},

      // 数据存放
      data: {
        coupons: []
      }
    }
  },

  computed: mapState({
    // 当前军人信息
    armyInfo (state) {
      return state.localData.armyInfo
    }
  }),

  methods: {
    // 设置默认选择项
    F_setDefaultCoupon (coupon) {
      this.checkedcoupondata = coupon
      this.checkedcoupon = coupon.id
    },

    // 确认选择的优惠券
    F_confirmSelect () {
      this.pagestatus.show = false

      this.$emit('select', this.checkedcoupondata)
    },

    // 触发选择
    F_show () {
      this.pagestatus.show = true
      // this.F_loadCouponData()
    },

    // 优惠券选择事件
    F_selectCoupon (coupon) {
      // console.log(coupon)

      if (this.checkedcoupon === coupon.id) {
        this.checkedcoupon = ''
        this.checkedcoupondata = {}
      } else {
        this.checkedcoupon = coupon.id
        this.checkedcoupondata = coupon
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 18px;
  text-align: center;
  padding: 16px 0;
}

.container{
  width: 100%;
  height: 100%;
}

.dicount-tipbar-heightfix{
  height: 50px;
}
.dicount-tipbar{
  position: absolute;
  z-index: 1;
  bottom: 10px;
  left: 0;
  right: 0;
  background: #FFF;
  box-shadow: 0 -1px 8px 0 rgba(180,193,203,0.50);
  padding: 12px 0;
  font-size: 14px;

  .confirm-btn{
    width: 42px;
  }

  .dwidth{
    margin: 0 8px;
  }

  .discount-money{
    font-size: 18px;
  }
}
</style>
