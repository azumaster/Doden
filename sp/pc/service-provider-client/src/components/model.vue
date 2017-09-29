<template>
    <div ref="mask" class="model-mask">
        <div class="model">
            <header class="model-header">
                <h1>{{title}}</h1>
                <span class="close-icon icon icon-cha" @click="closeModel"></span>
            </header>
            <div class="model-body">
                <slot name="body"></slot>
            </div>
            <footer class="model-footer">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title'],
        methods: {
            closeModel: function () {
                this.$store.state.showPutaway = false;
                this.$store.state.showPutaway = false;
            }
        }
    };
</script>

<style>
    .model-mask{
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: fixed;
        z-index: 1000;
        background: rgba(0, 0, 0, .5);
    }

    .model {
        width: 416px;
        height: auto;
        background: #ffffff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #f0f0f0;
    }
    .model-header{
        height: 57px;
        position: relative;
    }
    .model-header h1{
        color: #666666;
        font-size: 18px;
        line-height: 57px;
        text-align: center;
        font-weight: normal;
    }
    .model-header .close-icon{
        position: absolute;
        cursor: pointer;
        right: 0;
        top: 0;
        width: 34px;
        height: 32px;
        background: #f0f0f0;
        text-align: center;
        line-height: 32px;
        color: #45c8dc;
        font-size: 16px;
    }
    .model-body{
        width: 299px;
        margin: 15px auto 30px;
    }
    .model-body p{
        line-height: 30px;
        color: #666666;
        text-indent: 2em;
        font-size: 16px;
    }
    .model-footer{
        margin-bottom: 30px;
    }
    .model-footer .btn-group{
        width: 299px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }
    .model-footer .btn-group .model-btn{
        width: 120px;
        height: 37px;
        text-align: center;
        line-height: 37px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }
    .model-footer .btn-group .model-btn:active{
        background: #00CCCC;
    }
    .model-footer .btn-group .model-btn.ok{
        background: #45c8dc;
        color: #ffffff;
    }
</style>