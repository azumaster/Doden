import Seller from './Seller.jsx';
import Comments from './Comments.jsx';
/*
* props 传入的是product（name,brand,origin,model,specification,imgurl,commentsNum）
*seller
* comments
* */

class GoodsDetailedInfo extends React.Component{
    constructor(){
        super();
        this.state={
            showNo: 2
        };
    }


//第一个是map出所有的评论。
    mapComments(){
        let comments=[];
        this.props.comments.map((comment)=>(
            comments.push(<Comments comments={comment}/>)
        ));
        return comments;
    }
    createGoodsInfo(){
        let goods=[];
        goods.push(
        <div class="cell">
            <div class="cell-primary">
                <ul>
                    <li>品名:{this.props.product.name}</li>
                    <li>品牌:{this.props.product.brand}</li>
                    <li>产地:{this.props.product.origin}</li>
                    <li>型号:{this.props.product.model}</li>
                    <li>规格:{this.props.product.specification}</li>
                    <li>描述
                        <div >
                            <p><img src={this.props.product.imgurl} style={{height:'70px', width:'70px'}}/></p>
                            <p><img src={this.props.product.imgurl} style={{height:'70px', width:'70px'}}/></p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="cell-ft">
            </div>
        </div>
        );
        return goods;
    }
    createComment(){
        let comment=[];
        comment.push(
            <div class="cell">
                <div class="cell-primary">
                    商品评价:{this.props.product.commentNum}
                    好评度：98%
                </div>
                <div class="cell-ft">
                    {this.mapComments()}
                </div>
            </div>
        );
        return comment;
    }
    createSupply(){
        let supply=[];
        supply.push(
            <div class="cell">
                <div class="cell-primary">
                    <Seller seller={this.props.seller}/>
                </div>
                <div class="cell-ft">
                </div>
            </div>
        );
        return supply;
    }

    handleOne(){
        this.setState({showNo:1});
    }
    handleTwo(){
        this.setState({showNo:2});
    }
    handleThree(){
        this.setState({showNo:3});
    }
    render(){
        let result=[];
        switch(this.state.showNo){
            case 1:
                result=this.createGoodsInfo();
                break;
            case 2:
                result=this.createComment();
                break;
            case 3:
                result=this.createSupply();
                break;
        }
        return(
        <div className="cells page">
            <div className="tab flex-box">
                <a className="btn flex-num1" onClick={this.handleOne.bind(this)}>详情</a>
                <a className="btn flex-num1" onClick={this.handleTwo.bind(this)}>评价（{ this.props.product.commentsNum < 99 ? this.props.product.commentsNum : '99+'}）</a>
                <a className="btn flex-num1" onClick={this.handleThree.bind(this)}>供应商</a>
            </div>
            {result}
        </div>
        );
    }
}
export default GoodsDetailedInfo;