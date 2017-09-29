<template>
	<div>
		<Card>
		<Row>
		<Col>
			<Select v-model="ticketmodel" style="width:200px;margin-bottom: 21px;" @on-change="typeChange">
        <Option v-for="item in ticketList" :value="item.type_no" :key="item">{{ item.name }}</Option>
    </Select>
		</Col>
        <div v-for="item in stopData" style="margin-bottom: 20px;">
		<!-- 右侧 -->
        <Col span="16" push="8" style="margin-bottom: 40px;">
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
        		<img :src="'http://img.idongpin.com'+item.image" alt="图片">
        	</div>
        </Col>
        <!-- <Col>
        	 <Button type="primary" shape="circle" @click="use(`${item.id}`)">上线该券</Button>
        </Col> -->
        </div>
        <Page :current="stopparams.page" show-elevator :total="total" simple @on-change="pageChange"></Page>
    </Row>
    </Card>
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
                Alertmodal2: false,
                ticketmodel: '',
                stopparams:{
                    status: 3,  //已下架
                    page:1,
                    size:10
                },
                stopData: {},
                total: 0,
                useParams: { //重新上架
                id: 0,
                sell_time:'',
                end_time: ''
                },
                localdata: {}
            }
        },
        methods: {
            typeChange(e) {
                if (e == 'all_ticket') {delete this.stopparams.type_no; this.getStopData(); return;}
                this.stopparams.page = 1;
                this.stopparams.type_no = e;
                this.getStopData();
            },
            pageChange (e) {
                this.stopparams.page = e;
                this.getStopData();
            },
            getStopData () {
                var _this = this;
                _this.$http({
                    method:'GET',
                    params: _this.stopparams,
                    url: '/marketing/exchange-ticket/list',
                    // url: './mock/using.json',
                    header: 'application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.stopData = response.body.data.lists;
                        _this.localdata = response.body.data.lists;
                        _this.total = response.body.data.total;
                    }
                });
            }
        },
        created () {
            this.getStopData();
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