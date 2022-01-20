<script>
import { defineComponent, reactive, getCurrentInstance } from "vue";

export default defineComponent ({
  name: "DepartGoodsList",
  setup(){

    const { proxy } = getCurrentInstance()

    let data = reactive({
      date_value: [],
    })
    function getData(){
      proxy.$axios.get('get').then(res => {
        data.date_value = res.data.data
          proxy.$elMsg({
              type: 'success',
              message: '获取成功！',
            })
          })
          .catch(() => {
            proxy.$elMsg({
              type: 'info',
              message: '取消提交',
            })
          })
    }
    function delRecord(index){
      proxy.$elMsgBox.confirm('确定删除数据？', '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
          }
      ).then(() => {
            let id = {
              id: data.date_value[index].id
            }
            proxy.$axios.post('del',
                proxy.$qs.stringify(id)
            ).then(res=>{
              if(res.data.code !== 200){
                return proxy.$elMsg({
                  type: 'error',
                  message: '提交失败！',
                })
              }
              proxy.$elMsg({
                type: 'success',
                message: '删除成功',
              })
            })
            window.location.reload()
          })
          .catch(() => {
            proxy.$elMsg({
              type: 'info',
              message: '取消删除',
            })
          })
    }
    getData()
    return {
      // 数据
      data,getData,delRecord
    }
  }
});
</script>

<template>
  <el-table
      highlight-current-row
      :data="data.date_value"
      height="60vh"
      max-height="60vh"
      stripe
      border
      resizable
  >
    <template #empty>
      <div>暂无数据</div>
    </template>
    <el-table-column prop="fba" label="FBA箱唛" />
    <el-table-column prop="forwarder" label="货代箱麦" />
    <el-table-column prop="product" label="产品条码" />
    <el-table-column prop="sku" label="sku" />
    <el-table-column prop="the_store" label="店铺" />
    <el-table-column prop="site" label="站点" />
    <el-table-column prop="containernumber" label="箱数" />
    <el-table-column prop="add_time" label="添加时间" />
    <el-table-column label="操作" >
      <template #="row">
        <el-button type="primary" size="mini" @click="delRecord(row.$index)">删除数据</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  height: 10vh;
  align-items: center;
}
</style>
