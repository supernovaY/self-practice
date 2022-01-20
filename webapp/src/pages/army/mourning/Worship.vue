<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <Header v-if="pagestatus.reload" ref="header" @martyinfo="F_loadMartyrInfo"></Header>

          <div class="j-m">
            <Common-PageDevideHeight></Common-PageDevideHeight>
            <Common-PageDevideHeight></Common-PageDevideHeight>
            <div class="large-title">感言寄语</div>
            <Common-PageDevideHeight></Common-PageDevideHeight>
          </div>

          <van-form ref="sform">
            <!-- 通过 pattern 进行正则校验 -->
            <van-field
              required
              name="pattern"
              label="是否公开姓名"
              placeholder="正则校验"
            >
              <template #input>
                <van-radio-group v-model="formdata.showmyname" direction="horizontal">
                  <van-radio name="1">是</van-radio>
                  <van-radio name="2">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <div class="j-m">
              <div class="input-wishesmessage">
                <van-field
                  v-model="formdata.message"
                  rows="3"
                  type="textarea"
                  maxlength="200"
                  placeholder="写下您对英烈的寄语..."
                  show-word-limit
                  :rules="[{ required: true, message: '请填写英烈的寄语' }]"
                />
              </div>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>

            <div class="j-m">
              <van-button @click="F_submitMessage" type="info" block>提交留言寄语</van-button>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>
            <Common-PageDevideHeight></Common-PageDevideHeight>
          </van-form>

          <MessageList v-if="pagestatus.reload" ref="messagelist" :martyr="data.martyrInfo"></MessageList>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from './Worship/Header.vue'
import MessageList from './Worship/MessageList.vue'

export default {
  components: {
    Header,
    MessageList
  },

  data () {
    return {
      // 状态控制
      pagestatus: {
        // 组件重加载控制
        reload: true
      },

      // 英烈寄语
      formdata: {
        // 是否显示真实姓名
        showmyname: '1',

        // 寄语
        message: ''
      },

      // 数据存放
      data: {
        martyrInfo: {}
      },

      // 敏感词
      filterChecker: /毛泽东|习近平/
    }
  },

  computed: mapState({
    areaCode (state) {
      if (state.localData.mapCityData.district && state.localData.mapCityData.district.area_code) {
        return state.localData.mapCityData.district.area_code
      }

      if (state.localData.mapCityData.city && state.localData.mapCityData.city.area_code) {
        return state.localData.mapCityData.city.area_code
      }

      if (state.localData.mapCityData.province && state.localData.mapCityData.province.area_code) {
        return state.localData.mapCityData.province.area_code
      }
    }
  }),

  watch: {
    // 监听ID 变化
    '$route.query.id' () {
      this.pagestatus.reload = false

      setTimeout(() => {
        this.formdata.message = ''
        this.formdata.showmyname = '1'

        this.pagestatus.reload = true
      }, 500)
    }
  },

  mounted () {

  },

  methods: {
    // 烈士详情加载
    F_loadMartyrInfo (martyr) {
      // console.log('烈士信息', martyr)
      this.data.martyrInfo = martyr
      this.$refs.messagelist.F_setMartyr(martyr)

      this.$refs.messagelist.F_loadData()
    },

    // 滚动加载
    F_scrollLoad () {
      this.$refs.messagelist.F_loadData()
    },

    // 提交留言
    F_submitMessage () {
      this.$refs.sform.validate().then(async () => {
        this.$Common.showLoading(true)

        const data = await this.$Api.mourn.sendWord({
          hideName: this.formdata.showmyname === '1',
          sendWords: this.formdata.message,
          martyrCode: this.$refs.header.detail.martyrCode,
          areaCode: this.areaCode
        })

        this.$Common.showLoading(false)

        if (data.code === 2000) {
          this.formdata.showmyname = '1'
          this.formdata.message = ''
          this.$toast('提交成功')
          this.$refs.messagelist.F_reset()
          return
        }

        this.$toast('提交失败')
      }).catch((msg) => {
        this.$toast(msg[0].message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;
  position: relative;

  .input-wishesmessage{
    border: 1PX solid #E7E7E7;
  }

  .large-title{
    font-size: 20px;
    font-weight: bold;
  }
}
</style>

<style>

</style>
