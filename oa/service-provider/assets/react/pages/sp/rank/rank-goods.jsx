/*
 *商品排行 */
import  DatePicker from '../../../../components/datePicker/index.jsx';
import  Pagination from '../../../../components/page/paging.js';
class RankGoods extends React.Component{
    constructor(props){
    super(props); 
    this.state = {
       data: null,    //用于存储请求回来的数据
       totalPage: 1,   //总页数
       rate: 1,   //设置比例
       isShow: '销售额(元)',  //控制显示销售额or笔数
       param: {
            time: [H.GetDateStr(-6).time1, H.GetDateStr(0).time1], 
            rule: 'amount', //默认按销售额排
            page: 1, 
            size: 15  //默认每页显示15条数据

       }
    };
}
//获取日期范围
    dateRange(){
        let param = this.state.param;
        param.time[0] = $('#rank_goods_startTime').val();
        param.time[1] = $('#rank_goods_endTime').val();
        this.setState({param: param});
    }
     componentWillMount(){
        this.getData();
    }
      //获取mock数据
    getData(){
        H.server.rank_goods(JSON.stringify(this.state.param), (res)=> {
            if(res.code == 0){            
                this.setState({data: res.data.data, totalPage: Math.ceil(res.data.total/this.state.param.size)});
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
        if(w=='num'){
            param.rule = w;
            this.setState({param: param, isShow : '笔数'});
        }
        else{
                param.rule = w;
                this.setState({param: param, isShow: '销售额(元)'});
            } 
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
                        <td className="text-center">{orderdata[i].goods_name}</td>
                        <td className="text-center">{orderdata[i].sp_name}</td>
                        <td className="text-center">{orderdata[i].data}</td>
                        <td><p style={{height:'40px', background:'gray', width:(orderdata[i].data/rate)*100+'%'}}></p></td>
                    </tr>
                );
            };
           return(
               <div className="rank-goods-wrap">
                <div className="section-filter">
                    <div className="form-inline">
                        <div className="filter-row">
                            <DatePicker start={this.state.param.time[0]} end={this.state.param.time[1]}
                                        prefix="rank_goods_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)} />
                            <label className="radio-inline">
                                <input type="radio" name="radioname" value="amount" checked={this.state.param.rule == 'amount'}
                                       onChange={this.radioHandler.bind(this, 'amount')}
                                       id="rank_order_amount"/>销售额</label>
                            <label className="radio-inline">
                                <input type="radio" name="radioname" value="num" checked={this.state.param.rule == 'num'}
                                       onChange={this.radioHandler.bind(this, 'num')}
                                       id="rank_order_num"/>笔数</label>
                            <a href="javascript:;" className="btn btn-sm btn-orange" onClick={this.getData.bind(this)}>筛选</a>
                        </div>
                    </div>
                </div>
                <table className="table table-bordered table-striped">
                   <tbody>
                        <tr>
                            <th className="text-center">排名</th><th className="text-center">商品名</th><th className="text-center">卖家店铺</th><th className="text-center">{this.state.isShow}</th><th className="text-center">比例图</th>
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
export default RankGoods;