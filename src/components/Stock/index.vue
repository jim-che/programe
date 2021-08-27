<template>
  <div class="goodlist">
    <!-- <div class="tools">
      <div class="treeChose">
        <el-select v-model="ProductTypeId" filterable placeholder="筛选分类" @change="selectGoodsType">
          <el-option
            v-for="item in goodsType"
            :key="item.Uuid"
            :label="item.Name"
            :value="item.Uuid">
          </el-option>
        </el-select>
        <el-button @click="clear" style="margin-left: 8px;">清空</el-button>
        <el-button :disabled="loading" icon="el-icon-refresh" @click="getList" style="margin-left: 8px;">刷新数据</el-button>
      </div>
    </div> -->
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
        prop="ProductName"
        label="商品名称"
        width="150">
      </el-table-column>
      <el-table-column
        prop="ProductId"
        label="uuid"
        width="200">
      </el-table-column>
      <el-table-column
        prop="Quantity"
        label="数量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="AvgPrice"
        label="平均单价"
        width="120">
      </el-table-column>
      <el-table-column
        prop="Price"
        label="总价"
        width="120">
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
import api from "@/api/Stock";

export default {
  props: ['warehouseId'],
  data() {
    return {
      tableData: [],
      loading: false,
      CurrentPage: 1,
      PageSize: 10,
    };
  },
  mounted() {
    this.getList();
  },
  watch: {
    warehouseId() {
      this.getList()
    }
  },
  methods: {
    chosed(row) {
      this.$emit('choseGoods', row)
    },
    getList() {
      let { CurrentPage, PageSize } = this
      let WarehouseIds = [this.warehouseId];
      this.loading = true
      api
        .getList({
          CurrentPage, PageSize, WarehouseIds
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