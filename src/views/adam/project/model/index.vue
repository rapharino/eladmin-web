<template>
  <div>
    <div v-if="projectId === ''">
      <div class="my-code">请选择</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="toQuery"/>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      </div>
      <!--表单组件-->
      <eForm ref="form" :is-add="isAdd" :project-id="projectId"/>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">

        <el-table-column prop="tableName" label="表名"/>
        <el-table-column prop="comment" label="注释"/>
       
        <el-table-column v-if="checkPermission(['admin','model:edit','model:del'])" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <el-button v-permission="['admin','model:edit']" size="mini" type="primary" icon="el-icon-edit"
                       @click="edit(scope.row)"/>
            <el-popover
              v-permission="['admin','model:del']"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
                </el-button>
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
    </div>
  </div>
</template>
<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/initData'
  import {del, downloadTbModel} from '@/api/adam/model'
  import {downloadFile, parseTime} from '@/utils/index'
  import eForm from './form'

  export default {
    components: {eForm},
    mixins: [initData],
    data() {
      return {
        delLoading: false,
        projectId: '',
      }
    },
    created() {
      this.loading = false
    },
    methods: {
      parseTime,
      checkPermission,
      beforeInit() {
        this.url = '/adam/api/model'
        this.params = {
          page: this.page,
          size: this.size,
          projectId: this.projectId
        }
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
        this.$refs.form.resetFields()
        this.$refs.form.dialog = true
      },
      edit(data) {
        this.isAdd = false
        const _this = this.$refs.form
        _this.form = {
          id: data.id,
          tableName: data.tableName,
          comment: data.comment,
          fields:data.fields
        }
        _this.dialog = true
      }
    }
  }
</script>

<style scoped>
  .my-code{
    padding: 15px;
    line-height: 20px;
    border-left: 3px solid #ddd;
    color: #333;
    font-family: Courier New;
    font-size: 12px
  }
</style>
