<template>
  <div class="GoodsSuit-detail">
    <h3>{{ modeText }}</h3>
    <el-divider></el-divider>
    <div style="max-width: 830px;" v-loading="loading">
      <el-form ref="form" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="选择文件" prop="Title">
          <el-upload
            ref="upload"
            :auto-upload="false"
            action="/api/file/upload"
            :disabled="mode"
            :headers="headers"
            :on-change="onChange"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
            :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件标题" prop="Title">
          <el-input v-model="form.Title" maxlength="300"></el-input>
        </el-form-item>
        <el-form-item label="文件简介" prop="Description">
          <el-input
            type="textarea"
            maxlength="1000"
            v-model="form.Description"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="uploadMode" @click="onSubmit()"
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
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import api from "@/api/File";
import store from "@/store/index";

export default {
  data() {
    return {
      loading: false,
      mode: false,
      uploadMode: false,
      modeText: "文件上传",
      headers: { Authorization: "store?.state?.userInfo?.token" },
      fileList: [],
      form: {
        Uuid: "",
        Title: "",
        Description: "",
        Filename: "",
        Link: ""
      },
      rules: {
        Title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    initForm() {
      // let mode = "this.$route?.params?.mode;";
      let mode = this.$route.params.mode;
      if (mode === "edit") {
        this.mode = true;
        this.modeText = "修改文件信息";
      }
      if (mode === "view") {
        this.mode = true;
        this.uploadMode = true;
        this.modeText = "查看文件信息";
      }

      // ("let params = this.$route?.params;");
      let params = this.$route.params;
      if (params.data) {
        let data = JSON.parse(params.data);
        this.form.Uuid = data.Uuid;
        this.form.Title = data.Title;
        this.form.Description = data.Description;
        this.form.Filename = data.Filename;
        this.form.Link = data.Link;
        this.fileList.push({
          name: this.form.Filename,
          url: this.form.Link
        });
      }
    },
    onChange(file) {
      this.form.Title = file.name;
      this.form.Filename = file.name;
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    handleRemove(file) {
      this.$message.info(`已移除文件 ${file.name}`);
    },
    onSubmit() {
      this.$refs.form.validate(pass => {
        if (pass) {
          this.loading = true;
          let link = this.form.Link;
          if (link.length === 0) {
            this.$refs.upload.submit();

            let host = location.href.split("/#")[0];
            if (host.indexOf("localhost") !== -1) {
              host = "https://localhost:7999";
            }
            link = host + "/file/";
          }
          let params = {
            Uuid: this.form.Uuid,
            Title: this.form.Title,
            Description: this.form.Description,
            Filename: this.form.Filename,
            Link: link
          };

          if (params.Uuid) {
            this.update(params);
          } else {
            this.add(params);
          }
        }
      });
    },
    add(params) {
      // api
      //   .add(params)
      //   .then(res => {
      //     this.loading = false;
      //     if (res.status === 200) {
      //       this.$message.success(res.msg);
      //       this.$router.push("/file/list");
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err.msg);
      //     this.loading = false;
      //   });
      const _this = this;
      this.post("/api/file/add", params)
        .then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.$message.success(res.msg);
            this.$router.push("/file/list");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
          this.loading = false;
        });
    },
    update(params) {
      api
        .update(params)
        .then(res => {
          this.loading = false;
          if (res.status === 200) {
            this.$message.success(res.msg);
            this.$router.push("/file/list");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.goods-chose {
  padding: 12px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.goods-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px;
  border-bottom: 1px dashed #ddd;
}
.goods-list:hover {
  background: #f6f6f6;
}
</style>
