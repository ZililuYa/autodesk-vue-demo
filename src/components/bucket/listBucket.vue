<template>
    <div>
        <h3>桶列表</h3>
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column prop="bucketKey" label="桶名" width="250">
                <template slot-scope="scope">
                    <router-link :to="'/detailBucket?id='+scope.row.bucketKey">{{ scope.row.bucketKey}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="createdDate" label="创建时间" width="250">
                <template slot-scope="scope">
                    {{new Date(scope.row.createdDate).Format('yyyy-MM-dd hh:mm')}}
                </template>
            </el-table-column>
            <el-table-column prop="policyKey" label="类型">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini">上传文件</el-button>
                    <el-button size="mini" type="danger">删除桶</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import lib from '@/assets/js/api.js'
export default {
  data() {
    return {
      tableData: [],
      loading: true
    }
  },
  mounted() {
    lib.ajax(
      {
        url: lib.buckets,
        method: 'GET',
        success: data => {
          console.log(data)
          this.tableData = data.data.items
          this.loading = false
        }
      },
      'bucket:read'
    )
  }
}
</script>

<style>
</style>
