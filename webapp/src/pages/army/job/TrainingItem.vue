<template>
  <div class="list">
      <div class="li" @click="navDetail(detail.id)">
        <div class="text">
          <h3>{{detail.organizationName}} <i class="type">{{detail.organizationType}}</i></h3>
            <div class="info">
              <template v-if="detail.contacts && detail.contacts.length">
                <div class="item phone" v-for="(sub, index) in detail.contacts" :key="index">
                  <Common-PhoneCall :telephone="sub.contactPhone" />
                  <span class="name" v-if="sub.contactMan">（{{sub.contactMan}}）</span>
                </div>
              </template>
              <div class="item location">{{detail.address}}</div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      default () {
        return {}
      },
      required: true
    },
    type: {
      type: Number,
      default: 0 // '1'申请记录 '2'岗位收藏 '3'浏览记录
    }
  },
  data () {
    return {
      tags: []
    }
  },
  mounted () {
  },
  methods: {
    navDetail (id) {
      this.$router.push(`/army/job/trainingdetail/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.divideheight-8{
  height: 8px;
}

.list{
  &>.li{
    position: relative;
    padding: 16px;
    overflow: hidden;
    &:after{
      content: " ";
      display: block;
      height: 0.02667rem;
      position: absolute;
      background: #ebedf0;
      left:16px;
      right: 16px;
      bottom: 0;
      transform: scaleY(0.5);
      &:last-child:after{
        display: none;
      }
    }
    .text{
      h3{
        position: relative;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0;
        padding: 0 60px 10px 0;
        line-height: 1.5;
        font-size: 18px;
        font-weight: normal;
        .type{
          position: absolute;
          right: 0;
          top: 5px;
          font-size: 12px;
          font-style: normal;
          color: $--color-menugray;
        }
      }
      .item {
        font-size: 12px;
        color: #808DA1;
        padding:4px 0 4px 18px;
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: left 3px;
        line-height: 1.25;
      }
      .phone {
        background-image: url("../../../assets/img/businessstart/ic_phone_l@3x.png");
      }
      .location {
        background-image: url("../../../assets/img/businessstart/ic_dw@3x.png");
      }
    }
  }
}
</style>
