/*
访问日志
* */
import DatePicker from '../../../../components/datePicker/index.jsx';
import AccessTable from './access_table.jsx';
import GoodsPage from './goods_page.jsx';

class AccessLog extends React.Component{

    constructor(){
        super();
        let dateTemp = H.Date;
        let date = {
            year: dateTemp.getFullYear(),
            month: dateTemp.getMonth(),
            day: dateTemp.getDate() - 1
        };
        let dateFormat = date.year + '-' +date.month + '-' +date.day;
        this.state = {
            areaData: [],

            //都是要提交的参数
            pageNo: 1, //页面的页数
            size: 20,  //一页的数据
            currentShopType: 1000, //选择商店类型
            currentArea: 2, //当前地区
            currentPage: 1, //所在哪个页面
            aboveTableResult: {}, //表格上面的数据
            result: '', //查询出来的数据
            time: {   //起止时间对象
                start: dateFormat,
                end: dateFormat
            },
            order: 'viewed_person', //排序方式
            
            detailedResult: [] //商品详细访问日志
             
        };
        this.createSelectArea = this.createSelectArea.bind(this);
        this.createTable = this.createTable.bind(this);
        this.setPageNum = this.setPageNum.bind(this);
    }

    //获得数据 还需要添加出错的判断（）
    componentWillMount(){
        H.server.other_customArea_list({}, (res) => {
            if(res.code == 0) {
                this.setState({
                    areaData: res.data
                }, this.freshData);
            }
        });

    }

    //获取表格上面的数据 (总情况的说明数据)
    getDataAboveTable(){
        let paraShop = {
            divide_id: this.state.currentArea,
            page_type: this.state.currentPage,
            query_time: this.state.time.start,
            end_time: this.state.time.end,
            shop_type: this.state.currentShopType
        };
        if(this.state.currentPage == 6){
            let paraGoods = {
                divide_id: this.state.currentArea,
                page_type: this.state.currentPage,
                query_time: this.state.time.start,
                end_time: this.state.time.end
            };
            H.server.statistic_goods_all(paraGoods, (res) => {
                if(res.code == 0){
                    this.setState({
                        aboveTableResult: res.data
                    });
                }else{
                    console.log(res.message);
                }
            });
        }else{
            H.server.statistic_page_all(paraShop, (res) =>{
                if(res.code == 0){
                    this.setState({
                        aboveTableResult: res.data
                    });
                }else{
                    console.log(res.message);
                }
            });
        }
    }

    //获取我们的筛选出来的数据
    getResult(){
        let paraShop = {
            divide_id: this.state.currentArea,
            page_type: this.state.currentPage,
            query_time: this.state.time.start,
            end_time: this.state.time.end,
            shop_type: this.state.currentShopType,
            orderby: this.state.order,
            page: this.state.pageNo,
            size: 20
        };
        if(this.state.currentPage == 6){
            let paraGoods = {
                divide_id: this.state.currentArea,
                page_type: this.state.currentPage,
                query_time: this.state.time.start,
                end_time: this.state.time.end,
                orderby: this.state.order,
                page: this.state.pageNo,
                size: 20
            };
            H.server.statistic_goods_detail(paraGoods, (res)=>{
                if(res.code == 0){
                    this.setState({
                        result: res.data
                    });
                }else{
                    console.log(res.message);
                }
            });
        }else{
            H.server.statistic_page_detail(paraShop, (res) => {
                if(res.code == 0) {
                    this.setState({
                        result: res.data
                    });
                }
            });
        }
    }

    //刷新数据
    freshData(){
        this.getDataAboveTable();
        this.getResult();
    }

    //切换地区
    toggleArea(e){
        let index = e.target.dataset.index;
        this.setState({
            currentArea: index,
            pageNo: 1
        }, this.freshData);
    }

    //切换页面
    togglePage(index){
        if(index == 6){
            $('.filter-row:eq(3)').css({'display':'none'});
        }else{
            $('.filter-row:eq(3)').css({'display':'block'});
        }
        this.setState({
            currentPage: index,
            pageNo: 1
        }, this.freshData);
    }

    //切换批次
    toggleType(index){
        if(index == 0){
            this.setState({
                currentArea: 2
            });
        }
        this.setState({
            currentShopType: index,
            pageNo: 1
        }, this.freshData);

    }

    //setPageNum表格下面的分页
    setPageNum(page){
        this.setState({
            pageNo: page.page
        }, this.getResult);
    }

    //将初始化时间赋值给输入框
    componentDidMount(){
        $('#transfer_order_buyer_startTime').val(this.state.time.start);
        $('#transfer_order_buyer_endTime').val(this.state.time.end);
    }

    //searchEvent点击筛选按钮
    searchEvent(){
        let timeStart = $('#transfer_order_buyer_startTime').val();
        let timeEnd = $('#transfer_order_buyer_endTime').val();
        this.setState({
            time:{
                start: timeStart,
                end: timeEnd
            },
            pageNo: 1
        }, this.freshData);
    }

    //创建可以选择的区域(filter)
    createSelectArea(){
        return(
            <div className="section-filter">
                <form className="form-inline">
                    <div className="filter-row">
                        <div className="btn-group">
                            {
                                this.state.areaData.map((data, index) => {
                                    return (
                                        <btn key={index}
                                             className={data.area_id == this.state.currentArea ? 'btn btn-sm btn-default' : 'btn btn-sm'}
                                             data-index={data.area_id}
                                             onClick={this.toggleArea.bind(this)}
                                        >{data.area_name}</btn>
                                    );
                                })
                            }
                        </div>

                    </div>
                    <div className="filter-row">
                        <div className="btn-group">
                            <btn className={this.state.currentPage == 1 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.togglePage.bind(this, 1)} >团购页</btn>
                            <btn className={this.state.currentPage == 2 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.togglePage.bind(this, 2)}>新品页</btn>
                            <btn className={this.state.currentPage == 3 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.togglePage.bind(this, 3)}>热销页</btn>
                            <btn className={this.state.currentPage == 4 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.togglePage.bind(this, 4)}>涨跌页</btn>
                            <btn className={this.state.currentPage == 6 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.togglePage.bind(this, 6)}>商品页</btn>
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="btn-group">
                            <btn className="btn btn-sm btn-default">昨日</btn>
                            <btn className="btn btn-lg" style={{marginRight: '40px'}}>日期选择</btn>
                            <DatePicker prefix="transfer_order_buyer_" title="时间筛选" searchEvt={this.searchEvent.bind(this)} />
                        </div>
                    </div>
                    <div className="filter-row">
                        <div className="btn-group">
                            <btn className={this.state.currentShopType == 1000 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 1000)} >全部</btn>
                            <btn className={this.state.currentShopType == 11 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 11)} >一批</btn>
                            <btn className={this.state.currentShopType == 21 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 21)} >二批</btn>
                            <btn className={this.state.currentShopType == 24 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 24)} >终端</btn>
                            <btn className={this.state.currentShopType == 1 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 1)} >其他</btn>
                            <btn className={this.state.currentShopType == 0 ? 'btn btn-sm btn-default' : 'btn btn-sm'} onClick={this.toggleType.bind(this, 0)} >未注册</btn>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    //创建内容表格
    createTable(){

        let total = this.state.result.total;
        let tableTile = ['用户ID', '店铺名', '手机号', '微信名', '类型', '浏览次数', '主动分享次数', '时间起', '时间止'];
        let headers = ['当前结果', ',浏览次数', ',分享次数'];
        return(
            <AccessTable headers={headers} aboveTableResult={this.state.aboveTableResult} currentPage={this.state.currentPage}
                         tableTile={tableTile}  result={this.state.result.detail} setPageNum={this.setPageNum.bind(this)} total={total}/>
        );
    }

    render(){
        if(!this.state.result) return null;
        let para = {
            query_time: this.state.time.start,
            end_time: this.state.time.end,
            orderby: this.state.order,
            page: this.state.pageNo,
            size: 20
        };
        return(
            <div className="section-warp">
                {this.createSelectArea()}

                <div className="section-table" >
                    {
                        this.state.currentPage == 6 ? <GoodsPage currentPage={this.state.currentPage} aboveTableResult={this.state.aboveTableResult}
                                                                 result={this.state.result} para={para} setPageNum={this.setPageNum.bind(this)} />
                                                        : this.createTable()
                    }
                </div>
            </div>
        );
    }
}
export  default AccessLog;