<template>
	<div>
		<Card>
        		<Row>
        		<Col>
                			<Select v-model="ticketmodel" style="width:200px;margin-bottom: 21px;" @on-change="typeChange">
                        <Option v-for="item in ticketList" :value="item.type_no" :key="item">{{ item.name }}</Option>
                    </Select>
        		</Col>
                <div v-for="itme in data" style="margin-bottom: 20px;">
        		<!-- 右侧 -->
                <Col span="16" push="8">
                	<div class="flex" style="height: 200px;">
                		<h4>{{itme.title}}</h4>
                		<p>消耗钻石：{{itme.price}}</p>
                		<p>兑换内容：{{itme.worth}}天</p>
                		<p>上架时间：{{itme.sell_time}}</p>
                		<p>下架时间：{{itme.end_time}}</p>
                	</div>
                </Col>
                <!-- 左侧 -->
                <Col span="8" pull="16">
                	<div class="img" id="img">
                		<img :src="itme.image" alt="图片" >
                	</div>
                </Col>
                <Col>
                	 <Button type="primary" shape="circle" @click="stopUsing(`${itme.id}`, `${itme.sell_time}`, `${itme.end_time}`)">停用该券</Button>
                </Col>
            </div>
            <Page :current="usingparams.page" show-elevator :total="total" simple @on-change="pageChange"></Page>
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
                ticketmodel: '',
                usingparams: {
                    status: 2,
                    page:1,
                    size:10
                },
                useParams: { //停用参数
                id: 0,
                sell_time:'',
                end_time: '',
                option_type: 3
                },
                data: {}
            }
        },
        methods: {
            // 获得使用中的券
            pageChange (e) {
                this.usingparams.page = e;
                this.getUsing();
            },
            getUsing () {
                var _this = this;
                _this.$http({
                    method:'GET',
                    params: _this.usingparams,
                    url: '/marketing/exchange-ticket/list',
                    // url: './mock/using.json',
                    header: 'application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.data = response.body.data.lists;
                        for (var i in _this.data) {
                            _this.data[i].image = 'http://img.idongpin.com'+ _this.data[i].image;
                        };
                        _this.total = response.body.data.total;
                    }
                });
            },
            typeChange (e) {
                if (e == 'all_ticket') {delete this.usingparams.type_no;this.getUsing();return;}
                this.usingparams.page = 1;
                this.usingparams.type_no = e;
                this.getUsing();
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
                _this.useParams.sell_time = sell_time;
                _this.useParams.end_time = _this.nowTime;
               _this.$http({
                method: 'POST',
                body: _this.useParams,
                url: '/marketing/exchange-ticket/sell-status/update',
                header: 'application/json'
               }).then(response => {
                    if(response.body.code == 0) {
                            alert('兑换券停用成功');
                            _this.getUsing();
                    }
                    else {
                        _this.$Modal.error({
                        title: '   ',
                        content: '兑换券状态更改失败'
                    });
                    }
               });
            }
        },
        created () {
            this.getUsing();
        }
    }
</script>
<style>
    .flex {
        display: flex;
        flex-direction: column;
        justify-content:space-between;
    }
</style>