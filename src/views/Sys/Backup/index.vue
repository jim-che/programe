<template>
  <div class="backup" v-loading="loading">
    <el-descriptions title="备份恢复记录" :column="1" border direction="horizontal">
      <template #extra>
        <el-button type="primary" icon="el-icon-office-building" @click="handelBackup">立即备份</el-button>
        <el-button icon="el-icon-refresh" @click="getBackupInfo" title="刷新"></el-button>
      </template>
      <el-descriptions-item>
        <template #label>当前状态</template>
        <el-tag :type="statuStyle[backupData?.Status - 1]">
          <i :class="Status.icon"></i>
          {{Status.label}}
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>最后一次备份时间</template>
        <div class="time"><i class="el-icon-date"></i> 当地时间: {{backupData._LastBackupTime_ || ''}}</div>
        <div class="time"><i class="el-icon-date"></i> UTC时间: {{backupData.LastBackupTime || ''}}</div>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>最后一次恢复时间</template>
        <div class="time"><i class="el-icon-date"></i> 当地时间: {{backupData?._LastRecoverTime_ || ''}}</div>
        <div class="time"><i class="el-icon-date"></i> UTC时间: {{backupData.LastRecoverTime || ''}}</div>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>备份记录</template>
        <template v-if="backupData.Filenames">
          <div class="backupFile" v-for="(item, index) in backupData.Filenames" :key="'file-' + index">
            <div class="filemsg">
              <p class="filename">{{item}}</p>
              <p class="filetime">{{backupData.FilenamesTime[index]}}</p>
            </div>
            <div class="fileBtn">
              <el-button @click="handelRecover(item)">恢复</el-button>
              <el-button @click="handelDelete(item)" type="danger">删除</el-button>
            </div>
          </div>
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import api from "@/api/backup";
export default {
  data() {
    return {
      loading: false,
      backupData: {status: 3},
      statuStyle: ['success', 'warning', 'warning', 'info']
    };
  },
  computed: {
    Status() {
      let status = this.backupData?.Status
      switch (status) {
        case 1: return {label: '正常', icon: 'el-icon-check'}
        case 2: return {label: '正在备份数据', icon: 'el-icon-loading'}
        case 3: return {label: '正在恢复数据', statusicon: 'el-icon-loading'}
        default: return {label: '未知状态', statusicon: 'el-icon-warning'}
      }
    }
  },
  mounted() {
    this.getBackupInfo()
  },
  methods: {
    UTC_TIME(value) {
      if (!value) {
        return ''
      } else {
        let str = value.replace(/backup_/, '')
        str = str.replace(/\.zip/, '')
        str = str.replace(/_/g, ':')
        let date = new Date(str)
        console.log(str, date)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minutes = date.getMinutes()
        let second = date.getSeconds()
        month < 10 ? month = `0${month}` : month
        day < 10 ? day = `0${day}` : day
        hour < 10 ? hour = `0${hour}` : hour
        minutes < 10 ? minutes = `0${minutes}` : minutes
        second < 10 ? second = `0${second}` : second
        return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
      }
    },
    handelDelete(Filename) {
      this
        .$confirm(`将删除 ${Filename} , 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.loading = true
          api
            .handelDelete({
              Filename
            })
            .then(() => {
              this.loading = false
              this.getBackupInfo()
              this.$message.success('删除成功, 正在刷新')
            })
            .catch(err => {
              this.loading = false
              this.$message.error(err.msg)
            })
        })
    },
    handelRecover(Filename) {
      this
        .$confirm(`将恢复备份文件: ${Filename} , 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.loading = true
          api
            .handelRecover({
              Filename
            })
            .then(() => {
              this.loading = false
              this.getBackupInfo()
              this.$message.success('恢复成功, 正在刷新状态')
            })
            .catch(err => {
              this.loading = false
              this.$message.error(err.msg)
            })
        })
    },
    handelBackup() {
      this.loading = true
      api
        .handelBackup()
        .then(() => {
          this.loading = false
          this.getBackupInfo()
          this.$message.success('备份成功, 正在刷新状态')
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
        })
    },
    getBackupInfo() {
      let that = this
      this.loading = true
      api
        .getBackupInfo()
        .then(res => {
          this.loading = false
          this.backupData = {
            ...res.data,
            LastBackupTime: res.data.LastBackupTime,
            LastRecoverTime: res.data.LastRecoverTime,
            _LastBackupTime_: this.UTC_TIME(res.data.LastBackupTime),
            _LastRecoverTime_: this.UTC_TIME(res.data.LastRecoverTime),
            FilenamesTime: res.data.Filenames.map(item => that.UTC_TIME(item))
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
        })
    }
  }
};
</script>

<style scoped>
  .tip {
    font-size: 13px;
    color: #666;
    margin-top: 8px;
  }
  .tip:first-child {
    margin-top: 20px;
  }
  .backup {
    max-width: 600px;
  }
  .backupFile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #666;
    padding: 6px 3px;
    border-top: 1px dashed #ddd;

  }
  .backupFile:first-child {
    border-top: 0;
  }
  .backupFile:hover {
    background: #ededed;
  }
  .backupFile > div {
    margin-right: 12px;
  }
  .time {
    padding: 6px 0 0 0;
  }
  .filemsg {
    margin-right: 12px;
    flex: 1;
  }
  .filename {
    color: #666;
  }
  .filetime {
    color: #b2b2b2;
  }
  .fileBtn {
    flex-shrink: 1;
    width: 122px;
  }
  @media screen and (max-width: 800px) {
    .backupFile {
      display: block;
    }
    .fileBtn {
      margin-top: 12px;
    }
  }
</style>