<template>
  <div>
    <h3>桶{{id}}详情 <el-button class='fr' @click="upload=true" type="success">上传文件</el-button>
    </h3>

    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="objectKey" label="文件名">
        <template slot-scope="scope">
          {{ scope.row.objectKey}}
        </template>
      </el-table-column>
      <el-table-column prop="objectId" label="urn">
      </el-table-column>
      <el-table-column prop="objectKey" label="">
        <template slot-scope="scope">
          <a>打开</a>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="job(scope.row.objectId)" :loading="jobLoad">转换</el-button>
          <el-button size="mini" @click="views(scope.row.objectId)" :loading="jobLoad">查看</el-button>
          <el-button size="mini" @click="del(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <uploadFile v-model="upload" :name="id" @success="getData"></uploadFile>
  </div>
</template>

<script>
import lib from '@/assets/js/api.js'
import uploadFile from '@/modules/uploadFile'
export default {
  components: { uploadFile },
  data() {
    return {
      upload: false,
      tableData: [],
      loading: true,
      jobLoad: false,
      from: {
        input: {
          urn: ''
        },
        output: {
          formats: [
            {
              type: 'svf',
              views: ['2d', '3d']
            }
          ]
        }
      },
      id: ''
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    } else {
      this.$router.push('/')
      return
    }
    this.getData()
  },
  methods: {
    del(row) {
      console.log(row)
      this.$confirm(
        '此操作将永久删除' + row.objectKey + '文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.delete(row)
        })
        .catch(() => {})
    },
    delete(row) {
      lib.ajax(
        {
          url: lib.buckets + '/' + row.bucketKey + '/objects/' + row.objectKey,
          method: 'DELETE',
          success: () => {
            this.getData()
          }
        },
        'data:write'
      )
    },
    views(urn) {
      urn = lib.encode(urn)
      // window.open('/#/model?urn=' + urn)
      lib.ajax(
        {
          url: lib.designdata + '/' + urn + '/manifest',
          method: 'GET',
          success: data => {
            let res = data.data
            if (res.status === 'pending' || res.status === 'inprogress') {
              this.$message(res.progress)
            } else if (res.status === 'success') {
              window.open('/#/model?urn=' + res.urn)
            } else {
              this.$message(res.status)
            }
          },
          error: () => {
            this.$message('请先转换')
          }
        },
        'data:read data:write'
      )
    },
    job(urn) {
      this.jobLoad = true
      this.from.input.urn = lib.encode(urn)
      lib.ajax(
        {
          url: lib.designdata + '/job',
          method: 'POST',
          data: this.from,
          success: data => {
            this.jobLoad = false
            this.$message(data.data.result)
          }
        },
        'data:read data:write'
      )
    },
    getData() {
      this.loading = true
      lib.ajax(
        {
          url: lib.buckets + '/' + this.id + '/objects',
          method: 'GET',
          success: data => {
            this.tableData = data.data.items
            console.log(data.data.items)
            this.loading = false
          }
        },
        'data:read'
      )
    }
  }
}
</script>

<style>
</style>
