/*
*订单排行*/
import  DatePicker from '../../../../components/datePicker/index.jsx';
import  Pagination from '../../../../components/page/paging.js';
// import ReactPaginate from 'react-paginate';
class RankOrder extends React.Component{
constructor(props){
    super(props); 
    this.state = {
       data: null,    //用于存储请求回来的数据
       totalPage: 1,   //总页数
       rate: 1,    //设置对比图比例
       param: {
            time: [H.GetDateStr(-6).time1, H.GetDateStr(0).time1], 
            rule: 'amount', //默认按销售额排
            contrast: 'district',  //默认按照区域
            page: 1, 
            size: 15  //默认每页显示15条数据
       }
    };
}
//获取日期范围
    dateRange(){
        let param = this.state.param;
        param.time[0] = $('#rank_order_startTime').val();
        param.time[1] = $('#rank_order_endTime').val();
        this.setState({param: param});
    }
    componentWillMount(){
        this.getData();
    }

    //获取mock数据
    getData(){
        H.server.rank_order(JSON.stringify(this.state.param), (res)=> {
            if(res.code == 0){
                    this.setState({data: res.data.data});
                    this.setState({totalPage: Math.ceil(res.data.total/this.state.param.size)});
            }
            if(res.data.current == 1){
                this.setState({rate: res.data.data[0].data});
            }
        });
    }
    //改变页码
     changePage(n) {
         let param = this.state.param;
         let newParam = Object.assign(param, n);
         this.setState({param: newParam}, ()=> {
                this.getData();
         });
    }
    //改变筛选条件
    radioHandler(w) {
        let param = this.state.param;
        param.rule = w;
        this.setState({param: param});
    }
     radioHandler2(m) {
        let param = this.state.param;
        param.contrast = m;
        this.setState({param: param});
    }
    //渲染
    render(){
        if(!this.state.data) return null;
        var list = [];
            var orderdata = this.state.data;
            var rate = this.state.rate;
            var len = orderdata.length;
            for(let i=0;i<len;i++){               
                list.push(
                    <tr className="table table-bordered table-striped" key={i} >
                        <td className="text-center">{i+1}</td>
                        <td className="text-center">{orderdata[i][this.state.param.contrast]}</td>
                        <td className="text-center">{orderdata[i].data}</td>
                        <td><p style={{height:'40px', background:'gray', width:(orderdata[i].data/rate)*100+'%'}}></p></td>
                    </tr>
                );
            };
        return(
            <div className="rank-order-wrap">

                <div className="section-filter">

                    <div className="form-inline">
                        <div className="filter-row">
                            <DatePicker start={this.state.param.time[0]} end={this.state.param.time[1]}
                                        prefix="rank_order_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)} />
                            <label className="radio-inline">
                                <input type="radio" name="radioname" value="amount"
                                       id="rank_order_sale" checked={this.state.param.rule == 'amount'}
                                       onChange={this.radioHandler.bind(this, 'amount')}/>销售额</label>
                            <label className="radio-inline">
                                <input type="radio" name="radioname" value="num"
                                       id="rank_order_amount" checked={this.state.param.rule == 'num'}
                                       onChange={this.radioHandler.bind(this, 'num')}/>笔数</label>
                            <label className="radio-inline">
                                <input type="radio" name="radioname" value="avg"
                                       id="rank_order_average" checked={this.state.param.rule == 'avg'} 
                                       onChange={this.radioHandler.bind(this, 'avg')}/>单均值</label>
                            <label className="radio-inline">
                                <input type="radio" name="radioname2" value="district"
                                       id="rank_order_district" checked={this.state.param.contrast == 'district'}
                                       onChange={this.radioHandler2.bind(this, 'district')}/>区域</label>
                            <label className="radio-inline">
                                <input type="radio" name="radioname2" value="sp_shop"
                                       id="rank_order_sp_shop" checked={this.state.param.contrast == 'sp_shop'}
                                       onChange={this.radioHandler2.bind(this, 'sp_shop')}/>店铺</label>
                            <a href="javascript:;" className="btn btn-sm btn-orange" onClick={this.getData.bind(this)}>筛选</a>
                        </div>
                    </div>
                </div>
               <table className="table table-bordered table-striped">
                   <tbody>
                        <tr>
                            <th className="text-center">排名</th><th className="text-center">区域/店铺名</th><th className="text-center">销售额(元)</th><th className="text-center">比例图</th>
                        </tr>
                        {list}
                   </tbody>
               </table>
               {/*分页功能*/}
               <Pagination pageNum={this.state.param.page} maxPage={this.state.totalPage} clickCallback={this.changePage.bind(this)} />
            </div>
        );
    }
}
export default RankOrder;