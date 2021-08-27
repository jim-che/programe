<template>
  <div class="login">
    <div class="login-box" :class="{ 'login-box-loaded': loaded }">
      <div class="login-logo">电商管理系统</div>
      <div class="login-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="60px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="ruleForm.username"
              size="small"
              placeholder="请输入账号"
              maxlength="12"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              size="small"
              placeholder="请输入密码"
              maxlength="20"
              show-password
              @keyup.enter="login"
            />
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button :disabled="loading" type="primary" @click="login"
              >登录 <i class="el-icon-right"></i
            ></el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import api from "@/api/user";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"]),
    permission() {
      return this.userInfo.user.Role.map(item => item.path);
    }
  },
  data() {
    return {
      loading: false,
      loaded: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true;
    }, 100);
  },
  methods: {
    login() {
      this.$refs.ruleForm.validate(pass => {
        if (pass === true) {
          this.loading = true;
          api
            .Login({
              username: this.ruleForm.username,
              password: this.ruleForm.password
            })
            .then(res => {
              // let Role = JSON.parse(res?.data?.user?.Role);
              // res?.data?.user?.Role ? (res.data.user.Role = Role) : "";
              // 登录成功
              sessionStorage.setItem("userInfo", JSON.stringify(res.data));
              this.$store.dispatch("createUserInfo", res.data);
              this.permission[0] && this.$router.push(this.permission[0]);
            })
            .catch(err => {
              setTimeout(() => {
                this.loading = false;
              }, 1500);
              this.$alert(err.msg, "登录提示", {
                confirmButtonText: "知道了"
              });
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(./img/bg.jpg) no-repeat center center;
  overflow: auto;
}
.login-box {
  width: 350px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 5px;
  box-shadow: 0 0 6px #919191;
  transition: 0.3s;
  opacity: 0;
  transform: translateY(-20px);
}
.login-box-loaded {
  opacity: 1;
  transform: translateY(0);
}
.login-logo {
  font-size: 20px;
  color: #333;
  text-align: center;
  padding: 20px 0;
}
.login-form {
  margin: 0 20px 12px 20px;
}
</style>
