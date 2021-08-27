<template>
  <div class="tree-input">
    <el-button type="primary" style="margin-left: 6px;" @click="dialogVisible = true">{{ text }}</el-button>
    <el-dialog
      v-bind:title="(text)"
      v-model="dialogVisible"
      :width="panelWidth"
      @opened="loadTreeData">
      <el-input
        style="margin-bottom: 12px;"
        clearable
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        v-loading="loading"
        ref="tree"
        node-key="Uuid"
        :data="treeData"
        :expand-on-click-node="false"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick">
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button :disabled="loading" type="primary" icon="el-icon-refresh" @click="getTreeData">刷新数据</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import apiGood from "@/api/GoodsType";
import apiAccount from "@/api/Account";
import apiCompany from "@/api/Company";
import apiWarehouse from "@/api/Warehouse";
export default {
  props: ['treeType', 'text'],
  computed: {
    panelWidth() {
      let clientWidth = document.body.clientWidth;
      return clientWidth > 800 ? '500px' : '80%'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      dialogVisible: false,
      loading: false,
    }
  },
  methods: {
    loadTreeData() {
      if (this.treeData.length <= 0) {
        this.getTreeData()
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.Name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.dialogVisible = false
      this.$emit('treeChose', data)
    },
    async cutList(arr) {
      let tree = arr.concat([])
      tree.forEach((item) => {
        item.children = [],
        item.deep = 0
      })
      tree.forEach((item) => {
        tree.forEach((item2) => {
          if (item2.ParentId == item.Uuid) {
            item.children.push(item2)
          }
        })
      })
      tree = tree[0]
      tree = await this.judgeDept(tree, 0)
      this.treeData = tree.children
    },
    judgeDept(arr, deep){
      arr[0] ? arr.forEach((item) => {
        item.deep = deep + 1
        if (item.children[0]) {
          this.judgeDept(item.children, item.deep)
        }
      }) : ''
      return arr
    },
    getTreeData() {
      this.loading = true;
      let api = apiGood;
      if (this.treeType === 'company') {
        api = apiCompany
      } else if (this.treeType === 'account') {
        api = apiAccount
      } else if (this.treeType === 'warehouse') {
        api = apiWarehouse
      }
      this.getApiData(api);
    },
    getApiData(api) {
      this.loading = true;
      api
        .getList()
        .then(res => {
          this.loading = false
          let arr = res?.data?.list
          if (arr && arr.length > 0) {
            arr.forEach(item => {
              if (!item.ParentId) item.ParentId = 'root'
            })
            this.cutList([{Name: '根节点', Uuid: 'root'}, ...arr])
          }
        })
        .catch(err => {
          this.loading = false
          console.log('-----fail----', err)
        })
    },
  }
}
</script>

<style scoped>

</style>