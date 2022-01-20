<template>
  <div>
    <Common-PageContainer :showToTop="true" @scrollLoad="F_scrollLoad">
      <template v-slot:content>
        <div class="container">
          <div class="header">
            <div class="imgbk j-m">
              <div class="headertop-divide"></div>

              <div class="menucontainer j-flex">
                <div class="menuitem" @click="F_scan">
                  <div>
                    <span class="icon-img icon-scan"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">扫一扫</div>
                </div>

                <router-link to="/army/mycoupons" class="menuitem">
                  <div>
                    <span class="icon-img icon-coupon"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">我的优惠券</div>
                </router-link>

                <router-link to="/army/payrecords" class="menuitem">
                  <div>
                    <span class="icon-img icon-payrecords"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">消费记录</div>
                </router-link>

                <router-link to="/army/servicerecords" class="menuitem">
                  <div>
                    <span class="icon-img icon-service"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">服务记录</div>
                </router-link>
              </div>
              <Common-PageDevideHeight />
              <Common-PageDevideHeight />
            </div>
          </div>

          <PtreatmentIndexRecommend ref="ptreatmentrecommend" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import { mapState } from 'vuex'
import PtreatmentIndexRecommend from './PtreatmentIndexRecommend.vue'

export default {
  components: {
    PtreatmentIndexRecommend
  },
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        loading: false
      },

      // 数据存放对象
      data: {

      }
    }
  },

  computed: mapState({
    GET: 'GET',
    browerEnvStatus: 'browerEnvStatus'
  }),

  activated () {
    // 子页面 keepalive的页面重置处理
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/army/mycoupons', data: { action: 'reload' } },
        { path: '/army/servicerecords', data: { action: 'reload' } },
        { path: '/army/payrecords', data: { action: 'reload' } },
        { path: '/army/ptreatment/searchmerchant', data: { action: 'reload' } },
        { path: '/army/ptreatment/searchservice', data: { action: 'reload' } }
      ]
    )
  },

  mounted () {

  },

  methods: {
    // 滚动加载
    F_scrollLoad () {
      this.$refs.ptreatmentrecommend.F_loadData()
    },

    // 跳转url
    F_jump (url) {
      this.$router.push(url)
    },

    // 扫码
    F_scan () {
      thirdauth.Scan(text => {
        window.location.href = text
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;
}

.header{
  // background-image: linear-gradient(to top, rgba(255,255,255,0) 0%, $--color-primary 100%);

  .headertop-divide{
    height: 40px;
  }

  .imgbk{
    background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center -20px;
    background-size: cover;
  }
}

.menucontainer{
  background: #FFFFFF;
  box-shadow: 0 4px 8px 0 rgba(20,146,255,0.16);
  border-radius: 4px;

  .menuitem{
    padding: 16px 0;
    width: 25%;
    text-align: center;

    &:active{
      opacity: .5;
    }

    .menuname{
      font-size: 14px;
      margin-top: 4px;
    }

    .icon-img{
      display: inline-block;
      width: 36px;
      height: 36px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .icon-scan{
    background-image: url(../../../assets/img/ic_sys@3x.png);
  }

  .icon-coupon{
    background-image: url(../../../assets/img/ic_wdyhq@3x.png);
  }

  .icon-payrecords{
    background-image: url(../../../assets/img/ic_xfjl@3x.png);
  }

  .icon-service{
    background-image: url(../../../assets/img/ic_fwjl@3x.png);
  }
}
</style>
