<template>
  <a class="c lineto-txt" @click="F_jumpUrl">
    <div class="input j-flex">
      <div class="flex">
        <div class="j-common-txtoverflown">
          {{ article.policyTitle || '' }}
        </div>

        <div class="divideheight-8"></div>

        <div>
          <div
            v-for="(labelItem,labelIndex) in policyLabel"
            :key="labelIndex"
            class="label-container">
            <van-tag
              type="primary"
              size="large"
              color=" rgba(128,141,161,0.10)"
              text-color="#808DA1"
            >
              {{ labelItem }}
            </van-tag>
          </div>
        </div>
      </div>

      <div class="datetext">
        {{ article.createTime || '' }}
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    article: {
      default () {
        return {}
      },
      required: true
    }
  },

  computed: {
    policyLabel () {
      return this.article.policyLabel ? this.article.policyLabel.split(',') : []
    }
  },

  methods: {
    // 跳转阅读详情
    F_jumpUrl () {
      this.$router.push('/army/policy/reader/' + this.article.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.divideheight-8{
  height: 8px;
}

.datetext{
  margin-left: 10px;
  color: #808DA1;
}

.van-tag--large {
  font-size: 12px;
}
</style>
