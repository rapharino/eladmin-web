<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">


    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="name" label="表名"/>
      <el-table-column prop="comment" label="注释"/>
      <el-table-column prop="comment" label="数据库引擎"/>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <generator :name="scope.row.name"/>
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
</template>


<script>
  import initData from '@/mixins/initData'
  import {del, downloadTbDatasource} from '@/api/adam/datasource'
  import {parseTime, downloadFile} from '@/utils/index'
  import generator from './generator'

  export default {
    components: { generator },
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
      beforeInit() {
        this.url = 'adam/api/metadata/datasource/'+this.$route.query.datasource
        const sort = 'id,desc'
        this.params = { page: this.page, size: this.size, sort: sort }
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
          createTime: data.createTime,
          updateTime: data.updateTime,
          createBy: data.createBy,
          updateBy: data.updateBy,
          isDelete: data.isDelete,
          name: data.name,
          dialect: data.dialect,
          url: data.url,
          user: data.user,
          pwd: data.pwd
        }
        _this.dialog = true
      }
    }
  }
</script>

<style scoped>

</style>
