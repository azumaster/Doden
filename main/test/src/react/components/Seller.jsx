/*
*props传入的参数是seller(name, grade, place, commentStar,commentSpeed, averageComment,breakRuleTimes)
*
* */
import Star from './Star.jsx';
class Seller extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <ul>
                <li>供应商：{this.props.seller.name}</li>
                <li>店铺等级：{this.props.seller.grade}</li>
                <li>发货点：{this.props.seller.place}</li>
                <li>服务评价：<Star starNum={this.props.seller.commentStar}/></li>
                <li>发货速度：<Star starNum={this.props.seller.commentSpeed}/></li>
                <li>商品总评：<Star starNum={this.props.seller.averageComment}/></li>
                <li>违规次数：{this.props.seller.breakRuleTimes}</li>
            </ul>
        );
    }
}
export  default Seller;

