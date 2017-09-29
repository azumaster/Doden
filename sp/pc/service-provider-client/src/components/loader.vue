<template>
  <div class="loader" @change="change" @dragover="dragover" @drop="drop">
    <p>
      <label class="browse">
        <input class="uplondImgBtn" id="file" type="file"  accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff" capture>
        <!-- <Button type="primary" @click="shangchuanPic" >上传照片</Button> -->
      </label>
    </p>
  </div>
</template>

<script>
  export default {
    methods: {
      read(files) {
        return new Promise((resolve, reject) => {
          if (!files || files.length === 0) {
            resolve();
            return;
          }

          const file = files[0];

          if (/^image\/\w+$/.test(file.type)) {
            const reader = new FileReader();

            reader.onload = () => {
              this.$store.dispatch('loader/update', {
                loaded: true,
                name: file.name,
                type: file.type,
                url: reader.result,
              });

              resolve();
            };

            reader.onerror = reject;
            reader.onabort = reject;
            reader.readAsDataURL(file);
          } else {
            reject('请选择规定的图片格式');
          }
        });
      },

      change({ target }) {
        this.$store.state.editor.cropinit = true;
        this.read(target.files).then(() => {
          target.value = '';
        }).catch((e) => {
          target.value = '';
          this.alert(e);
        });
      },

      dragover(e) {
        e.preventDefault();
      },

      drop(e) {
        e.preventDefault();
        this.read(e.dataTransfer.files).catch(this.alert);
      },

      alert(e) {
        window.alert(e && e.message ? e.message : e);
      },
    },
  };
</script>

<style scoped lang="less">
  .loader {
        margin-left: -145px;
        opacity: 0;

    p {
      color: #999 !important;
      display: table-cell !important;
      text-align: center !important;
      vertical-align: middle !important;
    }
  }

  .browse {
    color: #0074d9;
    cursor: pointer;
    margin-left: 4px;

    /*:hover {
      color: color(#0074d9 lightness(50%));
      text-decoration: underline;
    }*/
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>
