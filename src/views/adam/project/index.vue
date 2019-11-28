<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>工程列表</span>
            <el-button
              v-permission="['admin','dict:add']"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.form.dialog = true;isAdd = true">新增</el-button>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-input v-model="query.value" clearable placeholder="" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
          </div>
          <!--表格渲染-->
          <el-table v-loading="loading" :data="data" size="small" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="name" label="工程名称"/>
            <el-table-column prop="author" label="作者"/>
            <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-permission="['admin','dict:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
                  v-permission="['admin','dict:del']"
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>此操作将删除工程与对应的模块，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>模型</span>
            <el-button
              v-if="checkPermission(['admin','dict:add']) && this.$refs.adam_model && this.$refs.adam_model.projectId"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.adam_model.$refs.form.dialog = true;$refs.adam_model.isAdd = true">新增</el-button>
          </div>
          <adam_model ref="adam_model"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, downloadTbProject } from '@/api/adam/project'
import { parseTime, downloadFile } from '@/utils/index'
import adam_model from './model/index'

import eForm from './form'
export default {
  components: { eForm,adam_model },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'adam/api/project'
      this.params = { page: this.page, size: this.size}
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        author: data.author,
        name: data.name
      }
      _this.dialog = true
    },
    handleCurrentChange(val) {
      if (val) {
         this.$refs.adam_model.projectId = val.id
         this.$refs.adam_model.init()
      }
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadTbProject(this.params).then(result => {
        downloadFile(result, 'TbProject列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
