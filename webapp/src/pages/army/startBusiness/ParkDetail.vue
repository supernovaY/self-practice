<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <Common-PageDevideHeight />
            <!-- 图片轮播 -->
            <div class="j-m" v-if="detail.photo && JSON.parse(detail.photo).length > 0">
              <div class="cover-swiper">
                <div class="couver-count">
                  <span class="far fa-image"></span> {{ JSON.parse(detail.photo).length }}
                </div>
                <div>
                  <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item
                      v-for="(item, index) in JSON.parse(detail.photo)"
                      :key="index"
                    >
                      <div
                        :style="'background-image: url(' + item + ');'"
                        class="img"
                      ></div>
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>
            </div>
            <Common-PageDevideHeight />
          </div>
          <div class="container">
            <ul class="info">
              <li>
                <h3>{{detail.armyParkName}}</h3>
                <div class="details">
                  <div class="phone" v-if="detail.contactPhone"><Common-PhoneCall :telephone="detail.contactPhone" :underline="true" /></div>
                  <div class="location">
                    <span class="text">{{detail.armyParkAddress}}</span>
                    <van-button type="info" size="mini" @click="$Common.openMapNav(detail.armyParkAddress, detail.longitude, detail.latitude)">导航</van-button>
                  </div>
                </div>
              </li>
              <li>
                <h3>所在地区</h3>
                <div class="details">
                  {{detail.areaName}}
                </div>
              </li>
              <li>
                <h3>成立时间</h3>
                <div class="details">
                  {{detail.setUpTime}}
                </div>
              </li>
              <li>
                <h3>入园基本条件</h3>
                <div class="details" v-html="detail.enteringBasicCondition"></div>
              </li>
              <li>
                <h3>军创园优惠政策</h3>
                <div class="details" v-html="detail.preferentialPolicy"></div>
              </li>
              <li>
                <h3>军创园简介</h3>
                <div class="details" v-html="detail.briefIntroduction"></div>
              </li>
            </ul>
          </div>
          <Common-PageFooter />
        </div>
        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodata" description="军创园不存在或已休业" />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      images: [
        'http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210520/1621508732205924.jpeg',
        'http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210524/1621853299994744.jpeg',
        'http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210524/1621854278599926.jpeg',
        'http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210524/1621854278599900.jpeg',
        'http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210524/1621854470533992.jpeg'
      ],
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,
        // 展开/闭合详情内容
        showhidecontent: true
      },
      // 详情信息
      detail: {}
    }
  },
  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_loadServiceInfo()
    }
  },
  mounted () {
    this.F_loadServiceInfo()
  },

  methods: {
    // 加载服务机构详情
    async F_loadServiceInfo () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.startup.getArmyParkDetail(
        this.$route.params.id
      )
      // console.log(data)
      this.$Common.showLoading(false)
      if (data.code === 2000 && data.result) {
        this.pagestatus.nodata = false
        this.detail = data.result
        return
      }
      this.pagestatus.nodata = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.container{
  background: #FFF;
}
.cover-swiper{
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .couver-count{
    position: absolute;
    z-index: 1;
    right: 16px;
    top: 16px;
    color: #FFF;
    background: rgba(0,0,0,.5);
    border-radius: 10px;
    padding: 4px 12px;
    font-size: 14px;
  }
  .img{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 90px;
  }
}
ul.info{
  padding: 0 16px;
  &>li{
    padding: 10px 0;
    border-bottom: 1px solid #E7E7E7;
    &:last-child{
      border: none;
    }
    .details{
      font-size: 14px;
      color: $--color-menugray;
      line-height: 1.5;
    }
    .phone {
      font-size: 12px;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_phone_l@3x.png") left 3px/16px no-repeat;
    }
    .location {
      position: relative;
      color: $--color-menugray;
      font-size: 12px;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_dw@3x.png") left 3px/16px no-repeat;
      line-height: 1.25;
      .van-button{
        padding: 2px 10px;
        position: absolute;
        right: 0;
        top: 0px;
      }
    }
  }
  h3 {
    margin: 0;
    padding: 10px 0;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
