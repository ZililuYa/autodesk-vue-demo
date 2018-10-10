<template>
    <div>
        <el-alert title="Key获取地址：" type="info">
            <a target="_back" href="https://forge.autodesk.com/myapps">https://forge.autodesk.com/myapps</a>
        </el-alert>
        <br>
        <el-form ref="form" :model="form" label-width="0px">
            <el-form-item>
                <el-input v-model="form.client_id" placeholder="client id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.client_secret" placeholder="client secret"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        client_id: 'mlcx2YQRhgB3s7MMs6magAb6ZAl8fkNE',
        client_secret: 'ANaEg5gNsSeGUpip'
      }
    }
  },
  methods: {
    onSubmit() {
      window.localStorage.setItem('key', JSON.stringify(this.form))
      this.$message('保存成功')
    }
  }
}
</script>

<style>
</style>
