<template>
  <div class="c lineto-txt">
    <div class="input">
      <div class="title">
        服务编号：{{ service.code }}
      </div>

      <div class="divideheight-8"></div>

      <div class="j-flex">
        <div
          class="imgcover"
          :style="{'background-image': 'url(' + service.icon + ')'}"></div>

        <div class="flex">
          <div class="j-common-txtoverflown title">
            {{ service.name || '' }}
          </div>

          <div class="divideheight-8"></div>

          <div>
            <div
              v-for="(labelItem,labelIndex) in service.label"
              :key="labelIndex"
              class="label-container">
              <van-tag
                type="primary"
                size="large"
                color=" rgba(128,141,161,0.10)"
                text-color="#808DA1"
                >{{ labelItem }}</van-tag
              >
            </div>
          </div>

          <div class="j-fc-gray">
            {{ service.createTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    service: {
      type: Object,
      default () {
        return {}
      },
      required: true
    }
  },

  data () {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.title{
  font-size: 14px;
}

.imgcover{
  width: 88px;
  height: 64px;
  margin-right: 8px;
  border-radius: 4px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.divideheight-8{
  height: 8px;
}

.van-tag--large {
  font-size: 12px;
}
</style>
