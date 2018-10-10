<template>
  <div id="MyViewerDiv" ref="viewerDiv">
    <i class="el-icon-info" @click='$router.push("/modelPlan?urn="+$route.query.urn)'></i>
  </div>
</template>

<script>
import lib from '@/assets/js/api.js'
export default {
  mounted() {
    console.log(this.$route)
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
      viewer: '',
      options: {
        env: 'AutodeskProduction',
        accessToken: localStorage.getItem('viewables:read')
      },
      documentId: 'urn:<YOUR_URN_ID>',
      metadata: {}
    }
  },
  methods: {
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
      // console.log('getMetaData', model.getRoot())
      window.myModel = this.viewer
      console.log('getMetaData')
      // this.onMetadata()
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
            if (guid) this.metadata[guid] = data.data.data
            if (data.data.data.metadata)
              for (let i of data.data.data.metadata) {
                this.onMetadata(i.guid)
              }
          }
        },
        'data:read'
      )
    }
  }
}
</script>

<style lang='less'>
#MyViewerDiv {
  position: relative;
  width: 100%;
  height: 100%;
  .el-icon-info {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 99999;
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
