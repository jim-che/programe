<template>
  <div class="search-form">
    <el-row :gutter="20" v-show="show" style="margin-bottom: 20px;">
      <el-col
        v-for="item in searchItems" 
        :key="item.name"
        :xs="24" :sm="12" :md="8" :lg="6" :xl="6"
        >
        <div class="search-item">
          <span 
            class="search-label" 
            :style="{'width': labelWidth + 'px'}">
            {{item.label}}
          </span>
          <span class="search-input">
            <template v-if="item.type === 'select'">
              <el-select v-model="form[item.name]" style="width: 100%;" clearable>
                <el-option 
                  v-for="option in item.dicData" 
                  :key="option.value" 
                  :value="option.value" 
                  :label="option.label"></el-option>
              </el-select>
            </template>
            <template v-else-if="item.type === 'date'">
              <el-date-picker
                clearable
                style="width: 100%;"
                v-model="form[item.name]"
                type="date">
              </el-date-picker>
            </template>
            <template v-else>
              <el-input v-model="form[item.name]" clearable></el-input>
            </template>
          </span>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: flex-end;">
      <el-button 
        type="primary" 
        icon="el-icon-search" 
        :disabled="disabled"
        @click="search">查询</el-button>
      <el-button 
        icon="el-icon-refresh" 
        :disabled="disabled"
        @click="reset">重置</el-button>
      <el-button 
        icon="el-icon-sort"
        @click="toggle">{{show ? '隐藏' : '展开'}}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchItems: {
      type: Array,
      value: []
    },
    labelWidth: {
      type: Number,
      value: 80
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {
      form: {},
      show: true,
    }
  },
  created() {
    this.searchItems.forEach(item => {
      this.form[item.name] = item.defaultValue || ''
    })
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
    search() {
      this.$emit('search', this.form)
    },
    reset() {
      for (let item in this.form) {
          this.form[item] = ''
      }
      this.$emit('search', this.form)
    }
  }
}
</script>

<style scoped>
.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.search-label {
  color: #666;
  font-size: 14px;
}
.search-input {
  flex: 1;
}
</style>