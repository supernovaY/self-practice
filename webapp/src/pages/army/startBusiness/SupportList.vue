<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-dropdown-menu active-color="#1492FF">
                  <van-dropdown-item ref="dropdownmenuarea" :title="selectedAreaName" @opened="F_searchLocation" />
                  <van-dropdown-item
                    :title="data.searchLabelShow.supportType"
                    v-model="searchdata.supportType"
                    :options="data.supportType"
                    @change="(value) => { F_changeDropmenuTitle(value, 'supportType') }"
                  />
                </van-dropdown-menu>
              </van-sticky>
            </div>
            <div class="searchbtn" @click="F_jumpToSearch">
              <span class="fas fa-search"></span>
            </div>
          </div>
          <div class="form-group nomargin-t">
            <SupportListItem
              v-for="(item,index) in data.list"
              :key="index"
              :article="item" />
          </div>
          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />
          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无数据" />
          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
    <CityPicker ref="citypicker" :cityLevel="1" @selected="F_selectCity" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CityPicker from '@/components/citypicker/CityPicker.vue'
import SupportListItem from './SupportListItem.vue'

export default {
  components: {
    CityPicker,
    SupportListItem
  },
  data () {
    return {
      selectedAreaName: '',
      pagestatus: { // 页面状态
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false // 无数据
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,
        areaCode: '',
        supportType: 0, // 全部
        keyword: '' // 标题关键字
      },
      data: { // 数据存放对象
        list: [], // 列表数据
        searchLabelShow: { // 标签显示
          supportType: '扶持类型'
        },
        supportType: [{ text: '全部', value: 0 }] // 扶持类型选项列表
      }
    }
  },
  computed: {
    ...mapState({
      userId () { // 老兵ID
        return this.armyInfo.id
      },
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      },
      Userinfo (state) { // 当前军人用户信息
        return state.localData.Userinfo
      },
      // 用户选择的当前城市信息
      userSelectCity (state) {
        return state.sessionData.userSelectCity
      },
      browerEnvStatus: 'browerEnvStatus' // 浏览器环境参数
    })
  },
  watch: {
    'searchdata.supportType' () { // 监听类型改变
      this.F_reset()
    }
  },
  activated () { // 子页面keepalive控制
    this.$store.commit('sendMultyPageParam', [
      { path: '/army/startbusiness/supportsearch', data: { action: 'reload' } }
    ])
  },
  mounted () {
    this.F_loadTypeList()
    // this.searchdata.userId = this.userId
    // this.searchdata.userType = this.armyInfo.type
    this.searchdata.areaCode = this.userSelectCity.area_code
    this.selectedAreaName = this.userSelectCity.area_name
    this.F_loadData()
  },
  methods: {
    async F_loadTypeList () { // 加载扶持类型列表
      const data = await this.$Api.common.category('SUPPORT_TYPE')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.supportType.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    F_changeDropmenuTitle (value, key) { // 修改下拉搜索选择标题
      let name = ''
      const datalist = this.data[key]
      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]
        if (value === item.value) {
          name = item.defaultname ? item.defaultname : item.text
          break
        }
      }
      this.data.searchLabelShow[key] = name
      this.searchdata[key] = value
    },
    F_urlJump (item) { // 消息跳转
    },
    F_jumpUrl (id) {
      this.$router.push('/army/startbusiness/supportdetail/' + id)
    },
    F_jumpToSearch () { // 跳转搜索页面
      this.$router.push('/army/startbusiness/supportsearch')
    },
    F_scrollLoad () { // 滚动加载
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }
      this.F_loadData()
    },
    F_reset () { // 重置列表
      this.data.list = []
      this.searchdata.start = 0
      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false
      this.F_loadData()
    },
    async F_loadData () { // 加载列表数据
      this.pagestatus.loading = true
      const searchdata = Object.assign({}, this.searchdata)
      if (searchdata.supportType === '') {
        delete searchdata.supportType
      }
      const data = await this.$Api.army.startup.getArmySupportList(searchdata)
      this.pagestatus.loading = false
      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }
      const list = data.result.records
      if (this.searchdata.start === 0 && (!list || list.length <= 0)) {
        this.pagestatus.nodata = true
        return
      }
      if (!list || list.length < this.searchdata.limit) {
        this.pagestatus.end = true
      }
      this.searchdata.start += this.searchdata.limit
      list.map(item => {
        this.data.list.push(item)
      })

      // setTimeout(() => {
      //   const tempdata = {
      //     id: 1,
      //     policyTitle: '省退役军人事务厅召开党史学习教育动员部署会',
      //     supportType: 1,
      //     policyLabel: '就业,财务'.split(','),
      //     createTime: '2021-5-10'
      //   }

      //   for (let i = 0; i < this.searchdata.limit; i++) {
      //     this.data.list.push(tempdata)
      //   }

      //   this.pagestatus.loading = false
      // }, 1000)
    },
    // 搜索地区
    F_searchLocation (citydata) {
      console.log(this.$refs.dropdownmenuarea)

      setTimeout(() => {
        this.$refs.dropdownmenuarea.toggle()
      }, 10)

      this.$refs.citypicker.F_show()
    },
    // 完成城市选择
    F_selectCity (citydata) {
      if (citydata[2] && citydata[2].area_code) {
        this.searchdata.areaCode = citydata[2].area_code
        this.selectedAreaName = citydata[2].area_name
      } else if (citydata[1] && citydata[1].area_code) {
        this.searchdata.areaCode = citydata[1].area_code
        this.selectedAreaName = citydata[1].area_name
      } else if (citydata[0] && citydata[0].area_code) {
        this.searchdata.areaCode = citydata[0].area_code
        this.selectedAreaName = citydata[0].area_name
      }
      this.F_reset()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.container {
  background: #fff;
}
.searchbtn {
  margin: 0 16px 0 100px;
  padding: 6px 20px;
  background: rgba(128, 141, 161, 0.1);
  border-radius: 17px;
  font-size: 14px;
}
.dropdownsearch .van-dropdown-menu ::v-deep .van-dropdown-menu__bar {
  box-shadow: none;
}
</style>
