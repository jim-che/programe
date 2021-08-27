<template>
  <div class="goodlist">
    <el-table
      v-loading="loading"
      border
      height="300"
      :data="tableData"
      style="width: 100%;">
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="ProductTogetherInfo.ProductTogetherName"
        label="商品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="Products"
        label="套装内商品"
        width="300">
        <template #default="scope">
          <div style="margin: -6px 0 0 -6px;">
            <el-tag 
              style="margin: 6px 0 0 6px;"
              type="primary" 
              v-for="(item, index) in scope.row.Products"
              :key="'goods-' + index">
              {{item.ProductName}} * {{item.Quantity}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ProductTogetherInfo.Uuid"
        label="套装id"
        width="190">
      </el-table-column>
      <el-table-column
        prop="ProductTogetherInfo.Price1"
        label="价格1">
      </el-table-column>
      <el-table-column
        prop="ProductTogetherInfo.Price2"
        label="价格2">
      </el-table-column>
      <el-table-column
        prop="ProductTogetherInfo.Price3"
        label="价格3">
      </el-table-column>
      <el-table-column
        label="选择"
        width="80"
        fixed="right">
        <template #default="scope">
          <el-button type="primary" @click="chosed(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "@/api/GoodsSuit";

export default {
  data() {
    return {
      loading: false,
      CurrentPage: 1,
      PageSize: 10,
      tableData: []
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    chosed(row) {
      // 这里注册了一个事件回传选择的row.
      this.$emit('choseGoods', row)
    },
    getList() {
      let { CurrentPage, PageSize } = this
      this.loading = true
      api
        .getList({
          CurrentPage, PageSize
        })
        .then(res => {
          this.loading = false
          this.tableData = res?.data?.list || []
        })
        .catch(err => {
          this.loading = false
          console.log('-----fail----', err)
        })
    },
  }
};
</script>


<style scoped>
  .tools {
    display: flex;
    align-items: center;
    margin: 0 0 12px 0;
  }
</style>