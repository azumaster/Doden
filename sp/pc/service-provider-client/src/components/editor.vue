<template>
  <div class="editor">
    <div class="canvas" @dblclick="dblclick">
      <img ref="image" :alt="loader.name" class="canvasImg" :src="loader.url" @load="start">
    </div>
   <!--  <div class="toolbar" v-if="cropper" @click="click"> -->
     <!--  <button class="toolbar__button" data-action="crop" title="裁剪"><Icon type="ios-crop-strong"></Icon></button>
      <button class="toolbar__button" data-action="zoom-in" title="放大"><Icon type="ios-plus-empty"></Icon></button>
      <button class="toolbar__button" data-action="zoom-out" title="缩小"><Icon type="ios-minus-empty"></Icon></button>
      <button class="toolbar__button" data-action="rotate-left" title="向左旋转"><Icon type="ios-undo-outline"></Icon></button>
      <button class="toolbar__button" data-action="rotate-right" title="向右旋转"><Icon type="ios-redo-outline"></Icon></button> -->
   <!--  </div> -->
  </div>
</template>

<script>
  import Cropper from 'cropperjs';
  export default {
    data() {
      return {
        cropper: null,
        canvasData: null,
        cropBoxData: null,
        data: null,
      };
    },

    computed: {
      editor() {
        return this.$store.state.editor;
      },

      loader() {
        return this.$store.state.loader;
      },
    },

    mounted() {
      window.addEventListener('keydown', (this.onKeydown = this.keydown.bind(this)));
    },

    beforeDestroy() {
      window.removeEventListener('keydown', this.onKeydown);
      this.stop();
    },

    methods: {
      click({ target }) {
        const cropper = this.cropper;
        const action = target.dataset.action || target.parentNode.dataset.action;

        switch (action) {
          case 'move':
          case 'crop':
            cropper.setDragMode(action);

            break;

          case 'zoom-in':
            cropper.zoom(0.1);
            break;

          case 'zoom-out':
            cropper.zoom(-0.1);
            break;

          case 'rotate-left':
            cropper.rotate(-90);
            break;

          case 'rotate-right':
            cropper.rotate(90);
            break;

          case 'flip-horizontal':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;

          case 'flip-vertical':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;

          default:
        }
      },

      keydown(e) {
        switch (e.key) {
          // Undo crop
          case 'z':
            if (e.ctrlKey) {
              e.preventDefault();
              this.restore();
            }

            break;

          // Delete the image
          case 'Delete':
            this.reset();
            break;

          default:
        }

        const cropper = this.cropper;

        if (!cropper) {
          return;
        }

        switch (e.key) {
          // Crop the image
          case 'Enter':
            this.crop();
            break;

          // Clear crop area
          case 'Escape':
            this.clear();
            break;

          // Move to the left
          case 'ArrowLeft':
            e.preventDefault();
            cropper.move(-1, 0);
            break;

          // Move to the top
          case 'ArrowUp':
            e.preventDefault();
            cropper.move(0, -1);
            break;

          // Move to the right
          case 'ArrowRight':
            e.preventDefault();
            cropper.move(1, 0);
            break;

          // Move to the bottom
          case 'ArrowDown':
            e.preventDefault();
            cropper.move(0, 1);
            break;

          // Enter crop mode
          case 'c':
            cropper.setDragMode('crop');
            break;

          // Enter move mode
          case 'm':
            cropper.setDragMode('move');
            break;

          // Zoom in
          case 'i':
            cropper.zoom(0.1);
            break;

          // Zoom out
          case 'o':
            cropper.zoom(-0.1);
            break;

          // Rotate left
          case 'l':
            cropper.rotate(-90);
            break;

          // Rotate right
          case 'r':
            cropper.rotate(90);
            break;

          // Flip horizontal
          case 'h':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;

          // Flip vertical
          case 'v':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;

          default:
        }
      },

      dblclick(e) {
        if (e.target.className.indexOf('cropper-face') >= 0) {
          e.preventDefault();
          e.stopPropagation();
          this.crop();
        }
      },

      start() {
        const editor = this.editor;
        editor.cropped = false;

        this.cropper = new Cropper(this.$refs.image, {
          aspectRatio: 2 / 1,
          dragMode: 'move',
          background: false,
          responsive: true,
          movable: false,
          autoCropArea: .8,
          zoomable: false,
          mouseWheelZoom: false,
          ready: () => {
            if (this.data) {
              this.cropper
                .crop()
                .setData(this.data)
                .setCanvasData(this.canvasData)
                .setCropBoxData(this.cropBoxData);

              this.data = null;
              this.canvasData = null;
              this.cropBoxData = null;
            }
          },
          crop: ({ detail }) => {
            if (detail.width > 0 && detail.height > 0 && !editor.cropping) {
              this.$store.dispatch('editor/update', {
                cropping: true,
              });
            }
          },
        });
      },

      stop() {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
          this.$store.dispatch('editor/update', {
            cropping: false,
          });
        }
      },

      crop() {
        const cropper = this.cropper;
        const { type, url } = this.loader;

        if (this.editor.cropping) {
          this.data = cropper.getData();
          this.canvasData = cropper.getCanvasData();
          this.cropBoxData = cropper.getCropBoxData();
          this.data = cropper.getData();
          this.$store.dispatch('editor/update', {
            cropped: true,
            cropping: false,
          });
          let afterUrl = cropper.getCroppedCanvas(type === 'image/png' ? null : {
              fillColor: '#fff',
            }).toDataURL(type)
          this.$store.dispatch('loader/update', {
            previousUrl: url,
            url: afterUrl
          });
          this.stop();
          this.$store.state.editor.cropinit = false;
          this.$store.state.editor.cropdiv = false;
          this.$store.state.editor.imgbase64 = afterUrl;
        }
      },

      clear() {
        if (this.editor.cropping) {
          this.cropper.clear();
          this.$store.dispatch('editor/update', {
            cropping: false,
          });
        }
      },

      restore() {
        if (this.editor.cropped) {
          this.$store.dispatch('editor/update', {
            cropped: false,
          });
          this.$store.dispatch('loader/update', {
            previousUrl: '',
            url: this.loader.previousUrl,
          });
        }
      },

      reset() {
        this.stop();
        this.$store.dispatch('editor/remove');
        this.$store.dispatch('loader/remove');
      },
    },
  };
</script>

<style scoped lang="less">
  .editor {
    height: 100%;
  }

  .canvas {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;

    .canvasImg {
      /*height: 50%;*/
      width: 100%;
      /*padding: 20px 0;*/
    }
  }

  .toolbar {
    display: flex;
    justify-content: center;
   /* background-color: #45c8dc;*/
    bottom: 32px;
    color: #fff;
    height: 32px;
    position: absolute;
    max-width: 600px;
    z-index: 2015;

    .toolbar__button {
      background-color: transparent;
      border-width: 0;
      color: #fff;
      cursor: pointer;
      display: block;
      float: left;
      font-size: 20px;
      height: 32px;
      text-align: center;
      width: 32px;
      margin-left: 20px;
    }
  }
</style>
