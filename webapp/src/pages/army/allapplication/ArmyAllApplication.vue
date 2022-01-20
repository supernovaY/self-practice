<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />

          <div class="j-m">
            <div>
              <div class="j-flex j-flex-center lh-26">
                <div class="mr-8">
                  <span class="fz-22 j-fc-deepgray"
                    >常用应用</span
                  >
                </div>

                <div class="j-fc-gray flex">
                  <span v-if="pagestatus.editControll.editMode">
                    拖动调整位置与排序
                  </span>
                </div>

                <div>
                  <span
                    v-if="!pagestatus.editControll.editMode"
                    @click="pagestatus.editControll.editMode = true"
                    class="j-fc-blue"
                    >编辑</span
                  >

                  <span
                    v-if="pagestatus.editControll.editMode"
                    class="j-fc-red"
                    @click="F_finishEdit"
                    >完成</span
                  >
                </div>
              </div>

              <Common-PageDevideHeight />

              <!-- 常用菜单 -->
              <MenuOrderEditor
                :menudata="data"
                :controll="pagestatus.editControll"
                @del="F_delItem"
              />
            </div>

            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <div class="j-flex j-flex-center lh-26">
              <div class="mr-8">
                <span class="j-fc-deepgray fz-22"
                  >其他应用</span
                >
              </div>
            </div>

            <Common-PageDevideHeight />

            <!-- 其他菜单 -->
            <OtherApplication
              :menudata="data"
              :controll="pagestatus.editControll"
              @add="F_addItem"
            />
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
        </div>

        <Common-PageFooter />

        <!-- 兼容ios 不触发滚动 -->
        <div v-show="pagestatus.hideScrollPatch" style="height: 100vh;"></div>
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuOrderEditor from './MenuOrderEditor.vue'
import OtherApplication from './OtherApplication.vue'

export default {
  components: {
    MenuOrderEditor,
    OtherApplication
  },

  data () {
    return {
      // 状态管理
      pagestatus: {
        // 编辑模式控制
        editControll: {
          editMode: false
        },

        // ios兼容滚动处理
        hideScrollPatch: true
      },

      // 数据存放
      data: {
        // 最多可添加数量
        maxCount: 11,

        // 关系对象
        linkObject: {},

        // 所有菜单
        allmenulist: [],

        // 其他菜单
        othermenu: [],

        // 常用菜单
        menulist: []
      }
    }
  },

  computed: mapState({
    // 用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    },

    // 当前军人信息
    armyInfo (state) {
      return state.localData.armyInfo
    },

    // 代持军人列表信息
    armyList (state) {
      return state.localData.armyList
    },

    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv',

    // 地图定位信息
    mapLocation (state) {
      return state.localData.mapLocation
    },

    // 用户选择的城市信息
    userSelectCity () {
      return this.$store.getters.userSelectCity
    }
  }),

  watch: {
    'pagestatus.hideScrollPatch' () {
      setTimeout(() => {
        this.pagestatus.hideScrollPatch = false
      }, 300)
    }
  },

  mounted () {
    this.F_loadMenuData()
  },

  methods: {
    // 加载我的菜单数据
    async F_loadMenuData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.getMyApplication({
        userId: this.armyInfo.id,
        appAreaCode: this.userSelectCity.area_code,
        authorityType: this.browerEnv,
        userType: this.armyInfo.type
      })

      this.$Common.showLoading(false)

      data.result.apps.map((item, index) => {
        item.touchmoveactive = false
        item.index = index

        this.data.allmenulist.push(item)

        if (item.active === 1) {
          // 常用应用
          this.data.menulist.push(item)
        } else {
          // 其他应用
          this.data.othermenu.push(item)
        }
      })

      // 初始化菜单数据
      this.data.linkObject = this.$Common.karrayGet(this.data.menulist, 'id')

      setTimeout(() => {
        this.pagestatus.hideScrollPatch = false
      }, 200)
    },

    // 添加常用菜单
    F_addItem (data) {
      // console.log('添加常用菜单', data)

      const max = this.data.maxCount

      if (this.data.menulist.length >= max) {
        this.$toast('最多可添加' + max + '个常用应用')
        return
      }

      const delItem = this.data.othermenu.splice(data.index, 1)
      this.data.menulist.push(delItem[0])

      this.pagestatus.hideScrollPatch = true
    },

    // 确认编辑完成
    async F_finishEdit () {
      this.$Common.showLoading(true)

      const appIds = []

      this.data.menulist.map((item) => {
        appIds.push(item.id)
      })

      const data = await this.$Api.army.sortMyApplication({
        userId: this.armyInfo.id,
        areaCode: this.userSelectCity.area_code,
        userType: this.armyInfo.type,
        appIds: appIds
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.pagestatus.editControll.editMode = false

        // 告诉首页 需要重新加载常用应用
        this.$store.commit(
          'sendPageParam',
          { path: '/', data: { action: 'updateMyApplication' } }
        )
        return
      }

      this.$toast('应用修改保存失败')
    },

    // 删除常用
    F_delItem (data) {
      // console.log('删除常用菜单', data)
      this.pagestatus.hideScrollPatch = true

      const delItem = this.data.menulist.splice(data.index, 1)
      this.data.othermenu.push(delItem[0])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.mr-8 {
  margin-right: 8px;
}

.lh-26 {
  line-height: 26px;
}

.fz-22 {
  font-size: 22px;
}

.container {
  background: #fff;
}
</style>
