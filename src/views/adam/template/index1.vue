<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-select placeholder="选择模板"
                       v-model="template"
                       size="mini"
                       type="primary"
                       class="filter-item">
              <el-option
                v-for="item in this.data"
                :key="item"
                :label="item.name"
                :value="item">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
            <el-button
              v-permission="['admin','dict:add']"
              size="mini"
              type="primary"
              icon="el-icon-folder-add"
              class="filter-item"
              @click="$refs.form.dialog = true;isAdd = true">新增
            </el-button>

<!--            <el-button-->
<!--              v-permission="['admin','dict:add']"-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              icon="el-icon-folder-delete"-->
<!--              class="filter-item"-->
<!--              @click="$refs.form.dialog = true;isAdd = true">删除-->
<!--            </el-button>-->

            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit-outline"
              class="filter-item"
              @click="edit(template)">修改
            </el-button>

            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                icon="el-icon-edit-outline"
                class="filter-item"
                @click="edit(templateId)">修改
              </el-button>
              <el-popover
                :ref="scope.id"
                placement="top"
                width="180">
                <p>此操作将删除模板与对应的文件，确定要删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.id)">确定
                  </el-button>
                </div>
                <el-button slot="reference" size="mini"
                           type="danger"
                           icon="el-icon-folder-delete"
                           class="filter-item"/>
              </el-popover>
            </template>

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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/initData'
  import {del, downloadTbProject} from '@/api/adam/template'
  import {downloadFile, parseTime} from '@/utils/index'
  import adam_property from './property/index'
  import {codemirror} from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'

  import eForm from './form'

  export default {
    components: {eForm, adam_property, codemirror},
    mixins: [initData],
    data() {
      return {
        template: {},
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
      remove(node, data) {
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
        console.log(data)
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
