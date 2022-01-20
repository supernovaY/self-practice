<template>
  <div class="listitem" @click="F_jumpToDetail">
    <div class="listitem-cover" :style="photo ? {'background-image':'url(' + photo + ')'} : ''">
      <div v-if="!photo" class="colorname" v-html="colorname"></div>
    </div>

    <div class="listitem-info">
      <div class="listitem-name">{{ item.name }} 烈士</div>
      <div class="listitem-year">{{ item.birthYear || '不详' }}-{{ item.sacrificeYear || '不详' }}</div>
    </div>

  </div>
</template>

<script>
export default {
  props: ['item'],

  computed: {
    // 烈士照片
    photo () {
      const photos = this.$Common.kJsonParse(this.item.photo)
      console.log(photos)
      return photos && photos.length > 0 ? photos[0] : ''
    },

    // 生成彩色文字
    colorname () {
      const list = this.item.name.split('')

      const colorList = ['#FE8516', '#ff4f1a', '#ff4e37', '#FE3116', '#FE8516', '#ff4f1a', '#ff4e37', '#FE3116']
      const strList = []

      list.map((item, index) => {
        const color = colorList[index]
        strList.push(`<div style="color:${color}">${item}</div>`)
      })

      return strList.join('')
    }
  },

  methods: {
    // 触发跳转前 给自己传参 保留页面
    F_jumpToDetail () {
      this.$Common.keepAliveMark()

      this.$router.push('/army/mourning/martyrdetail' + this.$Common.KhttpBuildQuery({ id: this.item.id }))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.listitem{
  width: 32%;

  &:nth-child(3n-1){
    margin: 0 2%;
  }

  .listitem-info{
    text-align: center;
    padding: 16px 0;
  }

  .listitem-name{
    margin-bottom: 10px;
    font-weight: bold;
  }

  .listitem-year{
    color: $--color-gray;
    font-size: 12px;
  }

  .listitem-cover{
    height: 120px;
    background: url(../../../../assets/img/mouring/img_lsbg@3x.png) no-repeat center;
    background-size: cover;
    position: relative;

    .colorname{
      position: absolute;
      right: 20px;
      top: 30px;
      font-weight: bold;
      width: 14px;
      height: 70px;
      overflow: hidden;
      font-size: 14px;
      line-height: 1.3;
      text-align: center;
    }
  }
}
</style>
