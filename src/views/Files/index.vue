<template>
  <div class="GoodsSuit">
    <el-table border v-loading="loading" :data="tableData" style="width: 100%;">
      <el-table-column type="index" label="序号" style="width: 10%;">
      </el-table-column>
      <el-table-column prop="Uuid" label="文件ID" style="width: 15%;">
      </el-table-column>
      <el-table-column prop="Title" label="title" style="width: 15%;">
      </el-table-column>
      <el-table-column label="缩略图" style="width: 15%;">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.Link.replace(/\.[\w\d_-]+$/i, '_100px.jpg')"
            :fit="fit"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="Link" label="链接" style="width: 15%;">
        <template #default="scope">
          <el-link type="primary" :href="scope.row.Link">{{
            scope.row.Link
          }}</el-link>
          <!-- <el-link type="primary" :href="scope.row.Link.replace(/\.[\w\d_-]+$/i, '_100px.jpg')">缩略文件</el-link>
          <br>
          <el-link type="primary" :href="scope.row.Link.replace(/(\.[\w\d_-]+)$/i, '_marked$1')">水印文件</el-link> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="Description"
        label="description"
        style="width: 15%;"
      >
      </el-table-column>
      <el-table-column fixed="right" label="操作" style="width: 15%;">
        <template #default="scope">
          <el-button type="primary" @click="view(scope)">查看</el-button>
          <el-button type="primary" @click="edit(scope)">修改</el-button>
          <el-button type="danger" @click="remove(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-size="PageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :pager-count="5"
        v-bind:total="TotalPageSize"
        :current-page="CurrentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import api from "@/api/File";

export default {
  data() {
    return {
      loading: false,
      CurrentPage: 1,
      TotalPageSize: 100,
      PageSize: 10,
      tableData: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSizeChange(value) {
      this.PageSize = value;
      this.CurrentPage = 1;
      this.getList();
    },
    handleCurrentChange(value) {
      this.CurrentPage = value;
      this.getList();
    },
    getList() {
      // let { CurrentPage, PageSize } = this;
      // // this.loading = true;
      // api
      //   .getList({ CurrentPage, PageSize })
      //   .then(res => {
      //     this.loading = false;
      //     ("this.tableData = res?.data?.list || [];");
      //     // this.TotalPageSize = res?.data?.total;
      //   })
      //   .catch(err => {
      //     this.loading = false;
      //     console.log("-----fail----", err);
      //   });
      const _this = this;
      _this.loading = true;
      let { CurrentPage, PageSize } = this;
      _this.$axios
        .post("/api/file/list", { CurrentPage, PageSize })
        .then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.TotalPageSize = res.data.total;
          }
        })
        .catch(err => {
          this.loading = false;
          console.log("-----fail----", err);
        });
    },
    edit(scope) {
      this.$router.push({
        name: "fileUpload",
        params: {
          mode: "edit",
          data: JSON.stringify(scope.row)
        }
      });
    },
    view(scope) {
      this.$router.push({
        name: "fileUpload",
        params: {
          mode: "view",
          data: JSON.stringify(scope.row)
        }
      });
    },
    remove(scope) {
      this.$confirm(
        `将删除【${scope.row.Filename}】并且不可恢复, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.loading = true;
        api
          .delete({ Uuid: scope.row.Uuid, Filename: scope.row.Filename })
          .then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.$message.success(res.msg);
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.error(err.msg);
          });
      });
    }
  }
};
</script>

<style scoped></style>
