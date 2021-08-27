<template>
  <div class="goodlist">
    <div class="tools">
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
    </div>
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
        prop="ProductTypeName"
        label="品类"
        width="120">
      </el-table-column>
      <el-table-column
        prop="Uuid"
        label="uuid"
        width="200">
      </el-table-column>
      <el-table-column
        prop="Price1"
        label="价格1"
        width="120">
      </el-table-column>
      <el-table-column
        prop="Price2"
        label="价格2"
        width="120">
      </el-table-column>
      <el-table-column
        prop="Price3"
        label="价格3"
        width="120">
      </el-table-column>
      <el-table-column
        prop="BrandName"
        label="品牌"
        width="120">
      </el-table-column>
      <el-table-column
        prop="OperationManual"
        label="操作手册链接"
        width="120">
        <template #default="scope">
          <a v-if="scope.row.OperationManual" :href="scope.row.OperationManual" target="_blank">点击打开</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="ProductFeature"
        label="产品特色链接"
        width="120">
        <template #default="scope">
          <a v-if="scope.row.ProductFeature" :href="scope.row.ProductFeature" target="_blank">点击打开</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="Specification"
        label="规格书链接"
        width="120">
        <template #default="scope">
          <a v-if="scope.row.Specification" :href="scope.row.Specification" target="_blank">点击打开</a>
        </template>
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
import api from "@/api/Goodslist";
import apiGoodsType from "@/api/GoodsType";

export default {
  data() {
    return {
      goodsType: [],
      tableData: [],
      loading: false,
      CurrentPage: 1,
      PageSize: 10,
      ProductTypeId: '',
      ProductTypeName: '',
    };
  },
  mounted() {
    this.getList();
    if (this.goodsType.length === 0) {
      this.getGoodsTypeList()
    }
  },
  methods: {
    chosed(row) {
      // 这里注册了一个事件回传选择的row.
      this.$emit('choseGoods', row)
    },
    clear() {
      this.ProductTypeName = ''
      this.ProductTypeId = ''
      this.getList()
    },
    selectGoodsType(uuid) {
      this.ProductTypeId = uuid
      this.getList()
    },
    getList() {
      let { CurrentPage, PageSize, ProductTypeId } = this
      this.loading = true
      api
        .getList({
          CurrentPage, PageSize, ProductTypeId
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
    getGoodsTypeList() {
      this.loading = true
      apiGoodsType
        .getList()
        .then(res => {
          this.loading = false
          this.goodsType = res?.data?.list || []
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