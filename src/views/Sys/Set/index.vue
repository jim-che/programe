<template>
  <div class="reset" v-loading="loading">
    <el-button type="primary" icon="el-icon-office-building" @click="handelReset">立即重置</el-button>
  </div>
</template>

<script>
import api from "@/api/reset";
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handelReset() {
      this.loading = true
      this.$message.info('正在系统重置')
      api
        .resetApi()
        .then(() => {
          this.loading = false
          this.$message.success('系统重置')
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
        })
    },
  }
};
</script>

<style scoped>
  .reset {
    max-width: 600px;
  }
</style>