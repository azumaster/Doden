<template>
  <div class="navbar">
    <nav class="nav" @click="click">
      <label class="nav__button nav__button_upload" for="file" title="上传" role="button" v-show="!loader.loaded" @click="changchuanbtn"><Icon type="android-folder-open"></Icon></label>
     <!--  <button type="button" class="nav__button" data-action="restore" title="撤销 (Ctrl + Z)" v-show="editor.cropped || editor.cropping"><span>撤销</span></button> -->
      <button type="button" class="nav__button nav_close" data-action="remove" title="撤销 (Ctrl + Z)" v-show="editor.cropped || editor.cropping"><Icon type="close"></Icon></button>
      <button type="button" class="nav__button nav__button--danger" data-action="remove" title="删除 (Delete)" v-show="loader.loaded || !editor.cropping"><span>取消</span>
      </button>
      <!-- <button type="button" class="nav__button nav__button--danger" data-action="clear" title="取消 (Esc)" v-show="editor.cropping"><span>取消</span></button> -->
      <button type="button" class="nav__button nav__button--success" data-action="crop" title="确定 (Enter)"  v-show="editor.cropping"><span>确定</span></button>
       <!-- <button type="button" class="nav__button nav__button--success"  title="确定" @click="saveImg"  v-show="editor.cropped"><span>确定</span></button> -->
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        downloadable: typeof document.createElement('a').download !== 'undefined',
      };
    },

    computed: {
      editor() {
        return this.$store.state.editor;
      },

      loader() {
        return this.$store.state.loader;
      }
    },

    methods: {
      click({ target }) {
        const action = target.dataset.action || target.parentNode.dataset.action;

        if (action) {
          this.$emit('change', action);
        }
      },
      changchuanbtn () {
        this.$store.state.editor.cropinput = false;
        console.log('点击之后',this.$store.state.editor.cropinput);
      },
      saveImg () {
       this.$store.state.editor.cropinit = false;
       this.$store.state.editor.cropdiv = false;
       this.$store.state.editor.imgbase64 = this.loader.url;
      },
    },
  };
</script>

<style scoped lang="less">
  .navbar {
    float: right;
  }

  .nav {
    .nav__button {
      background-color: transparent;
      border-width: 0;
      color: #fff;
      cursor: pointer;
      display: block;
      float: left;
      font-size: 20px;
      height: 50px;
      line-height: 48px;
      text-align: center;
      width: 350px;
    /*  margin-left: 20px;*/
      outline: none;
    }
    .nav__button--success {background: #45c8dc}
    .nav__button--danger{background: #e5e7e6;color: #525661}
    .nav_close{position: fixed;position: fixed;right: 50px;top: 50px;color: #525661;}

  }
</style>
