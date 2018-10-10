<template>
  <div>
    <el-form ref="form" :model="form" label-width="0px">
      <el-form-item>
        <el-input v-model="form.bucketKey" placeholder="请输入存储桶名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import lib from '@/assets/js/api.js'
export default {
  data() {
    return {
      loading: false,
      form: {
        bucketKey: '',
        policyKey: 'transient'
      }
    }
  },
  methods: {
    onSubmit() {
      if (this.form.bucketKey) {
        this.loading = true
        lib.ajax(
          {
            url: lib.buckets,
            data: this.form,
            method: 'POST',
            success: data => {
              console.log(data)
              this.loading = false
            }
          },
          'bucket:create'
        )
      } else {
        this.$message('请输入')
      }
    }
  }
}
</script>

<style>
</style>
