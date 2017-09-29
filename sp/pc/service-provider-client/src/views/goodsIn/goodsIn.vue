<template>
  <div id="goodsIn">
       <Button>冻品商城</Button>
       <br/>
       <form action="/cart/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file"/>
            <input type="submit" />
        </form>
        <Row>
          <Col span="3"><DatePicker type="date" format="yyyy-MM-dd" placeholder="选择开始日期"  @on-change="startTime" style="width: 150px"></DatePicker></Col>
          <Col span="3"><DatePicker type="date" format="yyyy-MM-dd" placeholder="选择结束日期"  @on-change="endTime" style="width: 150px"></DatePicker></Col>
        </Row>
        <Button type="success" @click="downfile">下载近两日进货记录</Button>
        <!-- <button >下载近两日进货记录</button> -->
        <!-- <a href="/cart/download" target="_blank">下载近两日进货记录</a> -->
  </div>
</template>
<script>
export default {
  data () {
    return{
       params: {
        start: '',
        end: ''
      }
    }
  },
  methods: {
    startTime (e) {
      this.params.start = e;
    },
    endTime (e) {
      this.params.end = e;
    },
    downfile () {
      window.open('/cart/download?start='+this.params.start+'&end='+this.params.end);
    }
  }
}
</script>

