/*
* 待审核页面控制文件*/
import MarketShopList from './market-shop-list.jsx';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Table from './../../../../components/table.jsx';
import GoodsInfoCtrl from '../goods-info/goods-info-ctrl.jsx';
import PageCtrlBar from '../../../../components/page/paging.js';
import Refresh from '../../../../components/refresh/refresh.js';

class GoodsAudit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAreaId: 0,      //当前大区ID;
            areaList: [],          //大区数据;
            goodsList: [],         //商品列表;
            totalPage: 1,   //总页数;
            defaultParam: {
                shop_id: null,        //店铺ID;
                goods_status: 0,   //店铺筛选中的店铺状态,0=全部 1=新增 5=已拒绝 6=修改;
                page: 1,           //页吗;
                size: 30,           //每页数据条数;
                sort_field: 'id'
            },
            goodsInfoPanel: '',     //商品详细页面;
            marketUpdate: false     //变化时更新店铺列表数据;
        };
        this.setShopId = this.setShopId.bind(this);
        this.createArea = this.createArea.bind(this);
        this.setCurrentArea = this.setCurrentArea.bind(this);
        this.getGoodsList = this.getGoodsList.bind(this);
        this.setShopState = this.setShopState.bind(this);
        this.createTable = this.createTable.bind(this);
        this.operate = this.operate.bind(this);
        this.getSupplierInfo = this.getSupplierInfo.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.changePage = this.changePage.bind(this);
        this.order = this.order.bind(this);
    }

    componentWillMount() {
        this.getArea();
    }

    //获取大区;
    getArea() {
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0){
                let currentAreaId = res.data[0].area_id;
                this.state.areaList = res.data;
                this.state.currentAreaId = currentAreaId;
                this.getGoodsList();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //生成大区;
    createArea(){
        let btnNames = [],
            bindData = [];
        this.state.areaList.map((area) => {
            btnNames.push(area.area_name);
            bindData.push(area.area_id);
        });
        return(
            <BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.setCurrentArea.bind(this)}
                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentAreaId}/>
        );
    }

    //切换大区;
    setCurrentArea(e) {
        let area_id = e.target.dataset.index,
            param = this.state.defaultParam;
        param.goods_status = 0;
        this.setState({currentAreaId: area_id, goodsList: [], defaultParam: param}, this.getGoodsList);  //设置默认大区的ID;
    }

    //设置店铺ID并获取该ID下的商品列表;
    setShopId(key, val) {
        let param = this.state.defaultParam;
        if(key == 'shop_id') {
            param[key] = val;
            param.market_id = null;
        }else {
            param[key] = val;
            param.shop_id = null;
        }
        param.goods_status = 0;
        this.getGoodsList();
    }

    getGoodsList() {
        let param = this.state.defaultParam;
        param.area_id = this.state.currentAreaId;
        //if(param.shop_id <= 0) return;
        H.server.goods_newGoods_list(param, (res) => {
            if(res.code == 0){
                let data = res.data.goods;
                for(let i = 0 ; i < data.length ; i++) {
                    data[i].shop_id = data[i].shops.shop_id;
                    data[i].shop_name = data[i].shops.shop_name;
                    data[i].market_name = data[i].markets.market_name;
                }
                this.setState({
                    goodsList: data,
                    totalPage: Math.ceil(res.data.total/param.size)
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //设置筛选店铺状态选项
    setShopState(e) {
        let shopState = e.target.dataset.index,
            param = this.state.defaultParam;
        param.goods_status = shopState;
        this.getGoodsList();
    }

    order(e) {
        let index = e.target.parentNode.dataset.index,
            param = this.state.defaultParam;
        switch (index) {
            case '0':
                param.sort_field = 'id';
                this.getGoodsList();
                break;
            case '6':
                param.sort_field = 'updated_at';
                this.getGoodsList();
                break;
        }
    }

    createTable() {
        let headlines = ['序号', '商品ID', '供应商', '品名', '单价', '市场', '添加时间', '更新时间', '状态', '操作'],
            order = ['order', 'goods_id', 'shop_name', 'goods_name', 'goods_price', 'market_name', 'add_time', 'update_time', 'goods_status', 'goods_status'],
            status = {8: {1: '新增', 5: '已拒绝', 6: '修改'}},
            statusOperate = {1: ['详细', '通过', '拒绝', '删除'], 5: ['详细', '通过', '删除'], 6: ['详细', '通过', '拒绝', '删除']},
            fn = {
             2: this.getSupplierInfo,
             9: this.operate
            },
            headOperate = {
                1: this.order,
                7: this.order
            },
            headStyle = 'glyphicon sort-icon';
         let goodsList = this.state.goodsList;
         goodsList.map((goods, index) => {
             goods.order = index+1;
             if(goods.price_status == 2){
                 goods.goods_status = 1;
             }
         });
         return(
             <Table values={this.state.goodsList} headlines={headlines} order={order} bodyOperate={fn} id="goods_audit"
                statusOperate={statusOperate} status={status} headOperate={headOperate} headStyle={headStyle}/>
         );
    }

    //获得供应商的信息
    getSupplierInfo(e){
        let index = e.target.dataset.index;
        H.server.goods_shop_info({shop_id: this.state.goodsList[index].shop_id}, (res) => {
            if(res.code == 0){
                let data = res.data;
                H.Modal({
                    title: '供应商信息',
                    width: '450',
                    height: '550',
                    content: '<p>供应商：'+ data.shop_name +'</p>'+
                    '<p>市场：'+ data.market_name +'</p>'+
                    '<p>接单电话：'+ data.order_receive_tel +'</p>'+
                    '<p>老板电话：'+ data.boos_tel+'</p>'+
                    '<p>主营业务：'+ data.business_types+'</p>'+
                    '<p>详细地址：'+ data.shop_address+'</p>',
                    okText: '关闭'
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //关闭商品详情页面;
    closePanel() {
        this.setState({goodsInfoPanel: ''});
    }

    //对当前页面的设置;
    changePage(n) {
        let param = this.state.defaultParam,
            newParam = Object.assign(param, n);
        this.setState({defaultParam: newParam}, () => {
            this.getGoodsList();
        });
    }

    //操作;
    operate(e){
        let html = $(e.target).html(),
            index = e.target.parentNode.dataset.index;
        switch(html){
            case '详细':
                let Panel = (
                    <GoodsInfoCtrl closePanel={this.closePanel} goodsId={this.state.goodsList[index].goods_id} areaId={this.state.currentAreaId} getGoodsList={this.getGoodsList}/>
                );
                this.setState({goodsInfoPanel: Panel});
                break;
            case '通过':
                H.Modal({
                    title: '审核通过',
                    content: '<p>审核通过之后可在普通商品中查看此商品</p>',
                    okText: '确定',
                    cancel: true,
                    okCallback: () => {
                        H.server.goods_audit_pass(JSON.stringify({goods_id: this.state.goodsList[index].goods_id}), (res) => {
                            if(res.code == 0){
                                this.getGoodsList();
                                this.state.marketUpdate = !this.state.marketUpdate;
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '拒绝':
                let goodsItem = this.state.goodsList[index];
                let thatModal = H.Modal({
                    title: '拒绝通知',
                    width: '500',
                    content: '<p><label style="display: inline-block;width: 75px">品名：</label>'+goodsItem.goods_name+'</p>' +
                    '<p><label style="display: inline-block;width: 75px">供应商：</label>'+goodsItem.shop_name+'</p>'+
                    '<p><label style="display: inline-block;width: 75px">拒绝原因：</label>' +
                    '<select value="商品照片模糊不清，请重新拍照上传" class="form-control" style="width: 350px;display: inline;" id="audit_refused_choose">' +
                    '<option value="商品照片模糊不清，请重新拍照上传">商品照片模糊不清，请重新拍照上传</option>' +
                    '<option value="商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片">商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片</option>' +
                    '<option value="图片与商品信息不符">图片与商品信息不符</option>' +
                    '<option value="缺少明显“清真”标记的照片">缺少明显“清真”标记的照片</option>' +
                    '<option value="抄码商品的重量和金额必须填最大值，不能按公斤报价">抄码商品的重量和金额必须填最大值，不能按公斤报价</option>' +
                    '<option value="商品重量错误">商品重量错误</option>' +
                    '<option value="商品产地信息错误">商品产地信息错误</option>' +
                    '<option value="商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改">商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改</option>' +
                    '<option value="检验报告不符合要求">检验报告不符合要求</option>' +
                    '<option value="0">其它自定义填写</option>' +
                    '</select></p><div><label style="display: inline-block;width: 75px"></label>' +
                    '<textarea id="refused_why" placeholder="请输入拒绝原因" style="width: 350px;height: 100px;display: none;border: 1px solid #ccc;"></textarea></div>'+
                    '<div class="form-inline"><label style="display: inline-block;width: 75px">供应商：</label>' +
                    '<div class="form-group">' +'<label class="radio-inline"><input type="radio" value="0" checked name="refusedNotice" />不通知</label>'+
                    '<label class="radio-inline"><input type="radio" value="1" name="refusedNotice" />微信模板消息</label>' +
                    '<label class="radio-inline"><input type="radio" value="2" name="refusedNotice" />短信通知</label></div></div>',
                    okText: '确定',
                    cancel: true,
                    autoClose: false,
                    init: () => {
                        $('#audit_refused_choose').change(function() {
                            if($(this).val() == 0) {
                                $('#refused_why').show();
                            }else {
                                $('#refused_why').hide();
                            }
                        });
                    },
                    cancelCallback: () => {
                        thatModal.destroy();
                    },
                    okCallback: () => {
                        let val = $('#audit_refused_choose').val(),
                            refusedInfo = $('#refused_why').val();
                        if(val == 0 &&  refusedInfo== '') {
                            $('#refused_why').focus();
                            return;
                        }
                        let param = {
                            goods_id: goodsItem.goods_id,
                            refused_reason: val != 0 ? val : refusedInfo,
                            notice_way: $('input[name="refusedNotice"]:checked').val()
                        };
                        H.server.goods_audit_refused(JSON.stringify(param), (res) => {
                            if(res.code == 0){
                                thatModal.destroy();
                                this.getGoodsList();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                alert(res.message);
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '删除':
                let goodsInfo = this.state.goodsList[index];
                let deleteModal = H.Modal({
                    title: '删除',
                    width: '500',
                    content: '<p><label style="display: inline-block;width: 75px">品名：</label>'+goodsInfo.goods_name+'</p>' +
                    '<p><label style="display: inline-block;width: 75px">供应商：</label>'+goodsInfo.shops.shop_name+'</p>'+
                    '<p><label style="display: inline-block;width: 75px">删除原因：</label>' +
                    '<select value="商品照片模糊不清，请重新拍照上传" class="form-control" style="width: 350px;display: inline;" id="audit_refused_choose">' +
                    '<option value="商品照片模糊不清，请重新拍照上传">商品照片模糊不清，请重新拍照上传</option>' +
                    '<option value="商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片">商品照片不符合规范要求，请阅读《找冻品网商品规范书》后重新上传照片</option>' +
                    '<option value="图片与商品信息不符">图片与商品信息不符</option>' +
                    '<option value="缺少明显“清真”标记的照片">缺少明显“清真”标记的照片</option>' +
                    '<option value="抄码商品的重量和金额必须填最大值，不能按公斤报价">抄码商品的重量和金额必须填最大值，不能按公斤报价</option>' +
                    '<option value="商品重量错误">商品重量错误</option>' +
                    '<option value="商品产地信息错误">商品产地信息错误</option>' +
                    '<option value="商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改">商品优势描述不符合要求，请阅读《找冻品网商品规范书》后修改</option>' +
                    '<option value="检验报告不符合要求">检验报告不符合要求</option>' +
                    '<option value="0">其它自定义填写</option>' +
                    '</select></p><div><label style="display: inline-block;width: 75px"></label>' +
                    '<textarea id="refused_why" placeholder="请输入下架原因" style="width: 350px;height: 100px;display: none;border: 1px solid #ccc;"></textarea></div>'+
                    '<div class="form-inline"><label style="display: inline-block;width: 75px">供应商：</label>' +
                    '<div class="form-group">' +'<label class="radio-inline"><input type="radio" value="0" checked name="refusedNotice" />不通知</label>'+
                    '<label class="radio-inline"><input type="radio" value="1" name="refusedNotice" />微信模板消息</label>' +
                    '<label class="radio-inline"><input type="radio" value="2" name="refusedNotice" />短信通知</label></div></div>',
                    okText: '确定',
                    cancel: true,
                    autoClose: false,
                    init: () => {
                        $('#audit_refused_choose').change(function() {
                            if($(this).val() == 0) {
                                $('#refused_why').show();
                            }else {
                                $('#refused_why').hide();
                            }
                        });
                    },
                    cancelCallback: () => {
                        deleteModal.destroy();
                    },
                    okCallback: () => {
                        let val = $('#audit_refused_choose').val(),
                            refusedInfo = $('#refused_why').val();
                        if(val == 0 &&  refusedInfo== '') {
                            $('#refused_why').focus();
                            return;
                        }
                        let param = {
                            goods_id: goodsInfo.goods_id,
                            delete_reason: val != 0 ? val : refusedInfo,
                            notify_way: $('input[name="refusedNotice"]:checked').val()
                        };
                        H.server.goods_ordinary_delete(param, (res) => {
                            if(res.code == 0){
                                deleteModal.destroy();
                                this.getGoodsList();
                                this.state.marketUpdate = !this.state.marketUpdate;
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                alert(res.message);
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '原因':
                console.log('原因');
                break;
        }
    }

    //刷新;
    refresh() {
        let defaultParam = {
            shop_id: null,        //店铺ID;
            goods_status: 0,   //店铺筛选中的店铺状态,0=全部 1=新增 5=已拒绝 6=修改;
            page: 1,           //页吗;
            size: 30,           //每页数据条数;
            sort_field: 'id'
        };
        this.state.defaultParam = defaultParam;
        this.state.getGoodsList();
    }

    render() {
        return (
            <div className="section-warp container-fluid">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh.bind(this)}/>
                    <div className="filter-row">
                        {this.createArea()}
                    </div>
                </div>
                <div className="section-table row">
                    <div className="row">
                        <div className="col-lg-3">
                            {
                                this.state.currentAreaId ? <MarketShopList areaId={this.state.currentAreaId} callback={this.setShopId} updateState={this.state.marketUpdate} /> : ''
                            }
                        </div>
                        <div className="col-lg-9">
                            <div className="section-filter">
                                <div className="filter-row">
                                    <BtnGroup btnNames={['全部', '新增', '已拒绝', '修改']} bindData={[0, 1, 5, 6]} clickCallback={this.setShopState.bind(this)}
                                              style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.defaultParam.goods_status}/>
                                </div>
                            </div>
                            <div className="section-table">
                                {this.createTable()}
                                <PageCtrlBar pageNum={this.state.defaultParam.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
                            </div>
                        </div>
                    </div>
                    {this.state.goodsInfoPanel}
                </div>
            </div>
        );
    }
}

export default GoodsAudit;