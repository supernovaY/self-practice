<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div
            class="headertip"
            v-if="$route.query.type == 'expire'">
            <div class="j-m j-flex j-flex-center">
              <div class="infoicon">
                <span class="fas fa-info-circle"></span>
              </div>

              <div class="flex">
                {{ coupon.name }}优惠券失效时间：{{ coupon.endTime }}
              </div>
            </div>
          </div>

          <div
            v-if="$route.query.type == 'send'"
            class="j-m"
          >
            <Common-PageDevideHeight />
            {{ coupon.name }}优惠券已发放，请查收
          </div>

          <Coupon :coupon="coupon" />

          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Coupon from '@/components/coupon/Coupon.vue'

export default {
  components: {
    Coupon
  },
  data () {
    return {
      coupon: {
        name: ''
      }
    }
  },

  computed: mapState({
    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 当前用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  mounted () {
    if (!this.$route.query.couponid) {
      this.$toast('来源错误')
      return
    }

    this.F_loadData()
  },

  methods: {
    // 加载数据
    async F_loadData () {
      this.$Common.showLoading(true)

      // 加载优惠券列表
      const data = await this.$Api.army.getCoupon(
        this.$route.query.couponid
      )

      this.$Common.showLoading(false)

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      this.coupon = data.result
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;
}

.headertip {
  background: $--color-lightpink;
  color: $--color-red;
  padding: 12px 0;

  .infoicon {
    width: 24px;
    margin-right: 0.1rem;
    font-size: 16px;
  }
}
</style>
