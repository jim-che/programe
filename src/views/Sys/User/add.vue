<template>
  <div class="user-add">
    <h3>{{ title }}</h3>
    <el-divider></el-divider>
    <div style="max-width: 400px;">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <!-- :rules="rules" -->
        <el-form-item label="用户名" prop="Username">
          <el-input
            :disabled="mode !== 'add'"
            v-model="form.Username"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select
            :disabled="mode === 'view'"
            v-model="form.Status"
            style="width: 100%;"
          >
            <el-option :value="2" label="启用"></el-option>
            <el-option :value="1" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名" prop="Name">
          <el-input
            :disabled="mode === 'view'"
            v-model="form.Name"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录有效时间" prop="ExpireTime">
          <div class="treeContain">
            <el-input
              :disabled="mode === 'view'"
              v-model="form.ExpireTime"
              maxlength="10"
            ></el-input>
            <span class="text">分钟</span>
          </div>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input
            :disabled="mode === 'view'"
            v-model="form.Email"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            :disabled="mode === 'view'"
            v-model="form.Phone"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="mode === 'add'" label="密码" prop="Password">
          <el-input
            :disabled="mode === 'view'"
            v-model="form.Password"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限分配" prop="Role">
          <div class="treeContain">
            <el-input
              :disabled="mode === 'view'"
              v-model="roleList"
              readonly
            ></el-input>
            <el-button
              :disabled="mode === 'view'"
              icon="el-icon-edit"
              style="margin-left: 10px;"
              @click="showTreepanel"
              >选择</el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="loading"
            >保存</el-button
          >
          <el-button
            :disabled="loading"
            @click="
              () => {
                $router.go(-1);
              }
            "
            >取消</el-button
          >
          <el-button
            v-if="mode !== 'add'"
            type="primary"
            :disabled="loading"
            @click="resetPSW"
            >重置密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="权限列表"
      v-model="dialogVisible"
      :width="panelWidth"
      @opened="showDefauleData"
    >
      <el-tree
        ref="tree"
        :data="menu"
        show-checkbox
        node-key="name"
        :props="defaultProps"
        :render-after-expand="false"
        @check-change="checkChange"
      >
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import api from "@/api/user";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["menu", "userInfo"]),
    title() {
      let obj = {
        add: "新增用户",
        edit: "修改用户信息",
        view: "查看用户信息"
      };
      return obj[this.mode];
    },
    panelWidth() {
      let clientWidth = document.body.clientWidth;
      return clientWidth > 800 ? "500px" : "80%";
    }
  },
  data() {
    // 邮箱校验
    const validateEmail = (rule, value, callback) => {
      // let reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
      if (!reg.test(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    // 电话校验
    const validatePhone = (rule, value, callback) => {
      let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("电话格式不正确"));
      } else {
        callback();
      }
    };
    // 数字校验
    const validateNumber = (rule, value, callback) => {
      let reg = /^[0-9]*$/;
      if (!reg.test(value)) {
        callback(new Error("请输入有效数字"));
      } else if (value > 2000 || value < 1) {
        callback(new Error("请输入1~2000(含边界)的数值"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      rules: {
        Username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        Name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
        Email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        Phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        Password: [{ required: true, message: "请设置密码", trigger: "blur" }],
        Role: [
          {
            required: true,
            message: "请分配权限, 否则无法正常访问系统",
            trigger: "change"
          }
        ],
        ExpireTime: [{ validator: validateNumber, trigger: "blur" }]
      },
      form: {
        Username: "",
        UserId: "",
        Name: "",
        Email: "",
        Phone: "",
        Password: "",
        Role: "",
        Status: 1,
        ExpireTime: 1
      },
      roleList: "",
      mode: "add",
      pageData: {},
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      treeSelected: [],
      init: true
    };
  },
  mounted() {
    this.pageInit();
  },
  methods: {
    // 权限树勾选事件
    checkChange(node, chosed, childChosed) {
      if (chosed || childChosed) {
        // 若勾选状态为true，直接添加选中
        let repeat = this.treeSelected.find(item => item.name === node.name);
        if (!repeat) {
          this.treeSelected.push({ ...node, half: childChosed ? true : false });
        }
      } else {
        // 若勾选状态为fale，直接从已选记录中删除
        let index = this.getArrayIndex(this.treeSelected, node);
        this.treeSelected.splice(index, 1);
      }
      let arr = this.treeSelected.map(item => item.label);
      this.roleList = arr.join(",");
      this.form.Role = this.treeSelected.map(item => ({
        ...item,
        children: []
      }));
    },
    // 获取下标
    getArrayIndex(arr, obj) {
      let i = arr.length;
      while (i--) {
        if (arr[i].name === obj.name) {
          return i;
        }
      }
      return -1;
    },
    // 载入已选
    showDefauleData() {
      if (!this.init) {
        return;
      }
      this.init = false;
      let arr = this.form.Role ? this.form.Role.filter(item => !item.half) : [];
      let nodes = arr.map(item => ({
        name: item.name
      }));
      this.$refs.tree.setCheckedNodes(nodes);
    },
    showTreepanel() {
      this.dialogVisible = true;
    },
    // 初始化详情数据
    // pageInit() {
    //   this.mode = this.$route.params?.mode || "add";
    //   // this.pageData = this.$route.params?.data ? JSON.parse(this.$route.params?.data) : {}
    //   if (this.mode !== "add") {
    //     for (let item in this.form) {
    //       if (item === "Role") {
    //         let str = this.pageData.Role.map(item => item.label);
    //         this.form[item] = this.pageData.Role;
    //         this.roleList = str.join(",");
    //       } else {
    //         this.form[item] = this.pageData[item];
    //       }
    //     }
    //   }
    // },
    // 重置密码
    resetPSW() {
      this.$confirm(`密码将重置为12345678 , 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          ...this.form,
          Password: "12345678",
          Role: JSON.stringify(this.form.Role || "")
        };
        this.loading = true;
        api
          .updateUser(params)
          .then(() => {
            this.loading = false;
            this.$message({
              message: "密码已重置为12345678",
              type: "success"
            });
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              message: err.msg,
              type: "warning"
            });
          });
      });
    },
    // 更新用户详情
    toUpdate() {
      let params = {
        ...this.form,
        UserId: this.form.UserId,
        ExpireTime: Number(this.form.ExpireTime || 0),
        Role: JSON.stringify(this.form.Role || "")
      };
      this.loading = true;
      api
        .updateUser(params)
        .then(res => {
          this.loading = false;
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.$router.go(-1);
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            message: err.msg,
            type: "warning"
          });
        });
    },
    // 新增用户
    onSubmit() {
      this.$refs.form.validate(pass => {
        if (pass) {
          if (this.mode === "edit") {
            this.toUpdate();
            return;
          }
          let params = {
            ...this.form,
            ExpireTime: Number(this.form.ExpireTime || 0),
            Role: JSON.stringify(this.form.Role || "")
          };
          this.loading = true;
          api
            .userAdd(params)
            .then(res => {
              this.loading = false;
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$router.go(-1);
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                message: err.msg,
                type: "warning"
              });
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.treeContain {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.treeContain .text {
  font-size: 12px;
  white-space: nowrap;
  margin-left: 12px;
}
</style>
