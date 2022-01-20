<template>
  <div class="c lineto-txtlr">
    <div class="input j-flex">
      <div class="listitem-avatar" :style="avatarStyle"></div>

      <div class="flex">
        <div class="listitem-username">{{ item.name }}</div>
        <div class="j-fc-gray listitem-message">
          {{ item.sendWords }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item'],

  computed: {
    avatarStyle () {
      return this.item.photo ? 'background-image:url(' + this.item.photo + ')' : ''
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.listitem-username{
  font-weight: bold;
  margin-bottom: 4px;
}

.listitem-avatar{
  width: 50px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(../../../../assets/img/ic_mrtx@3x.png);
  background-size: cover;
  border-radius: 50%;
  margin-right: 10px;
}

.listitem-message{
  font-size: 12px;
  line-height: 1.4;
}
</style>
