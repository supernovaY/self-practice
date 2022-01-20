<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="j-fullcontent">
          <div class="map-container">
            <div class="map-searchbox">
              <van-search
                v-model="searchKeyword"
                clearable
                placeholder="请输入搜索关键词"
                @search="F_search"
                show-action
              >
                <template #action>
                  <van-button class="searchbtn" type="info" size="small" @click="F_search" plain>搜索</van-button>
                </template>
              </van-search>
            </div>

            <MapService ref="mapservice" width="100%" height="100%" />
          </div>
        </div>

        <div
          v-show="searchResult.length > 0"
          class="resultcontainer"
        >
          <div class="j-fullscrollcontent">
            <div class="form-group nomargin-t nomargin-t">
              <a
                v-for="(item,index) in searchResult"
                :key="index"
                class="c lineto-txt noborder"
                @click="F_selectPosition(index)"
              >
                <div class="input addon j-flex j-flex-center">
                  <div class="j-fc-blue location-icon">
                    <span class="fas fa-map-marker-alt"></span>
                  </div>

                  <div class="flex">
                    <div class="name">{{ item.name }}</div>
                    <div class="address j-fc-gray">{{ item.address }}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </template>

      <template #bottom>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import MapService from './MapService.vue'

export default {
  components: {
    MapService
  },

  data () {
    return {
      // 状态控制
      pagestatus: {
        showResult: true
      },

      // 搜索关键词
      searchKeyword: '',

      // 搜索结果
      searchResult: [],

      // 初始化数据
      initOption: {}
    }
  },

  methods: {
    // 设置默认搜索内容
    F_setDefaultKeyWord (keyword) {
      this.searchKeyword = keyword
      this.F_search()
    },

    // 选择触发事件
    F_selectPosition (index) {
      // 经纬度转换 GPS数据
      this.searchResult[index].serverData = this.$refs.mapservice.F_toServerData(
        this.searchResult[index].lng,
        this.searchResult[index].lat
      )

      this.$emit('select', this.searchResult[index])
    },

    // 获取中心位置数据
    F_getData () {
      return this.$refs.mapservice.F_getMapCenter()
    },

    // 初始化
    F_init (option) {
      this.initOption = option

      // console.log('地图初始化参数', option)

      // 是否传了 中心位置设置
      if (option.lng && option.lat) {
        // console.log('设置中心', option)

        this.$refs.mapservice.F_setMapCenter(option.lng, option.lat)
        this.$refs.mapservice.F_addMark(option.lng, option.lat)
      }
    },

    // 搜索地图关键词
    async F_search () {
      this.$Common.showLoading(true)

      this.$refs.mapservice.F_searchKeyword(this.searchKeyword, (searchResult) => {
        console.log('地区搜索结果', searchResult)
        this.$refs.mapservice.F_clearMap()

        this.searchResult = searchResult || []

        this.searchResult.map((item) => {
          this.$refs.mapservice.F_addMark(item.lng, item.lat, {
            title: item.name,
            label: item.name
          }, true)
        })

        if (this.searchResult.length > 0) {
          const firstResult = this.searchResult[0]
          this.$refs.mapservice.F_setMapCenter(firstResult.lng, firstResult.lat, true)
        }

        this.$Common.showLoading(false)
      })

      // console.log('搜索地址结果', this.searchResult)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container{
  width: 100%;
  height: 100%;
  position: relative;
}

.map-searchbox{
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;

  .searchbtn{
    border: 1px solid #1989fa;
  }

  .van-search--show-action .van-button--small{
    height: 32px;
  }
}

.resultcontainer{
  position: absolute;
  z-index: 161;
  left: 16px;
  right: 16px;
  bottom: 5%;
  height: 40%;
  background: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(20, 146, 255, 0.16);
  border-radius: 4px;
  padding: 0;
  overflow: hidden;

  .location-icon{
    font-size: 20px;
    margin-right: 10px;
  }

  .name{
    font-size: 16px;
  }
}
</style>
