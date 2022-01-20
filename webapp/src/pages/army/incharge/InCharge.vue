<template>
  <div>
    <ApplyForm />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ApplyForm from './ApplyForm.vue'

export default {
  components: {
    ApplyForm
  },
  data () {
    return {
      // 数据存放
      data: {}
    }
  },

  computed: mapState({
    GET: 'GET',
    Userinfo: 'armyInfo',
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {},

  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
