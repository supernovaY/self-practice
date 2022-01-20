<script>
import { defineComponent, reactive, getCurrentInstance } from 'vue'
import XLSX from 'xlsx';

export default defineComponent ({
  name: "RecordDepartGoods",
  setup(){

    const { proxy } = getCurrentInstance()

    let data = reactive({
      record_goods_value:[],
      xlsx_list: [],
      tab: [],
    })
    function addCostRow() {
      data.record_goods_value.push({});
    }
    // 删除费用行
    function delCost(index) {
      data.record_goods_value.splice(index, 1);
    }
    function importExcel(file) {
      const self = this;
      const types = file.name.split('.')[1];
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv', 'xlsm'].some(
        (item) => item === types,
      );
      if (!fileType) {
        proxy.$elMsg({
          type: 'info',
          message: '添加失败',
        });
        return;
      }
      file2Xce(file).then((tab) => {
        if (tab && tab.length > 0) {
          data.tab = tab;
          if (data.tab.length !== 0) {
            console.log(tab);
            data.tab[0].sheet.forEach((item) => {
              // console.log(item.indexOf("C") != -1)
              if (item.indexOf('') !== -1) {
                const inputInfo = item.split("'");// excel的数据类型都是text所以通过item.split("'")截取，拿到所以表的数据
                if (inputInfo.length === 2) {
                  data.xlsx_list.push(inputInfo[1]);
                  console.log(self.xlscList)
                  console.log(self.xlsx_list)
                }
              }
            });
          }
          if (data.xlsx_list.length !== 0) {
            setInputToForm();
          }
        }
      });
    }
// 对组进行切割
    function setInputToForm() {
      if (data.xlsx_list.length >= 7) { // 判断表头的长度
        /*
        * 将一个数组分成几个同等长度的数组
        * array[分割的原数组]
        * size[每个子数组的长度]
        */
        data.xlsx_list = data.xlsx_list.slice(7);
        // console.log()
        const result = [];
        const thisList = data.record_goods_value;
        for (let x = 0; x < Math.ceil(data.xlsx_list.length / 7); x++) {
          const start = x * 7;
          const end = start + 7;
          result.push(data.xlsx_list.slice(start, end));
        }
        // console.log(result)
        // 获取每一个数组的第一个，第二个，第三个...通过push重新拼装成一个新的数组对象
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].length; j++) {
            if (j === 0) {
              thisList.push({
                fba: result[i][j],
                forwarder: result[i][j + 1],
                product: result[i][j + 2],
                sku: result[i][j + 3],
                the_store: result[i][j + 4],
                site: result[i][j + 5],
                containernumber: result[i][j + 6],
              });
            }
          }
        }
      } else {
        window.alert('上传失败');
      }
    }
    function file2Xce(file) {
      return new Promise(((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: 'binary',
          });
          const result = [];
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName,
              sheet: XLSX.utils.sheet_to_formulae(this.wb.Sheets[sheetName]),
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file.raw);
      }));
    }
    function confirmPost() {
      if (data.record_goods_value.length === 0) {
        proxy.$elMsg.error('内容不能为空！');
      } else {
        proxy.$elMsgBox.confirm(
          '确定录入发货数据',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
          }
        )
          .then(() => {
            proxy.$axios.post('/post',JSON.stringify(data.record_goods_value)
            ).then(res=>{
              if(res.data.code !== 200){
                return proxy.$elMsg({
                  type: 'error',
                  message: '提交失败！',
                })
              }
              proxy.$elMsg({
                type: 'success',
                message: '提交成功',
              })
            })
            data.record_goods_value = []
          })
          .catch(() => {
            proxy.$elMsg({
              type: 'info',
              message: '取消提交',
            })
          })
    }
    }
    return {
      addCostRow,data,
      delCost,importExcel,file2Xce,confirmPost
    }
    }
})
</script>

<template>
  <el-upload ref="upload" action="/" :show-file-list="false" :on-change="importExcel" :auto-upload="false">
    <el-button class="d2-mt-10 d2-mb-10" slot="trigger" icon="el-icon-upload" type="primary">上传发货数据表格</el-button>
  </el-upload>
    <el-table
      highlight-current-row
      :data="data.record_goods_value"
      height="50vh"
      max-height="50vh"
      stripe
      border
      resizable
    >
        <template #empty>
          <div>暂无数据，
            <el-button @click="addCostRow" type="text" size="small" style="font-size:14px;">新增行</el-button>
          </div>
        </template>
        <el-table-column label="FBA箱唛">
          <template #="scope">
            <el-input placeholder="请输入FBA箱唛" v-model="scope.row.fba"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="货代箱麦">
          <template #=scope>
            <el-input placeholder="请输入货代箱麦" v-model="scope.row.forwarder"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="产品条码">
          <template #="scope">
            <el-input placeholder="请输入产品条码" v-model="scope.row.product"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="sku">
          <template #="scope">
            <el-input placeholder="请输入sku" v-model="scope.row.sku"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="店铺">
          <template #="scope">
            <el-input placeholder="请输入店铺" v-model="scope.row.the_store"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="站点">
          <template #="scope">
            <el-input placeholder="请输入站点" v-model="scope.row.site"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="箱数">
          <template #="scope">
            <el-input placeholder="请输入箱数" v-model="scope.row.containernumber"></el-input>
        </template>
        </el-table-column>
      </el-table>
    <el-button type="success" @click="addCostRow">新增费用行</el-button>
    <el-button type="primary" @click="confirmPost">提交表格</el-button>
</template>

<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  height: 10vh;
  align-items: center;
}
</style>
