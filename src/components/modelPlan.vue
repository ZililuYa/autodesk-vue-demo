<template>
  <div id="MyViewerDivPlan">
    <div class="ui-layout-west">
      <div class="viewerDiv" ref="viewerDiv"></div>

      <div class="play" v-if="dayArr.length">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="play/dayArr.length*100"></el-progress>
        <i class="el-icon-caret-right" @click='playBefore(),playGo()'></i>
        <div class="num">{{play}}/{{dayArr.length}}</div>
      </div>
    </div>

    <div class="ui-layout-center" id="ui-layout-center">
      <div class="ui-layout-2cen">
        <div class="tree" id="dhtml">
          <div v-if="false" class="table">
            <table border='0' cellspacing='0' cellpadding='0'>
              <tr>
                <th class="left">名称</th>
                <th width="100">开始时间</th>
                <th width="50">天数</th>
                <th width="30"><i @click='addTask' class="el-icon-plus"></i></th>
              </tr>
              <template v-for="(i, k) in task">
                <tr :class="k === nowId?'active':''" :key="k" @click="showModel(i),nowId=k">
                  <td class="left"><i v-if="i.unfold===false" @click="storey[k].unfold=true" class="el-icon-circle-plus-outline"></i><i @click="storey[k].unfold=false" v-if="i.unfold===true" class="el-icon-remove-outline"></i> {{i.name}}</td>
                  <td>{{ new Date(i.date).Format('yyyy-MM-dd')}}</td>
                  <td>{{i.day}}</td>
                  <td>
                    <!-- <i @click='addTask' class="el-icon-plus"></i> -->
                    <i @click='onDel(k)' class='el-icon-delete'></i>
                  </td>
                </tr>
                <tr :class="a.objectid === nowId?'active':''" @click="showModel(a.objectid)" v-if="i.unfold" :key="b" v-for="(a, b) in i.objects">
                  <td class="left">　 {{a.name}}</td>
                  <td>2018-09-30</td>
                  <td>{{a.objectid}}</td>
                </tr>
              </template>
              <!-- <template v-for="(i, k) in storey">
            <tr :class="i.objectid === nowId?'active':''" :key="k" @click="showModel(i)">
              <td class="left"><i v-if="i.unfold===false" @click="storey[k].unfold=true" class="el-icon-circle-plus-outline"></i><i @click="storey[k].unfold=false" v-if="i.unfold===true" class="el-icon-remove-outline"></i> {{i.name}}</td>
              <td>2018-08-09</td>
              <td>{{i.objectid}}</td>
              <td><i @click='addTask' class="el-icon-plus"></i></td>
            </tr>
            <tr :class="a.objectid === nowId?'active':''" @click="showModel(a.objectid)" v-if="i.unfold" :key="b" v-for="(a, b) in i.objects">
              <td class="left">　 {{a.name}}</td>
              <td>2018-09-30</td>
              <td>{{a.objectid}}</td>
            </tr>
          </template> -->
            </table>
          </div>
          <div v-show="false" class="schedule" v-if="dayArr.length">
            <div class="table" border='0' cellspacing='0' cellpadding='0' :style="`width:${dayArr.length*80+50}px`">
              <div class="tr">
                <div class='td hr'>&emsp;</div>
                <div class="td" v-for="i in dayArr" :key="i">{{i}}</div>
                <div class='td hr'>&emsp;</div>
              </div>
              <div class="tr" v-for="(i, k) in task" :key="k">
                <div class='td hr'>&emsp;</div>
                <div class="td" v-for='d in dayArr' :class="new Date(d).getTime()>=i.date && new Date(d).getTime()<i.date+1000*60*60*24*i.day ?'active':'' " :key="d">&emsp;</div>
                <div class='td hr'>&emsp;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui-layout-south">
        <div class="inventory">
          <el-tabs v-model="activeName" tab-position="right">
            <el-tab-pane label="清单" name="a">
              <table border='0' cellspacing='0' cellpadding='0' v-if='nowId!==""'>
                <tr>
                  <!-- 清单  楼层   类型 单位  数量   单价   金额 -->
                  <th>清单</th>
                  <th>楼层</th>
                  <th>类型</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>单价</th>
                  <th>金额</th>
                </tr>
                <tr v-for="(i, k) in models" :key="k" v-if="i">
                  <!-- <td>{{i.name}}</td> -->
                  <td></td>
                  <td>{{task[nowId].name}}</td>
                  <td>{{i.type}}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <!-- <td>{{ new Date(task[nowId].date).Format('yyyy-MM-dd')}}</td>
              <td>{{task[nowId].day}}</td> -->
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane label="曲线" name="b">{{parent}}</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <addTask v-model="taskShow" :data='storey' @ok="ok"></addTask>
  </div>
</template>

<script>
import addTask from '@/modules/addTask'
import lib from '@/assets/js/api.js'
// import $ from 'jquery'
import './dhtml/dhtmlxgantt.js'
import './dhtml/dhtmlxgantt_marker.js'
import './dhtml/dhtmlxgantt_multiselect.js'
import './dhtml/locale_cn.js'
// import './dhtml/jquery.ui.all.js'
// import './dhtml/jquery.layout.js'
import jQuery from 'jquery'
import 'nicescroll'

export default {
  components: { addTask },
  mounted() {
    let that = this
    $('#MyViewerDivPlan').layout({
      // enable showOverflow on west-pane so popups will overlap north pane
      west__showOverflowOnHover: true,
      west__size: $(window).width() / 2,
      onresize: function() {
        that.setSizes()
      }

      //,	west__fxSettings_open: { easing: "easeOutBounce", duration: 750 }
    })
    $('#ui-layout-center').layout({
      // enable showOverflow on west-pane so popups will overlap north pane
      west__showOverflowOnHover: true,
      center__paneSelector: '.ui-layout-2cen',
      south__size: 350,
      onresize: function() {
        that.setSizes()
      }

      //,	west__fxSettings_open: { easing: "easeOutBounce", duration: 750 }
    })

    gantt.config.autoscroll = true
    gantt.config.multiselect = true
    gantt.config.scale_unit = 'month'
    gantt.config.date_scale = '%F, %Y'
    gantt.config.preserve_scroll = false
    gantt.config.scale_height = 50
    gantt.config.subscales = [{ unit: 'day', step: 7, date: '%j, %D' }]
    gantt.config.xml_date = '%Y-%m-%d'
    gantt.attachEvent('onTaskClick', function(id, e) {
      that.nowId = id - 1
      that.showModel(that.task[id - 1])
      if (!this.getTask(id).parent) {
        for (let i of that.task) {
          if (i.parent === id) that.showModel(i, true)
        }
      }
      return true
    })
    // // this.attachEvent('onBeforeLightbox')
    gantt.attachEvent('onBeforeLightbox', function(id) {
      if (that.taskShow) that.taskShow = false
      console.log(id, that.taskShow)
      // that.taskShow = true
      if (id > 50000) {
        that.parent = gantt.getTask(id).parent
        // if (gantt.getTask(id).parent) that.parent = gantt.getTask(id).parent
        if (that.parent === 0) {
          that.taskShow = true
        } else {
          that.parent = gantt.getTask(that.parent).parent
          if (that.parent === 0) {
            that.taskShow = true
          }
        }

        setTimeout(() => {
          gantt.deleteTask(id)
        }, 100)
      } else {
        // that.taskShow = true
        //   that.parent = id
        return true
      }
      return false
    })

    gantt.attachEvent('onBeforeTaskChanged', function(id, mode, task) {
      console.log('onBeforeTaskChanged', id, mode, task)
      that.task[id - 1].date = task.start_date.getTime()
      that.task[id - 1].day = task.duration
      localStorage.setItem(that.documentId + '_task', JSON.stringify(that.task))
      that.isMaxDay()
      return true
    })

    gantt.attachEvent('onAfterTaskDelete', function(id, item) {
      that.onDel(id - 1)
    })
    gantt.attachEvent('onAfterTaskUpdate', function(id, task) {
      // console.log('onBeforeTaskChanged', id, mode, task)
      console.log('onAfterTaskUpdate', id)
      that.task[id - 1].date = task.start_date.getTime()
      that.task[id - 1].day = task.duration
      that.task[id - 1].name = task.text
      localStorage.setItem(that.documentId + '_task', JSON.stringify(that.task))
      that.isMaxDay()
      // console.log(id, item)
    })

    if (this.$route.query.urn) {
      this.documentId = 'urn:' + this.$route.query.urn
    } else {
      window.close()
    }
    if (this.options.accessToken) {
      this.init()
    } else {
      lib.OAuth(this.oa).then(res => {
        localStorage.setItem(this.oa, res.data.access_token)
        this.options.accessToken = res.data.access_token
        this.init()
      })
    }
  },
  data() {
    return {
      oa: 'viewables:read',
      activeName: 'a',
      models: [],
      viewer: '',
      options: {
        env: 'AutodeskProduction',
        accessToken: localStorage.getItem('viewables:read')
      },
      documentId: 'urn:<YOUR_URN_ID>',
      storey: [],
      metadata: {},
      task: [],
      taskShow: false,
      nowId: '',
      dayArr: [],
      play: 0,
      parent: null,
      min: 0,
      opt: {
        cursorcolor: '#aaaaaa',
        cursorwidth: '4px',
        cursorborder: '0px',
        cursorborderradius: '0px'
      }
    }
  },
  methods: {
    attachEvent(name) {
      gantt.attachEvent(name, function(id, item) {
        console.log(name)
        if (name === 'onBeforeLightbox') return false
        return true
      })
    },
    playShow(time) {
      console.log(time)
      for (let i of this.task) {
        if (
          new Date(i.date + i.day * 1000 * 60 * 60 * 24).Format(
            'yyyy-MM-dd'
          ) === time
        ) {
          console.log(i)
          this.showModel(i, true)
        }
      }
    },
    playBefore() {
      this.play = 0
      this.viewer.hide(1)
    },
    playGo() {
      if (!this.dayArr.length) return
      setTimeout(() => {
        this.playShow(this.dayArr[this.play])
        this.play++
        if (this.play !== this.dayArr.length) this.playGo()
      }, 200)
    },
    isMaxDay() {
      if (!this.task.length) return
      let min = this.task[0].date,
        max = this.task[0].date + this.task[0].day * 1000 * 60 * 60 * 24
      for (let i of this.task) {
        if (i.date < min) min = i.date
        if (i.date + i.day * 1000 * 60 * 60 * 24 > max)
          max = i.date + i.day * 1000 * 60 * 60 * 24
      }
      console.log('最小時間', min)
      console.log('最大時間', max)
      let dayArr = []
      while (
        new Date(min).Format('yyyy-MM-dd') !==
        new Date(max + 1000 * 60 * 60 * 24).Format('yyyy-MM-dd')
      ) {
        dayArr.push(new Date(min).Format('yyyy-MM-dd'))
        min = min + 1000 * 60 * 60 * 24
      }
      console.log(dayArr)
      console.log('gantt', window.gantt)
      this.dayArr = dayArr
      this.play = dayArr.length
      this.min = min
      this.setSizes()
    },
    setSizes() {
      try {
        gantt.setSizes()
      } catch (e) {}
    },
    isSetTasks() {
      try {
        window.gantt.clearAll()
      } catch (e) {}
      window.gantt.init('dhtml', new Date(this.min))
      let data = []
      for (let i in this.task) {
        let ooj = {
          id: parseInt(i) + 1,
          text: this.task[i].name,
          start_date: new Date(this.task[i].date),
          duration: this.task[i].day
        }
        if (this.task[i].parent) {
          ooj.parent = parseInt(this.task[i].parent)
          ooj.open = false
        }
        console.log('数据：', i, this.task[i], ooj)
        data.push(ooj)
      }
      console.log('数据：', data)
      var tasks = {
        data,
        links: []
      }
      window.gantt.parse(tasks)
      this.setSizes()
    },
    isMaxDayScroll() {
      setTimeout(() => {
        jQuery('.schedule').niceScroll(this.opt)
      }, 100)
    },
    onDel(k) {
      let arr = []
      for (let i in this.task) {
        if (parseInt(i) !== k) arr.push(this.task[i])
      }
      this.task = arr
      localStorage.setItem(this.documentId + '_task', JSON.stringify(this.task))
      this.resize('.tree .table')
      this.isMaxDay()
      this.resize('.schedule')
    },
    niceScroll() {
      setTimeout(() => {
        jQuery('.inventory .el-tabs__content').niceScroll(this.opt)
        jQuery('.tree .table').niceScroll(this.opt)
      }, 100)
    },
    ok(form) {
      form.date = form.date.getTime()
      if (this.parent) form.parent = this.parent
      this.task.push(form)
      this.parent = null
      localStorage.setItem(this.documentId + '_task', JSON.stringify(this.task))
      this.isMaxDay()
      this.isSetTasks()
      this.resize('.schedule')
    },
    resize(className) {
      setTimeout(function() {
        jQuery(className)
          .getNiceScroll()
          .resize()
      }, 500)
    },
    addTask() {
      this.taskShow = true
    },
    isTask() {
      if (localStorage.getItem(this.documentId + '_task')) {
        this.task = JSON.parse(localStorage.getItem(this.documentId + '_task'))
        this.isMaxDay()
        this.isSetTasks()
        this.isMaxDayScroll()
      }
    },
    showModel(form, ifs) {
      if (!ifs) this.viewer.hide(1)
      this.models = []
      if (form && form.models)
        for (let i in form.models) {
          if (form.models[i]) {
            this.viewer.model.getProperties(parseInt(i), data => {
              for (let a of data.properties) {
                if (a.displayName === 'Type') {
                  data.type = a.displayValue
                  break
                }
              }
              this.models.push(data)
            })
            this.viewer.show(parseInt(i))
          }
        }
      this.resize('.inventory .el-tabs__content')
      // this.viewer.show(id)
      // this.nowId = id
    },
    init() {
      let that = this
      Autodesk.Viewing.Initializer(this.options, function onInitialized() {
        Autodesk.Viewing.Document.load(
          that.documentId,
          that.onDocumentLoadSuccess,
          that.onDocumentLoadFailure
        )
      })
    },
    onDocumentLoadSuccess(doc) {
      // A document contains references to 3D and 2D geometries.
      var geometries = doc.getRoot().search({ type: 'geometry' })
      if (geometries.length === 0) {
        console.error('Document contains no geometries.')
        return
      }

      // Choose any of the avialable geometries
      var initGeom = geometries[0]

      // Create Viewer instance
      var viewerDiv = this.$refs.viewerDiv
      console.log('initGeom', initGeom)
      var config = {
        extensions: initGeom.extensions ? initGeom.extensions() || [] : []
      }
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config)

      // Load the chosen geometry
      var svfUrl = doc.getViewablePath(initGeom)
      var modelOptions = {
        sharedPropertyDbPath: doc.getPropertyDbPath()
      }
      this.viewer.start(
        svfUrl,
        modelOptions,
        this.onLoadModelSuccess,
        this.onLoadModelError
      )
    },

    /**
     * Autodesk.Viewing.Document.load() failure callback.
     */
    onDocumentLoadFailure(viewerErrorCode) {
      console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
      if (viewerErrorCode === 4)
        lib.OAuth(this.oa).then(res => {
          localStorage.setItem(this.oa, res.data.access_token)
          window.location.reload()
        })
    },

    /**
     * viewer.loadModel() success callback.
     * Invoked after the model's SVF has been initially loaded.
     * It may trigger before any geometry has been downloaded and displayed on-screen.
     */
    onLoadModelSuccess(model) {
      console.log('onLoadModelSuccess()!')
      // console.log('Validate model loaded: ' + (this.viewer.model === model))
      // let mo = new Autodesk.Viewing.Model(model)
      // console.log(Autodesk.Viewing.Model)
      // console.log('getLayersRoot', mo.getInstanceTree())
      // console.log('getMetaData', model.getRoot()
      window.MyModel = this.viewer
      if (localStorage.getItem(this.documentId)) {
        try {
          this.metadata = this.calculateData(
            JSON.parse(localStorage.getItem(this.documentId))
          )
        } catch (e) {
          localStorage.removeItem(this.documentId)
          window.location.reload()
        }
      } else this.onMetadata()
      this.niceScroll()
      setTimeout(this.isTask, 2000)
    },

    /**
     * viewer.loadModel() failure callback.
     * Invoked when there's an error fetching the SVF file.
     */
    onLoadModelError(viewerErrorCode) {
      console.error('onLoadModelError() - errorCode:' + viewerErrorCode)
    },
    onMetadata(guid) {
      lib.ajax(
        {
          url:
            lib.designdata +
            '/' +
            this.$route.query.urn +
            '/metadata' +
            (guid ? '/' + guid : ''),
          method: 'GET',
          success: data => {
            console.log('designdata', guid, data.data)
            if (guid) {
              //   this.metadata[guid] = data.data.data
              if (!data.data.data) window.location.reload()
              localStorage.setItem(
                this.documentId,
                JSON.stringify(data.data.data)
              )
              this.metadata = this.calculateData(data.data.data, true)
            }
            if (data.data.data.metadata)
              for (let i of data.data.data.metadata) {
                this.onMetadata(i.guid)
              }
          }
        },
        'data:read'
      )
    },
    calculateData(data, ifs) {
      let obj = {
        name: data.name,
        id: data.objectid
      }
      if (data.objects) {
        for (let i of data.objects) {
          obj.children = this.calculateData(i, ifs)
        }
      }
      data.unfold = false
      if (data.objectid)
        this.viewer.model.getProperties(data.objectid, b => {
          if (this.isType(b)) {
            data.children = data.objects
            this.storey.push(data)
            console.log(data)
            if (ifs) {
              let models = []
              // models[data.objectid] = true
              this.task.push({
                name: data.name,
                date: new Date().getTime(),
                day: 1,
                models
              })
              localStorage.setItem(
                this.documentId + '_task',
                JSON.stringify(this.task)
              )
            }
          }
        })

      return obj
    },
    isType(b) {
      let type = 'IFCBUILDINGSTOREY'
      for (let i of b.properties) {
        if (i.displayName === 'Type' && i.displayValue === type) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang='less'>
@import url('./dhtml/dhtmlxgantt.css');

.ui-layout-pane {
  /* all 'panes' */
  background: rgb(255, 255, 255);
  /* border: 1px solid #BBB; */
  /* padding: 10px; */
  overflow: auto;
}

.ui-layout-resizer {
  /* all 'resizer-bars' */
  background: rgb(232, 232, 232);
}

.ui-layout-toggler {
  /* all 'toggler-buttons' */
  background: rgb(232, 232, 232);
}
.adsk-control.adsk-toolbar {
  bottom: auto !important;
  top: 10px;
}
#MyViewerDivPlan {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 100%;
  .el-progress-bar__innerText {
    display: none;
  }
  .el-progress-bar__inner {
    transition: all 0.2s;
  }
  .play {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    padding: 15px 20px;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    * {
      border-radius: 0 !important;
    }
    .el-progress {
      width: 100%;
    }
    .num {
      font-size: 12px;
      line-height: 18px;
      padding-left: 10px;
    }
    i {
      margin-left: 15px;
      font-size: 18px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  }
  .schedule {
    position: absolute;
    left: 360px;
    top: 0;
    right: 0;
    bottom: 0;
    .active {
      background-color: rgba(195, 214, 255, 0.5);
    }
    .tr {
      width: 100%;
    }
    .hr {
      width: 20px !important;
    }
    .td,
    .th {
      line-height: 36px;
      font-size: 12px;
      width: 80px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      float: left;
      text-align: center;
    }
  }
  .viewerDiv {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .tree {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    // right: 0;
    width: 100%;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .table {
      position: relative;
      width: 360px;
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 12px;
      overflow: hidden;
      table {
        width: 100%;
        th {
          font-weight: 700;
        }
        td,
        th {
          text-align: center;
          line-height: 36px;
          padding: 0 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          &.left {
            text-align: left;
          }
          i {
            cursor: pointer;
          }
        }
        .active {
          background-color: rgba(195, 214, 255, 0.1);
        }
      }
    }
  }
  .inventory {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    .el-tabs--right {
      position: relative;
      height: 100%;
    }
    .el-tabs__content {
      height: 100%;
    }
    table {
      width: 100%;
      th {
        font-weight: 700;
      }
      th,
      td {
        text-align: center;
        font-size: 12px;
        line-height: 36px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
