<template>
  <div>
    <Common-PageContainer>
      <template v-slot:content>
        <div class="form-group nomargin-t">
          <form ref="formavatar">
            <label class="c check-c">
              <div class="input j-flex j-flex-center">
                <div class="flex">
                  头像
                </div>

                <!-- "style="'background-image: url(' + '' + ')';" -->
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
        </div>

        <!-- 代持人信息 -->
        <div v-if="armyInfo.type == 1">
          <div class="form-head">代持人信息</div>
          <Common-PageDevideHeight />
          <van-cell-group>
            <van-cell
              title="姓名"
              :value="data.userdetail.userName"
            />
            <van-cell
              title="身份证号"
              :value="data.userdetail.cardNo"
            />
            <van-cell
              v-if="armyInfo.type == 1"
              title="联系电话"
              :value="data.userdetail.phone"
              is-link
              @click="pagestatus.editphone = true"
            />

            <van-cell
              v-if="armyInfo.type != 0"
              title="与退役军人关系"
              :value="data.relationType[data.userdetail.relationType]"
            />
          </van-cell-group>

          <Common-PageDevideHeight />
        </div>

        <!-- 老兵信息 -->
        <div>
          <div v-if="armyInfo.id" class="form-head">退役军人信息</div>
          <Common-PageDevideHeight />
          <van-cell-group>
            <van-cell
              title="姓名"
              :value="data.armyinfo.userName"
            />
            <van-cell
              title="手机"
              :value="data.armyinfo.phone"
            />
            <van-cell title="出生年月" :value="data.armyinfo.birthDay" />
            <van-cell
              title="性别"
              :value="$Config.enumConfig.gender[data.armyinfo.sex]"
            />
            <van-cell title="证件类型" :value="data.armyinfo.idType" />
            <van-cell title="身份证" :value="data.armyinfo.cardNo" />
            <van-cell title="政治面貌" :value="data.armyinfo.politicalStatus" />
            <van-cell title="退役军人类型" :value="data.armyinfo.servicemanType" />
            <van-cell title="优抚类型" :value="data.armyinfo.enjPensSubType" />
            <van-cell title="入伍时间" :value="data.armyinfo.enrollDt" />
            <van-cell title="退伍时间" :value="data.armyinfo.demobilizeDt" />
            <van-cell title="户籍所在地" :value="data.armyinfo.areaInfo" />
            <van-cell title="家庭住址" :value="data.armyinfo.address" />
            <van-cell title="安置地" :value="data.armyinfo.resetPlace" />
          </van-cell-group>
        </div>

        <div class="j-m messagetip">
          <div class="j-fc-red text">
            若上述信息有误，请携带身份证和相关退役证明到
            户籍所在的退役军人服务站进行信息更改；<!-- 联系电话：<Common-PhoneCall
              telephone="05718765657"
            /> -->
          </div>
        </div>

        <Common-PageDevideHeight />

        <!-- 商家机构身份用户 进行跳转身份切换入口 -->
        <div v-if="pagestatus.hasmerchantservice">
          <van-cell-group>
            <van-cell is-link @click="F_changeUserType">
              <template #title>
                <span class="listicon fas fa-store j-fc-blue"></span> 我是商家/服务机构
              </template>
            </van-cell>
          </van-cell-group>

          <Common-PageDevideHeight />
        </div>

        <van-cell-group v-if="showFeedBack">
          <van-cell is-link @click="$router.push('/army/allapplication')">
            <template #title>
              <span class="listicon fas fa-cog j-fc-blue"></span> 个性化设置
            </template>
          </van-cell>
        </van-cell-group>

        <Common-PageDevideHeight v-if="showFeedBack" />

        <van-cell-group v-if="showFeedBack">
          <van-cell is-link @click="$router.push('/army/suggestion')">
            <template #title>
              <span class="listicon fas fa-info-circle j-fc-blue"></span>
              意见反馈
            </template>
          </van-cell>
        </van-cell-group>

        <Common-PageDevideHeight />

        <van-cell-group>
          <van-cell>
            <template #title>
              <span class="listicon fab fa-buffer j-fc-blue"></span>
              系统版本 {{ data.version }}
            </template>
          </van-cell>
        </van-cell-group>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <UserTypeExchange
      ref="usertypeexchange"
      @hasmerchantservice="F_checkUserTypeShow"
    />

    <!-- 修改手机号 -->
    <van-dialog
      v-model="pagestatus.editphone"
      title="新手机号"
      show-cancel-button
      :beforeClose="F_cancelConfim"
      @cancel="data.editphone = ''"
      @confirm="F_editPhone"
    >
      <div class="form-group">
        <div class="c lineto-txtlr">
          <div class="input normal j-flex j-flex-center">
            <div class="imgicon"></div>

            <div class="yuanicon">
              <span class="fas fa-mobile-alt"></span>
            </div>

            <div class="flex">
              <input
                type="number"
                v-model="data.editphone"
                placeholder="点击输入手机号码"
              />
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserTypeExchange from '@/components/usertypeexchange/UserTypeExchange.vue'
import Validator from '@/assets/js/Validator.js'

export default {
  components: {
    UserTypeExchange
  },

  data () {
    return {
      Validator: Validator,

      // 状态控制
      pagestatus: {
        // 商家 机构身份
        hasmerchantservice: false,

        // 修改手机号
        editphone: false
      },

      // 头像信息
      avatar: this.$store.state.localData.Userinfo.avatar,

      // 数据存放
      data: {
        // 代持人信息
        userdetail: {},

        // 军人信息
        armyinfo: {},

        // 代持关系
        relationType: {},

        // 修改手机号码
        editphone: '',

        // 系统版本号
        version: ''
      }
    }
  },

  computed: mapState({
    // 用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 用户头像样式
    userAvatarStyle () {
      return this.avatar ? 'background-image: url(' + this.avatar + ')' : ''
    },

    // 是否显示意见反馈
    showFeedBack (state) {
      if (this.armyInfo.id) {
        return true
      }

      return false
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    this.F_loadRelation()

    this.F_getPersonalInfo()

    // 代持人信息
    if (this.armyInfo.type === 1) {
      this.F_loadInchargeData()
    }

    this.F_loadVersion()
  },

  methods: {
    // 加载系统版本号
    async F_loadVersion () {
      const data = await this.$Api.common.getversion()

      console.log('系统版本', data)
      if (data.code === 2000) {
        this.data.version = data.result
      }
    },

    // 取消修改手机号
    F_cancelConfim (action, done) {
      if (action === 'cancel') {
        done(true)
        return
      }

      done(Validator.Mobile.test(this.data.editphone))
    },

    // 修改手机号
    async F_editPhone () {
      if (!Validator.Mobile.test(this.data.editphone)) {
        this.$toast('请正确输入手机号码')
        return
      }

      this.$Common.showLoading(true)

      const data = await this.$Api.army.incharge.editPhone({
        phone: this.data.editphone,
        userId: this.armyInfo.id
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.data.userdetail.phone = this.data.editphone

        this.data.editphone = ''
        this.pagestatus.editphone = false
        this.$toast('手机号修改成功')
        return
      }

      this.$toast(data.message)
    },

    // 加载关系类型
    async F_loadRelation () {
      const data = await this.$Api.common.category(
        this.$Config.enumConfig.armyrelocation
      )

      if (data.code === 2000) {
        data.result.map((item, index) => {
          if (item.value) {
            this.data.relationType[item.value] = item.label
          }
        })
        return
      }

      this.$toast('关系类型数据加载失败')
    },

    // 获取代持人信息
    async F_loadInchargeData () {
      const data = await this.$Api.userinfo.getLoginUserInfo(this.armyInfo.id)

      if (data.code === 2000) {
        this.data.userdetail = data.result
        return
      }

      this.$toast('代持人信息加载失败')
    },

    // 获取军人信息
    async F_getPersonalInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.userinfo.getPersonalInfo({
        userId: this.armyInfo.id || this.Userinfo.id,
        userType: this.armyInfo.type
      })

      this.$Common.showLoading(false)

      // console.log('用户信息', data)

      if (data.code === 2000) {
        // 当前未本人 并且 没有老兵信息 则为 个人登录信息
        // if (this.armyInfo.type === 0 && !this.armyInfo.id) {
        //   this.data.userdetail = data.result || {}
        //   return
        // }

        this.data.armyinfo = data.result || {}
      }
    },

    // 检查是否有商户 机构身份
    F_checkUserTypeShow (flag) {
      this.pagestatus.hasmerchantservice = flag
    },

    // 进行身份切换
    F_changeUserType () {
      this.$refs.usertypeexchange.F_show()
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

          this.avatar = result.result

          this.$Common.showLoading(true)

          const avatarUrl = await this.$Api.common.uploadBase64Image(
            result.result
          )

          if (avatarUrl.code === 2000) {
            this.avatar = avatarUrl.result

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

.yuanicon{
  margin-right: 10px;
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
    border-radius: 50%;
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
</style>
