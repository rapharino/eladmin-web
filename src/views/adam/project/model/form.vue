<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog"
             :title="isAdd ? '新增' : '编辑'" width="1100px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-position="left" label-width="50px">

      <el-form-item label="表名">
        <el-input v-model="form.tableName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="注释">
        <el-input v-model="form.comment" style="width: 370px;"/>
      </el-form-item>

      <el-table v-loading="loading" :data="form.fields" size="small" style="width: 100%;margin-bottom: 15px">
        <el-table-column prop="name" label="字段名称">
          <template slot-scope="scope">
            <el-input v-model="form.fields[scope.$index].name" class="edit-input"/>
          </template>
        </el-table-column>
        <el-table-column label="字段类型">
          <template slot-scope="scope">
            <el-select v-model="form.fields[scope.$index].type" class="edit-input" clearable placeholder="请选择">
              <el-option
                value="int"/>
              <el-option
                value="bigint"/>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="keyType" label="主键类型">
          <template slot-scope="scope">
            <el-select v-model="form.fields[scope.$index].keyType" class="edit-input" clearable placeholder="请选择">
              <el-option
                value="pk"/>
              <el-option
                value="uni"/>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-plus"
                       @click.native.prevent="addRow(scope.$index, form.fields)"/>
            <el-button size="mini" type="danger" icon="el-icon-minus"
                       @click.native.prevent="deleteRow(scope.$index, form.fields)"/>
          </template>
        </el-table-column>

      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {add, edit} from '@/api/adam/model'

  export default {
    name: "model",
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      projectId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        loading: false, dialog: false,
        form: {
          name: '',
          key: '',
          description: '',
          fields: [
            {
              name: 'id',
              type: 'bigint'
            }, {
              name: 'create_time',
              type: 'datetime'
            }, {
              name: 'update_time',
              type: 'int'
            }, {
              name: 'create_by',
              type: 'int'
            }, {
              name: 'update_by',
              type: 'int'
            }, {
              name: 'is_delete',
              type: 'int'
            }
          ]
        },
        rules: {}
      }
    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      addRow(index,rows,event) {
        rows.splice(index+1, 0, {
          name: '',
          type: ''
        });
      },
      cancel() {
        this.resetForm()
      },
      doSubmit() {
        this.form['project'] = {
          id: this.projectId
        }
        this.loading = true
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
      },
      doAdd() {
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      },
      doEdit() {
        edit(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {
          name: '',
          key: '',
          description: '',
          fields: [
            {
              name: 'id',
              type: 'bigint'
            }, {
              name: 'create_time',
              type: 'datetime'
            }, {
              name: 'update_time',
              type: 'int'
            }, {
              name: 'create_by',
              type: 'int'
            }, {
              name: 'update_by',
              type: 'int'
            }, {
              name: 'is_delete',
              type: 'int'
            }
          ]
        }
      }
    }
  }
</script>

<style scoped>

</style>
