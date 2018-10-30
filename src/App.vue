<template>
  <div id="app">
    <el-container v-if="this.$route.path.indexOf('/model') === -1">
      <el-header>BIM5D 项目管理平台</el-header>
      <el-aside>
        <el-menu default-active="0" @open="handleOpen" @close="handleClose">

          <template v-for="(i, k) in menu">

            <el-submenu :index="k.toString()" v-if="i.child" :key="k">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{i.name}}</span>
              </template>
              <el-menu-item :index="k+'-'+v" @click="push(c.path)" v-for="(c, v) in i.child" :key="v">{{c.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item :index="k.toString()" @click="push(i.path)" v-if="!i.child" :key="k">
              <i class="el-icon-setting"></i>
              <span slot="title">{{i.name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <router-view v-if="this.$route.path.indexOf('/model') !== -1" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menu: [
        {
          name: '存储桶',
          child: [
            {
              name: '桶列表',
              path: '/listBucket'
            },
            {
              name: '桶创建',
              path: '/createBucket'
            }
          ]
        },
        {
          name: 'KEY设置',
          path: '/key'
        }
      ]
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    push(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less">
.fl {
  float: left !important;
}
.fr {
  float: right !important;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.el-container {
  position: relative;
  height: 100%;
  .el-aside {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    .el-menu {
      position: relative;
      height: 100%;
    }
  }
  .el-header {
    box-shadow: 0 0 3px #ccc;
    line-height: 60px;
    position: relative;
    z-index: 9999;
  }
  .el-main {
    position: absolute;
    top: 60px;
    left: 300px;
    right: 0;
    bottom: 0;
  }
}
</style>
