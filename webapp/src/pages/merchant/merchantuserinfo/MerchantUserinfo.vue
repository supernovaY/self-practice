<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="form-group nomargin-t">
          <form ref="formavatar">
            <label class="c check-c">
              <div class="input j-flex j-flex-center">
                <div class="flex">
                  商家logo
                </div>

                <div class="useravatar">
                  <div class="avatar" :style="userAvatarStyle"></div>
                </div>
              </div>
            </label>
          </form>
        </div>

        <!-- 商户用户信息 个人信息统一首页 用户那边显示 -->
        <!-- <div>
          <van-cell-group>
            <van-cell
              title="姓名"
              :value="data.personalinfo.userName"
            />
            <van-cell
              title="身份证"
              :value="data.personalinfo.cardNo"
            />
          </van-cell-group>
        </div> -->

        <!-- 商户优惠券信息 -->
        <div class="form-group nomargin-t">
          <div class="c lineto-txtlr">
            <div class="input j-flex j-flex-center">
              <div class="label-msg">折扣情况</div>

              <div class="flex right-txt j-fc-gray">
                {{
                  data.merchantinfo.discount || data.merchantinfo.discount === 0 ?
                  data.merchantinfo.discount + '折' :
                  '无折扣'
                }}
              </div>
            </div>
          </div>

          <div class="c lineto-txtlr">
            <div class="input j-flex j-flex-center">
              <div class="flex">
                可核销优惠券：
              </div>
            </div>
          </div>

          <div class="bkwhite-container">
            <div
              v-if="!data.merchantinfo.couponList || data.merchantinfo.couponList.length <= 0"
            >
              <van-empty
                class="j-small"
                description="暂无可核销的优惠券"
              />
            </div>

            <van-swipe
              v-if="data.merchantinfo.couponList && data.merchantinfo.couponList.length > 0"
              indicator-color="#1492FF"
              :loop="false"
            >
              <van-swipe-item
                v-for="(item,index) in data.merchantinfo.couponList"
                :key="index"
              >
                <Coupon
                  :coupon="item"
                  :showbtn="false"
                />
              </van-swipe-item>
            </van-swipe>
          </div>
        </div>

        <!-- 商户基本信息 -->
        <div>
          <van-cell-group>
            <van-cell
              title="入驻时间"
              :value="data.merchantinfo.enterTime"
            />
          </van-cell-group>

          <Common-PageDevideHeight />

          <van-cell-group>
            <van-cell
              title="商户类型"
              :value="data.merchantinfo.typeStr"
            />
          </van-cell-group>

          <Common-PageDevideHeight />

          <van-cell-group>
            <van-cell
              title="名称"
              :value="data.merchantinfo.name"
            />
            <van-cell
              title="营业时间"
              :value="data.merchantinfo.openTime"
            />
            <van-cell
              title="联系方式"
            >
              <template #default>
                <Common-PhoneCall :telephone="data.merchantinfo.phone || ''"/>
              </template>
            </van-cell>

            <van-cell title="地址" :value="data.merchantinfo.address" />

            <van-cell
              is-link
              title="详情"
              @click="$router.push('/merchant/userinfo/detail')"
            />
          </van-cell-group>
        </div>

        <!-- 商家图片 -->
        <div class="j-m bkwhite-container">
          <Common-PageDevideHeight />
          <div class="j-fc-deepgray">商家图片：</div>
          <Common-PageDevideHeight />

          <div class="cover-swiper">
            <div class="couver-count">
              <span class="far fa-image"></span> {{ data.merchantinfo.images ? data.merchantinfo.images.length : '0' }}
            </div>

            <div>
              <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item
                  v-for="(item,index) in data.merchantinfo.images"
                  :key="index"
                >
                  <div
                    :style="'background-image: url(' + item.url + ');'"
                    class="img"
                  ></div>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <van-button
            v-if="merchantInfo.principal"
            block
            type="info"
            @click="$router.push('/merchant/userinfo/edit')"
          >
            编辑
          </van-button>
          <Common-PageDevideHeight v-if="merchantInfo.principal" />
        </div>

        <!-- 商家机构身份用户 进行跳转身份切换入口 -->
        <!-- <div v-if="pagestatus.hasmerchantservice">
          <Common-PageDevideHeight />
          <van-cell-group>
            <van-cell is-link @click="F_changeUserType">
              <template #title>
                <span class="listicon fas fa-store j-fc-blue"></span> 切换商家/服务机构
              </template>
            </van-cell>
          </van-cell-group>
        </div> -->

        <div v-if="merchantInfo.principal">
          <Common-PageDevideHeight />

          <van-cell-group>
            <van-cell is-link @click="F_urlJump('/merchant/subaccount')">
              <template #title>
                <span class="listicon fas fa-user j-fc-blue"></span> 账号管理
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <Common-PageDevideHeight />

        <!-- <van-cell-group>
          <van-cell is-link @click="F_urlJump('/army/allapplication')">
            <template #title>
              <span class="listicon fab fa-alipay j-fc-blue"></span> 支付宝授权
            </template>
          </van-cell>
        </van-cell-group>

        <Common-PageDevideHeight /> -->

        <!-- <van-cell-group>
          <van-cell is-link @click="F_urlJump('/merchant/suggestion')">
            <template #title>
              <span class="listicon fas fa-info-circle j-fc-blue"></span>
              意见反馈
            </template>
          </van-cell>
        </van-cell-group> -->

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- <UserTypeExchange
      ref="usertypeexchange"
      @hasmerchantservice="F_checkUserTypeShow"
    /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Coupon from '@/components/coupon/Coupon.vue'
// import UserTypeExchange from '@/components/usertypeexchange/UserTypeExchange.vue'

export default {
  components: {
    Coupon
    // UserTypeExchange
  },

  data () {
    return {
      // 状态控制
      pagestatus: {
        // 商家 机构身份
        hasmerchantservice: false
      },

      data: {
        // 商家信息
        merchantinfo: {},

        // 个人信息
        personalinfo: {},

        // 可用优惠券列表
        coupons: []
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    // 登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.data.merchantinfo.logo ? 'background-image: url(' + this.data.merchantinfo.logo + ')' : ''
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.F_loadMerchantInfo()

    // this.F_getPersonalInfo()

    // 控制下级页面的 keepalive
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/merchant/userinfo/edit', data: { action: 'reload' } }
      ]
    )
  },

  methods: {
    // 页面跳转
    F_urlJump (url) {
      this.$router.push(url)
    },

    // 获取商家信息
    async F_loadMerchantInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.getMerchantInfo(this.merchantInfo.id)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        if (data.result.couponList && data.result.couponList.length > 0) {
          data.result.couponList.map((item) => {
            item.createTime = item.giveOutTime
            item.active = true
          })
        }

        this.data.merchantinfo = data.result
        return
      }

      this.$toast('信息加载失败')
    },

    // 获取个人信息
    async F_getPersonalInfo () {
      const data = await this.$Api.userinfo.getPersonalInfo({
        userId: this.Userinfo.id,
        // 获取本人的信息
        userType: 0
      })

      // console.log(data)

      if (data.code === 2000) {
        this.data.personalinfo = data.result
      }
    },

    // 检查是否有商户 机构身份
    F_checkUserTypeShow (flag) {
      this.pagestatus.hasmerchantservice = flag
    },

    // 进行身份切换
    F_changeUserType () {
      // this.$refs.usertypeexchange.F_show()
    },

    // 上传头像
    F_uploadAvatar (evt) {
      const fileinput = evt.target

      const files = fileinput.files

      if (files.length > 0) {
        this.$Common.kCompass({
          fileinput: files[0],
          width: 200,
          height: 200
        }).then(async (result) => {
          // console.log(result)
          // this.imgbase64 = result.result

          this.$Common.showLoading(true)

          const avatarUrl = await this.$Api.common.uploadBase64Image(
            result.result
          )

          if (avatarUrl.code === 2000) {
            const data = await this.$Api.userinfo.updateAvatar({
              id: this.Userinfo.id,
              url: avatarUrl.result
            })

            this.$Common.showLoading(false)

            if (data.code === 2000) {
              this.$toast('头像修改成功')

              const userinfo = Object.assign({}, this.Userinfo)

              userinfo.avatar = avatarUrl.result

              // 更新头像数据信息
              this.$store.commit('updateLocalData', {
                Userinfo: userinfo
              })
            }
            return
          }

          this.$Common.showLoading(false)
          this.$toast('图片上传失败，请重试')
        }).catch(() => {

        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.bkwhite-container{
  background: #FFF;
}

.useravatar {
  input {
    display: none;
  }

  .avatar {
    background: url(../../../assets/img/ic_mrtx@3x.png) no-repeat center center;
    background-size: cover;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}

.messagetip {
  background-color: $--color-lightpink;

  .text {
    padding: 12px 0;
    font-size: 14px;
    line-height: 1.6;
  }
}

.listicon {
  min-width: 22px;
  font-size: 14px;
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
    height: 200px;
  }
}
</style>
