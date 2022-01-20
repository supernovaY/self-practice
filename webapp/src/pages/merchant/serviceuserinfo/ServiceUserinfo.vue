<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <!-- <div class="form-group nomargin-t">
          <form ref="formavatar">
            <label class="c check-c">
              <div class="input j-flex j-flex-center">
                <div class="flex" style="font-size:14px">
                  头像
                </div>

                <div class="useravatar">
                  <div class="avatar" :style="userAvatarStyle"></div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="F_uploadAvatar"
                  />
                </div>
              </div>
            </label>
          </form>
        </div> -->

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
              <div class="label-msg">优待服务项</div>

              <div class="flex right-txt j-fc-gray">
                <div
                  v-for="(item,index) in data.merchantinfo.serviceDetails"
                  :key="index"
                  class="label-container"
                >
                  <van-tag
                    type="primary"
                    size="large"
                    color=" rgba(128,141,161,0.10)"
                    text-color="#808DA1"
                  >
                    {{ item.value }}
                  </van-tag>
                </div>
              </div>
            </div>
          </div>

          <div class="c lineto-txtlr">
            <div class="input j-flex j-flex-center">
              <div class="label-msg">入驻时间</div>

              <div class="flex right-txt j-fc-gray">
                {{ data.merchantinfo.enterTime }}
              </div>
            </div>
          </div>

          <div class="c lineto-txtlr">
            <div class="input j-flex j-flex-center">
              <div class="label-msg">服务机构类型</div>

              <div class="flex right-txt j-fc-gray">
                {{ data.merchantinfo.orgTypeStr || '' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div>
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
                <Common-PhoneCall :telephone="data.merchantinfo.phone"/>
              </template>
            </van-cell>

            <van-cell title="地址" :value="data.merchantinfo.address" />
            <!-- <van-cell
              title="详情"
              :value="data.merchantinfo.detail"
            /> -->
            <van-cell
              is-link
              title="详情"
              @click="$router.push('/merchant/service/userinfo/detail')"
            />
          </van-cell-group>
        </div>

        <!-- 商家图片 -->
        <div class="j-m bkwhite-container">
          <Common-PageDevideHeight />
          <div class="j-fc-deepgray">服务机构图片：</div>
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

          <van-button v-if="merchantInfo.principal" block type="info" @click="$router.push('/merchant/service/userinfo/edit')">
            编辑
          </van-button>
          <Common-PageDevideHeight />
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
            <van-cell is-link @click="F_urlJump('/merchant/service/subaccount')">
              <template #title>
                <span class="listicon fas fa-user j-fc-blue"></span> 账号管理
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <!-- <Common-PageDevideHeight />

        <van-cell-group>
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
// import UserTypeExchange from '@/components/usertypeexchange/UserTypeExchange.vue'

export default {
  components: {
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
        // 商户详情
        merchantinfo: {},

        // 个人信息
        personalinfo: {}
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    },

    avatar (state) {
      return state.localData.Userinfo.avatar
    },

    // 登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.avatar ? 'background-image: url(' + this.avatar + ')' : ''
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.F_loadServiceInfo()

    this.F_getPersonalInfo()

    // 控制下级页面的 keepalive
    this.$store.commit(
      'sendMultyPageParam',
      [
        { path: '/merchant/service/userinfo/edit', data: { action: 'reload' } }
      ]
    )
  },

  methods: {
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

    // 加载机构详情信息
    async F_loadServiceInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.service.getServiceInfo(this.merchantInfo.id)

      this.$Common.showLoading(false)
      // console.log('机构详情数据', data)

      if (data.code === 2000) {
        this.data.merchantinfo = data.result
        return
      }

      this.$toast('机构信息加载失败')
    },

    // 页面跳转
    F_urlJump (url) {
      this.$router.push(url)
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

.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.bkwhite-container{
  background: #FFF;
}

.van-tag--large {
  font-size: 12px;
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
