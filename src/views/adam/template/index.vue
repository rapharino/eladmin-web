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
                       value-key="id"
                       size="mini"
                       type="primary"
                       class="filter-item"
                       @change="selectOne(template)"
            >
              <el-option
                size="mini"
                type="primary"
                class="filter-item"
                v-for="item in this.data"
                :key="item.id"
                :label="item.name"
                :value="item">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 2px">{{ item.description }}</span>
              </el-option>
            </el-select>

            <el-button
              size="mini"
              type="primary"
              icon="el-icon-folder-add"
              class="filter-item"
              @click="$refs.form.dialog = true;isAdd = true">新增
            </el-button>

            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit-outline"
              class="filter-item"
              @click="edit(template)">修改
            </el-button>

            <el-popover
              :ref="template.id"
              placement="top"
              width="300">
              <p>此操作将删除模板与对应的文件，确定要删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[template.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(template.id)">确定
                </el-button>
              </div>

              <el-button slot="reference"
                         size="mini"
                         type="danger"
                         icon="el-icon-folder-delete"
                         class="filter-item">删除
              </el-button>

            </el-popover>

          </div>
          <el-tree
            icon-class="el-icon-folder-opened tree-icon"
            node-key="path"
            :highlight-current="true"
            :ref="tree"
            :data="file"
            :props="defaultProps"
            :default-expand-all="true"
            :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="mouseenter(node)"
                      @mouseleave="mouseleave(node)">
                    <span>{{ node.label }}</span>
                      <span>
                        <el-button v-show="node.del" type="text" size="large" icon="el-icon-folder-add tree-icon"
                                   @click="append(data)"></el-button>

                        <el-popover
                          placement="top"
                          width="300"
                          v-model="visible">
                          <p>此操作将删除文件/文件夹，确定要删除吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                            <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
                          </div>
                          <el-button slot="reference" v-show="node.del" type="text" size="large"
                                     icon="el-icon-folder-remove tree-icon"
                                     @click="deleteFile(node, data)"></el-button>
                        </el-popover>

<!--                          <el-popover-->
<!--                            placement="top"-->
<!--                            width="300">-->
<!--                            -->
<!--                            <p>此操作将删除模板与对应的文件，确定要删除吗？</p>-->
<!--                            <div style="text-align: right; margin: 0">-->
<!--                              <el-button size="mini" type="text" @click="$refs[node.path].doClose()">取消</el-button>-->
<!--                              <el-button :loading="delLoading" type="primary" size="mini" @click="deleteFile(node, data)">确定</el-button>-->
<!--                            </div>-->

<!--                            <el-button v-show="node.del" type="text" size="large"-->
<!--                                       icon="el-icon-folder-remove tree-icon"-->
<!--                                       @click="deleteFile(node, data)"></el-button>-->
<!--                          </el-popover>-->

                        <!--                        <el-button v-show="node.del" type="text" size="large"-->
                        <!--                                   icon="el-icon-folder-remove tree-icon"-->
                        <!--                                   @click="deleteFile(node, data)"></el-button>-->


                        <el-button v-show="node.del" type="text" size="large" icon="el-icon-s-operation tree-icon"
                                   @click="deleteFile(node, data)"></el-button>
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
  import {del, delFile, downloadTbProject, listFile} from '@/api/adam/template'
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
        file: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
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
      selectOne(node) {
        listFile({
          name: node.dir
        }).then(res => {
          console.log(res)
          this.file = res.data;
        }).catch(err => {
          console.log(err.response.data.message)
        })
      },
      mouseenter(node) {
        this.$set(node, 'del', true)
      },
      mouseleave(node) {
        this.$set(node, 'del', false)
      },
      deleteFile(node) {
        delFile({
          name: node.data.path
        }).then(res => {
          this.$refs.tree
          this.selectOne()
        }).catch(err => {
          console.log(err.response.data.message)
        })
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
