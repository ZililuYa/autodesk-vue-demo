<template>
  <div>
    <el-dialog title="添加任务" :close-on-click-modal="false" :visible.sync="taskShow" width="50%" :before-close="handleClose">
      <div class="div">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="任务名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker v-model="form.date" align="right" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="天数">
            <el-input-number v-model="form.day" :min="1" :max="200" label="天数"></el-input-number>
          </el-form-item>
          <el-form-item label="关联模型">
            <el-button @click="modelShow=true" type="success" :icon="form.models.length?'el-icon-check':'el-icon-plus'" circle></el-button>
            <span v-if="form.models.length"> 关联成功</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关联模型" :visible.sync="modelShow" width="40%">
      <el-tree :data="data" :props="defaultProps" show-checkbox @check-change="handleNodeClick">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relevance">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        date: new Date(),
        day: 1,
        models: []
      },
      date: '',
      taskShow: false,
      modelShow: false,
      defaultProps: {
        children: 'objects',
        label: 'name'
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: false
    }
  },
  watch: {
    value(v) {
      this.taskShow = v
    }
  },
  mounted() {
    this.taskShow = this.value
    let now = new Date()
    let date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    this.date = date
    this.form.date = new Date(date)
  },
  methods: {
    ok() {
      if (!this.form.name) {
        this.$message('Error Name')
        return
      }
      this.$emit('ok', this.form)
      this.form = {
        name: '',
        date: new Date(this.date),
        day: 1,
        models: []
      }
      this.handleClose()
    },
    handleNodeClick(data, checked, indeterminate) {
      this.form.models[data.objectid] = checked
    },
    relevance() {
      this.modelShow = false
    },
    handleClose() {
      this.taskShow = false
      this.$emit('input', false)
    }
  }
}
</script>

<style>
</style>
