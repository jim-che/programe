<template>
  <div class="user">
    <!--搜索-->
    <search-form
      :search-items="searchItems"
      :label-width="66"
      :disabled="loading"
      @search="onSearch"
    />
    <!--表格-->
    <div style="margin-top: 30px;" v-loading="loading">
      <div>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="
            () => {
              $router.push('/sys/user/add');
            }
          "
          >新增用户</el-button
        >
      </div>
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        :height="400"
        border
        style="width: 100%; margin-top: 10px;"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="Username" label="用户名"> </el-table-column>
        <el-table-column prop="UserId" label="UserId" min-width="200">
        </el-table-column>
        <el-table-column prop="Name" label="真实姓名"> </el-table-column>
        <el-table-column prop="Status" label="账号状态">
          <template #default="scope">
            <el-tag :type="statusListStyle[scope.row.Status]">
              {{ statusList[scope.row.Status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ExpireTime" label="登录有效时间">
          <template #default="scope"> {{ scope.row.ExpireTime }}分钟 </template>
        </el-table-column>
        <el-table-column prop="Email" label="邮箱" min-width="150">
        </el-table-column>
        <el-table-column prop="Phone" label="电话" width="120">
        </el-table-column>
        <!-- <el-table-column
          prop="Role"
          width="200"
          label="权限">
          <template #default="scope">
            <template v-if="scope.row.Name === 'admin'">
              <el-tag type="success">超级管理员</el-tag>
            </template>
            <template v-else>
              <div class="roleList">
                <el-tag 
                  v-for="item in scope.row.Role"
                  :key="item.name">
                  {{item.label}}
                </el-tag>
              </div>
            </template>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" width="90" label="操作">
          <template #default="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="text"
                  >操作选项<i class="el-icon-arrow-down el-icon--right"></i
                ></el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <!-- <el-dropdown-item>
                    <span @click="toDetail('view', scope.row)"><i class="el-icon-view"></i> 查看</span>
                  </el-dropdown-item> -->
                  <el-dropdown-item>
                    <span @click="toDetail('edit', scope.row)"
                      ><i class="el-icon-edit"></i> 编辑</span
                    >
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <span><i class="el-icon-refresh"></i> 重置密码</span>
                  </el-dropdown-item> -->
                  <el-dropdown-item>
                    <span
                      v-if="
                        Username != scope.row.Username &&
                          scope.row.Username !== 'admin'
                      "
                      @click="dropUser(scope.row)"
                      ><i class="el-icon-delete"></i>删除</span
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页-->
      <!-- <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
// import api from "@/api/user";
export default {
  computed: {
    Username() {
      return this.$store.state.userInfo.user.Username;
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableData_source: [],
      statusList: ["未知", "停用", "正常"],
      statusListStyle: ["warning", "info", "success"],
      // 查询表单
      searchItems: [
        { name: "Username", label: "用户名" },
        // {name: 'Name', label: '真实姓名'},
        { name: "Email", label: "邮箱" },
        { name: "Phone", label: "电话" },
        {
          name: "Status",
          label: "账号状态",
          type: "select",
          defaultValue: 2,
          dicData: [
            { label: "启用", value: 2 },
            { label: "停用", value: 1 }
          ]
        }
      ],
      searchFrom: {
        Status: 2
      },
      total: 10,
      pageSize: 5,
      currentPage: 1
    };
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    indexMethod(index) {
      return 1 + index + (this.currentPage - 1) * this.pageSize;
    },
    dropUser(row) {
      let that = this;
      that
        .$confirm(`将删除 ${row.Username} , 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.loading = true;
          api
            .userDelete(row.Username)
            .then(res => {
              that.loading = false;
              that.$message({
                message: res.msg,
                type: "success"
              });
              that.onSearch(false, true);
            })
            .catch(err => {
              that.loading = false;
              that.$message({
                message: err.msg,
                type: "warning"
              });
            });
        });
    },
    toDetail(mode, row) {
      // let Role = row?.Role ? JSON.parse(row.Role) : []
      if (row.Role) row.Role = Role;
      let data = JSON.stringify(row);
      this.$router.push({
        name: "user-add",
        params: { mode, data }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSearch();
    },
    // onSearch(form, renew) {
    //   form ? (this.searchFrom = form) : "";
    //   if (form) {
    //     this.currentPage = 1;
    //   }
    //   if (this.tableData_source.length > 0 && !renew) {
    //     this.localFilter();
    //     return;
    //   }
    //   // this.loading = true;
    //   api
    //     .getUsetlist({
    //       ...this.searchFrom,
    //       pageSize: this.pageSize,
    //       currentPage: this.currentPage
    //     })
    //     .then(res => {
    //       this.loading = false;
    //       // this.tableData_source = res?.data?.users || [];
    //       // this.total = res?.data?.users.length || 0;
    //       this.localFilter();
    //     })
    //     .catch(err => {
    //       this.loading = false;
    //       this.$message({
    //         message: err.msg,
    //         type: "warning"
    //       });
    //     });
    // },
    localFilter() {
      let that = this;
      let keys = Object.keys(that.searchFrom);
      let filter = false;
      keys.forEach(item => {
        if (
          that.searchFrom[item].toString().replace(/(^\s*)|(\s*$)/g, "") != ""
        ) {
          filter = true;
        }
      });
      if (!filter) {
        that.tableData = that.tableData_source;
        return;
      }
      that.tableData = that.tableData_source.filter(item => {
        let counut = 0;
        for (let key in that.searchFrom) {
          let str = String(that.searchFrom[key]);
          let val = String(item[key]);
          if (str === val || val.indexOf(str) >= 0) counut += 1;
        }

        if (counut === keys.length) return item;
      });
    }
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 12px;
  text-align: right;
}
.roleList {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.roleList .el-tag {
  margin-left: 3px;
}
.roleList .el-tag:first-child {
  margin-left: 0;
}
</style>
