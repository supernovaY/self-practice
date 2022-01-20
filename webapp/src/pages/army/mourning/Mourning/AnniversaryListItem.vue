<template>
  <a class="c link lineto-txtlr" @click="F_jumpToDetail">
    <div class="input">
      <div class="j-flex j-flex-center">
        <div class="listtem-name">
          <div class="j-common-txtoverflow">{{ item.name }}</div>
        </div>
        <div class="listitem-tag">
          <div class="j-common-txtoverflow">{{ item.remembranceLevel }}</div>
        </div>
      </div>

      <div class="j-flex j-flex-center listitem-subinfo">
        <div class="listitem-icon">
          <span class="fas fa-map-marker-alt"></span>
        </div>
        <div>
          {{ item.address }}
        </div>
      </div>

      <div class="j-flex j-flex-center listitem-subinfo">
        <div class="listitem-icon">
          <span class="far fa-clock"></span>
        </div>
        <div>
          建设时间：{{ item.buildYear }}
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: ['item'],

  methods: {
    // 触发跳转前 给自己传参 保留页面
    F_jumpToDetail () {
      // 一些keepalive的页面重置处理
      // this.$store.commit(
      //   'sendMultyPageParam',
      //   [
      //     { path: this.keepalive, data: { action: 'keepAlive' } }
      //   ]
      // )
      this.$Common.keepAliveMark()

      this.$router.push('/army/mourning/anniversarydetail' + this.$Common.KhttpBuildQuery({ id: this.item.id }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.listtem-name{
  font-size: 16px;
  font-weight: bold;
}

.listitem-icon{
  margin-right: 4px;
  width: 16px;
}

.listitem-subinfo{
  margin-top: 8px;
  color: $--color-gray;
  font-size: 12px;
}

.listitem-tag{
  margin-left: 15px;
  font-size: 10px;
  color: #FE3116;
  background: #ffeae7;
  border-radius: 4px;
  padding: 0 10px;

  position: relative;

  &::before{
    content: ' ';
    display: block;
    position: absolute;
    left: 1px;
    top: 0;
    transform: translateY(6px) translateX(-100%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-right: 8px solid #ffeae7;
    border-bottom: 6px solid transparent;
  }
}
</style>
