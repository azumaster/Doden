# components组件使用文档

## 底部划出对话框 `comfirmAtBottom.vue`
> ## @version 0.0.1.20170825
> ## @author 杨陈鹏

### 组件参数

名称 | 描述 | 类型 | 默认值 | 示例值 | 是否必须 |
---- | ---- | ----- | ----- | ----- | ----- |
:show | 控制是否显示 | bool | false | :show="false" | 是 |
:title | 弹窗标题 | string | 空字符串 | :title="标题" | 否 |
:message | 内容 | string | 空字符串 | :message="标题" | 否 |
:buttons | 按钮组 | array | `[{text:'关闭'}]` | :buttons="标题" | 否 |
:bg-event | bool | 点击背景是否关闭 | false | :bg-event="true" | 否 |


### 事件

事件名称 | 描述
---- | ----
@close | 组件内部触发关闭,通知父组件事件
@button.id | 底部按钮触发事件,例如: 某个按钮的ID为 `test` 那么在组件上面接收这个按钮的点击事件就为`@test`

### 示例代码及说明(请详细阅读,注释)
```html
<template>
    <ui-confirm-at-bottom
      :title="data.title"
      :message="data.message"
      :buttons="data.buttons"
      :show="is_show"
      @goBack="goBack"
      @close="res => is_show = res"></ui-confirm-at-bottom>
</template>
<script>
  import confirmAtBottom from 'path/to/components/confirmAtBottom.vue'
  export default {
    components: {
      'ui-confirm-at-bottom': confirmAtBottom
    },
    data () {
      return {
        data: {
          title: '',
          buttons: [
            {
              text: '关闭',//按钮显示文字
            },
            {
              id: 'goBack',// 按钮ID,必须是字母,此ID将会作为组件按钮自定义事件,如果没有此ID,则点击该按钮将关闭组件
              text: '返回上一页',
              is_close: true,// 点击按钮之后是否关闭组件
            }
          ]
        }
      }
    },
    methods: {
      // 自定义的按钮事件(事件名称为按钮的ID号)
      goBack () {
        // Todo code...
      }
    }
  }
</script>
```
