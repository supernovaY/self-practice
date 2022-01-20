<template>
  Home.vue组件
  <p>{{name.msg.type}}</p>
  <el-button @click="parentClick"></el-button>
  <br />
  <button @click="jump">跳转Vuex页面</button>
</template>

<script lang="ts">
import {ref} from 'vue'
export default {
  name: 'ygm',
  setup(){
    let name = ref({
      msg:{
        type: 'String',
      }
    })
      function parentClick (){
        name.value.msg.type = 'hi'
      }
    return {
      name,
      parentClick
    }
  }
}


</script>
