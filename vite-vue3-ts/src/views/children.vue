<script setup lang="ts">
import Home from './Home.vue'

const parentClick = (params: string)=>{
  console.log(params);
}
</script>

<template>
<Home @on-hh="parentClick"></Home>
</template>

<style scoped>

</style>
