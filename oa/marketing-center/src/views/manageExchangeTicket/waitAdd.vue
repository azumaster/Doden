<template>
	<div>
		<Card>
		<Row>
		<Col>
			<Select v-model="ticketmodel" style="width:200px;margin-bottom: 21px;" @on-change="typeChange">
        <Option v-for="item in ticketList" :value="item.type_no" :key="item">{{ item.name }}</Option>
    </Select>
		</Col>
		<!-- 右侧 -->
        <div v-for="item in waitData" style="margin-bottom: 20px;">
        <Col span="16" push="8">
        	<div class="flex" style="height: 200px;">
        		<h4>{{item.title}}</h4>
                        <p>消耗钻石：{{item.price}}</p>
                        <p>兑换内容：{{item.worth}}天</p>
                        <p>上架时间：{{item.sell_time}}</p>
                        <p>下架时间：{{item.end_time}}</p>
        	</div>
        </Col>
        <!-- 左侧 -->
        <Col span="8" pull="16">
        	<div class="img" id="img">
        		<img :src="item.image" alt="图片">
        	</div>
        </Col>
        <Col>
        	 <Button type="primary" shape="circle" @click="stopUsing(`${item.id}`, `${item.sell_time}`, `${item.end_time}`)">停用该券</Button>
        	 <Button type="primary" shape="circle" @click="use(`${item.id}`, `${item.sell_time}`, `${item.end_time}`)">上线该券</Button>
        </Col>
        </div>
        <Page :current="waitparams.page" show-elevator :total="total" simple @on-change="pageChange"></Page>
    </Row>
    </Card>
    <!-- 确认停用弹出框 -->
	</div>
</template>
<script>
    // import Localbase from '../../common/localbase.js';  //本地
    import Base from '../../common/base.js'; //线上
    export default {
        // mixins: [Localbase],
        mixins: [Base],
        data () {
            return {
                total: 0,
                waitData: {},
                waitparams: {
                    status: 1, //1为待上架
                    page:1,
                    size:10
                },
                useParams: { //停用参数
                id: 0,
                option_type: 3,
                sell_time:'',
                end_time: ''
                },
                toUsingParams: { //正在使用参数
                id: 0,
                sell_time:'',
                end_time: ''
                },
                ticketmodel: ''
            }
        },
        methods: {
            typeChange (e) {
                if (e == 'all_ticket') {delete this.waitparams.type_no;this.getWaitData();return;}
                this.waitparams.page = 1;
                this.waitparams.type_no = e;
                this.getWaitData();
            },
            stopUsing (id,sell_time,end_time) {
                var _this = this;
                this.$Modal.confirm({
                title: '' ,
                content: '是否确认停用该券',
                onOk: function () {
                    _this.stop(id,sell_time,end_time);
                }
               });
            },
            stop (id,sell_time,end_time) {
               var _this = this;
                _this.getNowTime();
                _this.useParams.id = id;
                _this.useParams.sell_time = _this.pretime;
                _this.useParams.end_time = _this.nowTime;
               _this.$http({
                method: 'POST',
                body: _this.useParams,
                url: '/marketing/exchange-ticket/sell-status/update',
                header: 'application/json'
               }).then(response => {
                    if(response.body.code == 0) {
                            alert("兑换券停用成功");
                             _this.getWaitData(); 
                    
                    }
                    else {
                        _this.$Modal.error({
                        title: '   ',
                        content: '兑换权状态更改失败'
                    });
                    }
               });
            },
            use (id,sell_time,end_time) {
                var _this = this;
                this.$Modal.confirm({
                title: '' ,
                content: '是否确认上架该券',
                onOk: function () {
                    _this.onsell(id,sell_time,end_time);
                }
               });
            },
            onsell (id,sell_time,end_time) {
                var _this = this;
                _this.getNowTime();
                _this.toUsingParams.id = id;
                _this.toUsingParams.sell_time = _this.nowTime;
                _this.toUsingParams.end_time = end_time;
                _this.$http({
                method: 'POST',
                body: _this.toUsingParams,
                url: '/marketing/exchange-ticket/sell-status/update',
                header: 'application/json'
               }).then(response => {
                    if(response.body.code == 0) {
                        _this.$Modal.success({
                        title: '   ',
                        content: '兑换权状态更改成功'
                    });
                    _this.getWaitData();
                    }
                    else {
                        _this.$Modal.error({
                        title: '   ',
                        content: '兑换权状态更改成功'
                    });
                    }
               });
            },
            pageChange (e) {
                this.waitparams.page = e;
                this.getWaitData();
            },
            getWaitData () {
                var _this = this;
                _this.$http({
                    method:'GET',
                    params: _this.waitparams,
                    url: '/marketing/exchange-ticket/list',
                    // url: './mock/using.json',
                    header: 'application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.waitData = response.body.data.lists;
                        for (var i in _this.waitData) {
                            _this.waitData[i].image = 'http://img.idongpin.com'+ _this.waitData[i].image;
                        };
                        _this.total = response.body.data.total;
                    }
                });
            }
        },
        created () {
            this.getWaitData();
        }
    }
</script>
<style scoped>
    .flex {
        display: flex;
        flex-direction: column;
        justify-content:space-between;
    }
</style>