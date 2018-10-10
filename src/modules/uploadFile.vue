<template>
  <el-dialog title="上传文件" :visible.sync="dialogVisible" :before-close="close">
    <div v-loading="loading"><input type="file" ref="file"/></div>
      <br>
      <el-progress :percentage="percentage" v-show="percentage"></el-progress>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="upload">上传</el-button>
      </span>
  </el-dialog>
</template>

<script>
import lib from '@/assets/js/api.js'
export default {
  data() {
    return {
      file: '',
      dialogVisible: false,
      loading: false,
      percentage: 0
    }
  },
  watch: {
    value: function(va) {
      this.dialogVisible = va
    }
  },
  props: {
    value: Boolean,
    name: String
  },
  methods: {
    upload() {
      let that = this
      if (this.$refs.file.value) {
        this.loading = true
        let v = this.$refs.file.value.toString().split('\\')
        console.log(this.$refs.file.value, v)
        let name = v[v.length - 1]
        let formData = new FormData()
        console.log(this.$refs.file.files[0], this.$refs.file[0])
        formData.append('file', this.$refs.file.files[0])
        lib.ajax(
          {
            url: lib.buckets + '/' + this.name + '/objects/' + name,
            method: 'PUT',
            data: this.$refs.file.files[0],
            onUploadProgress: progressEvent => {
              console.log(progressEvent)
              this.percentage = parseInt(
                ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
              )
              // loaded
            },
            success: data => {
              console.log(data)
              that.loading = false
              that.$emit('success')
              that.$message('success')
              that.close()
              that.$refs.file.value = ''
              that.percentage = 0
            }
          },
          'data:write'
        )
      }
    },
    close() {
      this.dialogVisible = false
      this.$emit('input', false)
    }
  }
}
</script>

<style>
</style>
