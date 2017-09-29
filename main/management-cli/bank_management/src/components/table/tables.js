/**
 * Created by Administrator on 2016/1/29.
 * 表格组件
 * @param headTextArr = ['收款ID','订单ID','付款人','实收金额','订单金额','优惠金额','付款方式','确认人','资金位置','付款确认时间','操作']
 *
 */
var React = require('react');

/*表格头*/
var TableHead = React.createClass({
    render: function () {
        return (
            <tr>
                {
                    this.props.tableTile.map(function (title,index) {
                        return <th key={index}>{title}</th> ;
                    })
                }
            </tr>
        )
    }
});
/*整个表*/
var Table = React.createClass({
    render: function () {
        var headTextArr = this.props.titles,
            data = this.props.res;
        return (
            <table className="table table-bordered table-hover table-responsive">
                <thead><TableHead tableTile={headTextArr} /></thead>
                {/*<TableBody data={data} types={this.props.types} />*/}
                {this.props.children}
            </table>
        )
    }
});


module.exports = Table;