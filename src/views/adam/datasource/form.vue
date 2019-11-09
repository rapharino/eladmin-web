<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="创建时间" >
        <el-date-picker v-model="form.createTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="修改时间" >
        <el-date-picker v-model="form.updateTime" type="datetime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建人" >
        <el-input v-model="form.createBy" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="修改人" >
        <el-input v-model="form.updateBy" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否逻辑删除" >
        <el-input v-model="form.isDelete" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="名称" >
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="JDBC方言" >
        <el-input v-model="form.dialect" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="连接URL" >
        <el-input v-model="form.url" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="用户名" >
        <el-input v-model="form.user" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="密码" >
        <el-input v-model="form.pwd" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/adam/datasource'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        isDelete: '',
        name: '',
        dialect: '',
        url: '',
        user: '',
        pwd: ''
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
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
        id: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        updateBy: '',
        isDelete: '',
        name: '',
        dialect: '',
        url: '',
        user: '',
        pwd: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
