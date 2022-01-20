<template>
  <div>
    <Common-PageContainer :showToTop="true" @scrollLoad="F_scrollLoad">
      <template v-slot:content>
        <div class="container">
          <div class="header">
            <div class="imgbk j-m">
              <div class="headertop-divide"></div>
              <div class="menucontainer j-flex">
                <router-link to="/army/startbusiness/policyquery/2" class="menuitem">
                  <div>
                    <span class="icon-img icon-search"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">政策查询</div>
                </router-link>
                <router-link to="/army/startbusiness/intentionlist" class="menuitem">
                  <div>
                    <span class="icon-img icon-intention"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">创业意向</div>
                </router-link>
                <router-link to="/army/startbusiness/support" class="menuitem">
                  <div>
                    <span class="icon-img icon-help"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">创业扶持</div>
                </router-link>
                <router-link to="/army/startbusiness/online" class="menuitem">
                  <div>
                    <span class="icon-img icon-online"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">业务办理</div>
                </router-link>
                <!-- <router-link to="/army/startbusiness/case" class="menuitem">
                  <div>
                    <span class="icon-img icon-case"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">创业案例</div>
                </router-link> -->
                <router-link to="/army/startbusiness/training" class="menuitem">
                  <div>
                    <span class="icon-img icon-train"></span>
                  </div>
                  <div class="menuname j-fc-deepgray">创业培训</div>
                </router-link>
              </div>
              <Common-PageDevideHeight />
              <Common-PageDevideHeight />
            </div>
          </div>
          <park-list ref="parkList" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import { mapState } from 'vuex'
import ParkList from './ParkList.vue'

export default {
  components: {
    ParkList
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
      this.$refs.parkList.F_scrollLoad()
    },

    // 跳转url
    F_jump (url) {
      this.$router.push(url)
    },

    // 扫码
    F_scan () {
      thirdauth.Scan(text => {
        alert(text)
      })

      // 测试临时跳转
      if (!this.browerEnvStatus.zlb) {
        this.$router.push('/army/pay/payinputmeny')
      }
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
    height: 56px;
  }

  .imgbk{
    background: url(../../../assets/img/img_sy_top@3x.png) no-repeat center top;
    background-size: 100% auto;
  }
}

.menucontainer{
  background: #FFFFFF;
  box-shadow: 0 4px 8px 0 rgba(20,146,255,0.16);
  border-radius: 4px;
  padding: 0 5px;
  flex-wrap: wrap;
  justify-content: space-around;
  .menuitem{
    padding: 16px 0;
    // width: 33.33333%;
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
  .icon-search{
    background-image: url(../../../assets/img/businessstart/icon_search@3x.png);
  }
  .icon-intention{
    background-image: url(../../../assets/img/businessstart/icon_intention@3x.png);
  }
  .icon-help{
    background-image: url(../../../assets/img/businessstart/icon_help@3x.png);
  }
  .icon-online{
    background-image: url(../../../assets/img/businessstart/icon_online@3x.png);
  }
  .icon-case{
    background-image: url(../../../assets/img/businessstart/icon_case@3x.png);
  }
  .icon-train{
    background-image: url(../../../assets/img/businessstart/icon_train@3x.png);
  }
}
</style>
