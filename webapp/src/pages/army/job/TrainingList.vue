<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="header">
            <h2>职业技能培训</h2>
            <router-link to="/army/job/socialtraining" class="link">社会培训 <i class="van-icon van-icon-arrow"></i></router-link>
          </div>
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-dropdown-menu
                  active-color="#1492FF">
                  <!-- 地区搜索 -->
                  <van-dropdown-item ref="dropdownmenuarea" :title="selectedAreaName" @opened="F_searchLocation" />
                  <!-- 机构性质排序搜索 -->
                  <van-dropdown-item :title="data.searchLabelShow.organizationType" @change="(value) => { F_changeDropmenuTitle(value, 'organizationType') }" v-model="searchdata.organizationType" :options="data.organizationType" />
                </van-dropdown-menu>
              </van-sticky>
            </div>
            <div
              class="searchbtn"
              @click="$router.push('/army/job/trainingsearch')">
              <span class="fas fa-search"></span>
            </div>
          </div>
          <Common-PageDevideHeight />
          <div class="form-group nomargin-t">
            <training-item v-for="(item,index) in data.list" :key="index" :detail="item" />
          </div>
          <!-- <div class="form-group nomargin-t">
            <ul class="list" v-if="data.list && data.list.length">
              <li @click="navDetail(item.id)" v-for="(item, index) in data.list" :key="index">
                <div class="text">
                  <h3>{{item.organizationName}} <i class="type">{{item.organizationType}}</i></h3>
                    <div class="info">
                      <template v-if="item.contacts && item.contacts.length">
                        <div class="item phone" v-for="(sub, index) in item.contacts" :key="index">
                          <Common-PhoneCall :telephone="sub.contactPhone" />
                          <span class="name" v-if="sub.contactMan">（{{sub.contactMan}}）</span>
                        </div>
                      </template>
                      <div class="item location">{{item.address}}</div>
                    </div>
                </div>
              </li>
            </ul>
          </div> -->
          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />
          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无消息" />
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
import TrainingItem from './TrainingItem.vue'
import CityPicker from '@/components/citypicker/CityPicker.vue'

export default {
  components: {
    TrainingItem,
    CityPicker
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
        organizationType: '', // 机构性质
        organizationName: '' // 机构名称
      },
      timeoutlist: [], // setTimeout任务队列 运行 则取消其他
      data: { // 数据存放对象
        list: [], // 列表数据
        searchHistory: [], // 搜索历史记录
        searchLabelShow: { // 标签显示
          organizationType: '机构性质'
        },
        organizationType: [{ text: '全部', value: '' }]
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
      userSelectCity (state) { // 用户选择的当前城市信息
        return state.sessionData.userSelectCity
      }
    })
  },
  mounted () {
    this.searchdata.areaCode = this.userSelectCity.area_code
    this.selectedAreaName = this.userSelectCity.area_name
    this.loadTrainingTypeOption()
    this.F_loadData()
  },
  methods: {
    F_waitRunLoad () { // 等待运行搜索委托
      if (this.pagestatus.loading) {
        this.timeoutlist.push(
          setTimeout(() => {
            this.F_waitRunLoad()
          }, 1000)
        )
        return
      }
      this.timeoutlist.map((item) => {
        clearTimeout(item)
      })
      this.timeoutlist = []
      this.F_reset()
      if (this.searchdata.keyword) {
        this.F_loadData()
      }
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
    async F_loadData () { // 加载消息数据
      this.pagestatus.loading = true
      const searchdata = Object.assign({}, this.searchdata)
      const data = await this.$Api.army.job.getJobTrainingList(searchdata)
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
      list.map((item) => {
        this.data.list.push(item)
      })
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
    },
    async loadTrainingTypeOption () { // 加载培训机构性质数据
      const data = await this.$Api.common.category('TRAINING_OGNZTION')
      if (data.code === 2000) {
        data.result.map((item, index) => {
          item.value &&
            this.data.organizationType.push({
              text: item.label,
              value: item.value
            })
        })
      }
    },
    // 修改下拉搜索选择标题
    F_changeDropmenuTitle (value, key) {
      let name = ''
      const datalist = this.data[key]

      for (let i = 0; i < datalist.length; i++) {
        const item = datalist[i]

        if (value === item.value) {
          name = item.text
          break
        }
      }

      this.data.searchLabelShow[key] = name
      this.searchdata[key] = value
    }
  },
  watch: {
    'searchdata.organizationType' () {
      this.F_reset()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #FFF;
  .header{
    position: relative;
    h2{
      position: relative;
      margin: 0;
      padding: 16px;
      font-size: 22px;
    }
    .link{
      position: absolute;
      top: 20px;
      right: 16px;
      color: $--color-primary;
      text-decoration: underline;
      .van-icon{
        vertical-align: middle;
      }
    }
  }
  .j-flex-center{
    border-bottom: 1px solid #E7E7E7;
  }
  ::v-deep .van-tab{
    font-size: 18px;
    color: #808DA1;
    line-height: 1;
    &.van-tab--active{
      font-size: 22px;
      color: #404956;
    }
  }
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
