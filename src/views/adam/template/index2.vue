<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">

            <el-select
              size="mini"
              type="primary"
              class="filter-item"
            />
            <el-button
              v-permission="['admin','dict:add']"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              class="filter-item"
              @click="$refs.form.dialog = true;isAdd = true">保存
            </el-button>
            <el-button
              v-permission="['admin','dict:add']"
              size="mini"
              type="primary"
              icon="el-icon-plus"
              class="filter-item"
              @click="$refs.form.dialog = true;isAdd = true">放弃
            </el-button>
            <el-dropdown>
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-arrow-down"
              >
                设置
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <el-tree
            :data="file_table_data"
            icon-class="el-icon-folder-opened tree-icon"
            highlight-current="true"
            draggable="true"
            indent="30"
            accordion
            :expand-on-click-node="false"
            node-key="id">
            <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="() =>mouseenter(node)"
                  @mouseleave="() =>mouseleave(node)">
                <span>{{ node.label }}</span>
                  <span>
                    <el-button v-show="node.del" type="text" size="large" icon="el-icon-folder-add tree-icon"
                               @click="() => append(data)"></el-button>
                    <el-button v-show="node.del" type="text" size="large" icon="el-icon-folder-remove tree-icon"
                               @click="() => remove(node, data)"></el-button>
                    <el-button v-show="node.del" type="text" size="large" icon="el-icon-s-operation tree-icon"
                               @click="() => remove(node, data)"></el-button>
                  </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :xs="36" :sm="36" :md="16" :lg="16" :xl="16" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文件编辑</span>
          </div>
          <template>
            <codemirror></codemirror>
          </template>

          <!--工具栏-->
          <!--          <div class="head-container">-->
          <!--            <el-form ref="form" size="mini" >-->
          <!--              <el-form-item label="文件名称" >-->
          <!--                <el-input  style="width: 100px;"/>-->
          <!--              </el-form-item>-->
          <!--            </el-form>-->
          <!--          </div>-->
          <!--          <div slot="header" class="clearfix">-->

          <!--&lt;!&ndash;            <el-button&ndash;&gt;-->
          <!--&lt;!&ndash;              v-permission="['admin','dict:add']"&ndash;&gt;-->
          <!--&lt;!&ndash;              class="filter-item"&ndash;&gt;-->
          <!--&lt;!&ndash;              size="mini"&ndash;&gt;-->
          <!--&lt;!&ndash;              style="float: right;padding: 4px 10px"&ndash;&gt;-->
          <!--&lt;!&ndash;              type="primary"&ndash;&gt;-->
          <!--&lt;!&ndash;              icon="el-icon-plus"&ndash;&gt;-->
          <!--&lt;!&ndash;              @click="$refs.form.dialog = true;isAdd = true">新增&ndash;&gt;-->
          <!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
          <!--          </div>-->
          <!--工具栏-->
          <!--          <div class="head-container">-->
          <!--            &lt;!&ndash; 搜索 &ndash;&gt;-->
          <!--            <el-input v-model="query.value" clearable placeholder="" style="width: 200px;" class="filter-item"-->
          <!--                      @keyup.enter.native="toQuery"/>-->
          <!--            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索-->
          <!--            </el-button>-->
          <!--          </div>-->
          <!--表格渲染-->
          <!--          <el-table v-loading="loading" :data="data" size="small" highlight-current-row style="width: 100%;"-->
          <!--                    @current-change="handleCurrentChange">-->
          <!--            <el-table-column prop="name" label="模板名称"/>-->
          <!--            <el-table-column prop="description" label="模板介绍"/>-->
          <!--            <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" label="操作" width="130px"-->
          <!--                             align="center" fixed="right">-->
          <!--              <template slot-scope="scope">-->
          <!--                <el-button v-permission="['admin','dict:edit']" size="mini" type="primary" icon="el-icon-edit"-->
          <!--                           @click="edit(scope.row)"/>-->
          <!--                <el-popover-->
          <!--                  v-permission="['admin','dict:del']"-->
          <!--                  :ref="scope.row.id"-->
          <!--                  placement="top"-->
          <!--                  width="180">-->
          <!--                  <p>此操作将删除工程与对应的模块，确定要删除吗？</p>-->
          <!--                  <div style="text-align: right; margin: 0">-->
          <!--                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>-->
          <!--                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定-->
          <!--                    </el-button>-->
          <!--                  </div>-->
          <!--                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>-->
          <!--                </el-popover>-->
          <!--              </template>-->
          <!--            </el-table-column>-->
          <!--          </el-table>-->
          <!--          &lt;!&ndash;分页组件&ndash;&gt;-->
          <!--          <el-pagination-->
          <!--            :total="total"-->
          <!--            :current-page="page + 1"-->
          <!--            style="margin-top: 8px;"-->
          <!--            layout="total, prev, pager, next, sizes"-->
          <!--            @size-change="sizeChange"-->
          <!--            @current-change="pageChange"/>-->
        </el-card>
      </el-col>
      <!--      <el-col :xs="16" :sm="16" :md="8" :lg="8" :xl="8">-->

      <!--        <el-card class="box-card">-->
      <!--          <div slot="header" class="clearfix">-->
      <!--            <span>模板变量</span>-->
      <!--            <el-button-->
      <!--              v-if="checkPermission(['admin','dict:add']) && this.$refs.adam_property && this.$refs.adam_property.templateId"-->
      <!--              class="filter-item"-->
      <!--              size="mini"-->
      <!--              style="float: right;padding: 4px 10px"-->
      <!--              type="primary"-->
      <!--              icon="el-icon-plus"-->
      <!--              @click="$refs.adam_property.$refs.form.dialog = true;$refs.adam_property.isAdd = true">新增-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--          <adam_property ref="adam_property"/>-->
      <!--        </el-card>-->
      <!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/initData'
  import {del, downloadTbProject} from '@/api/adam/template'
  import {downloadFile, parseTime} from '@/utils/index'
  import adam_property from './property/index'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'

  import eForm from './form'

  export default {
    components: {eForm, adam_property,codemirror},
    mixins: [initData],
    data() {
      return {
        file_table_data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        header: [
          {name: '权限', command: 'auth'},
        ],
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
        this.url = 'adam/api/template'
        this.params = {page: this.page, size: this.size}
        return true
      },
      mouseenter(node) {
        console.log("1")
        this.$set(node, 'del', true)
      },
      mouseleave(node) {
        console.log("2")
        this.$set(node, 'del', false)
      },
      remove(node,data){
        console.log(node)
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
          createBy: data.createBy,
          createTime: data.createTime,
          isDelete: data.isDelete,
          updateBy: data.updateBy,
          updateTime: data.updateTime,
          description: data.description,
          name: data.name
        }
        _this.dialog = true
      },
      handleCurrentChange(val) {
        if (val) {
          this.$refs.adam_property.templateId = val.id
          this.$refs.adam_property.init()
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

<style>

  .tree-icon {
    font-size: 20px;
    color: #e6a23c;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
